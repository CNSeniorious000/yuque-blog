import { Buffer } from "node:buffer";
import process from "node:process";

const CSI = "\u001B[";
const ANSI_CODE = {
  reset: "\u001B[0m",
  hideCursor: "\u001B[?25l",
  showCursor: "\u001B[?25h",
  clearLine: "\u001B[2K",
  brightBlack: "\u001B[90m",
  green: "\u001B[32m",
  red: "\u001B[31m",
  cyan: "\u001B[36m",
} as const;
const FILLED_BAR_CHAR = "█";
const SCAN_BAR_CHAR = "▒";
const TRACK_BAR_CHAR = " ";
const LOG_PREFIX: Record<LogKind, string> = { info: ">", ok: "+", error: "x" };

const TUI_PALETTE = {
  title: "#F8FAFC",
  muted: "#94A3B8",
  modeRunning: "#93C5FD",
  modeDone: "#86EFAC",
  modeFailed: "#FDA4AF",
  value: "#E2E8F0",
  info: "#7DD3FC",
  ok: "#86EFAC",
  error: "#FDA4AF",
  barDone: "#F8FAFC",
} as const;
const TUI_MARGIN = 1;
const TUI_MARGIN_TEXT = " ".repeat(TUI_MARGIN);

export type LogKind = "info" | "ok" | "error";
type AnsiColorName = Exclude<keyof typeof ANSI_CODE, "clearLine" | "hideCursor" | "reset" | "showCursor">;
type RawWriter = (text: string) => void;

interface LogLine {
  kind: LogKind;
  text: string;
}

interface CollectorState {
  phase: string;
  postsProcessed: number;
  postsTotal: number;
  imagesProcessed: number;
  imagesTotal: number;
  successCount: number;
  failureCount: number;
  startedAt: number;
  finishedAt: number | null;
}

export interface PostProgress {
  processed: number;
  total: number;
  currentPost?: string;
}

export interface ImageProgress {
  processed: number;
  total: number;
  successCount: number;
  failureCount: number;
  currentImage?: string;
}

export interface CollectorUi {
  setBootInfo: () => void;
  setPhase: (phase: string, status: string) => void;
  setPostProgress: (progress: PostProgress) => void;
  setImageProgress: (progress: ImageProgress) => void;
  appendLog: (kind: LogKind, message: string) => void;
  finish: (status: string) => void;
  fail: (message: string) => void;
  waitForExit: () => Promise<void>;
  shutdown: (preserveOutput?: boolean) => Promise<void>;
  onInterrupt?: (handler: () => void) => () => void;
  needsExplicitExit?: boolean;
}

function formatDuration(ms: number) {
  const seconds = Math.max(0, Math.floor(ms / 1000));
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  return minutes > 0
    ? `${minutes}m ${remainingSeconds.toString().padStart(2, "0")}s`
    : `${remainingSeconds}s`;
}

function formatEta(elapsedMs: number, progress: number, isFinished: boolean) {
  if (isFinished) {
    return "0s";
  }

  if (progress <= 0 || progress >= 1) {
    return "--";
  }

  return formatDuration(elapsedMs * ((1 - progress) / progress));
}

function truncateMiddle(value: string, maxLength = 64) {
  if (value.length <= maxLength) {
    return value;
  }

  const edgeLength = Math.max(8, Math.floor((maxLength - 3) / 2));
  return `${value.slice(0, edgeLength)}...${value.slice(-edgeLength)}`;
}

function getHostLabel(url: string) {
  try {
    return new URL(url).hostname;
  } catch {
    return truncateMiddle(url, 32);
  }
}

function getModeColor(mode: "running" | "done" | "failed") {
  return mode === "done"
    ? TUI_PALETTE.modeDone
    : mode === "failed"
      ? TUI_PALETTE.modeFailed
      : TUI_PALETTE.modeRunning;
}

function ansiColorize(color: AnsiColorName, text: string) {
  return `${ANSI_CODE[color]}${text}${ANSI_CODE.reset}`;
}

function defaultRawWriter(text: string) {
  process.stdout.write(text);
}

function writeStdout(line: string) {
  process.stdout.write(`${line}\n`);
}

async function createPreferredRawWriter(): Promise<RawWriter> {
  const moduleId = "bun:ffi";

  try {
    const { dlopen, ptr } = await import(moduleId) as {
      dlopen: (library: string, symbols: Record<string, { args: string[]; returns: string }>) => {
        symbols: Record<string, (...args: unknown[]) => number | boolean>;
      };
      ptr: (value: ArrayBufferView) => number;
    };
    const kernel32 = dlopen("kernel32.dll", {
      GetStdHandle: { args: ["i32"], returns: "ptr" },
      WriteConsoleW: { args: ["ptr", "ptr", "u32", "ptr", "ptr"], returns: "bool" },
    });
    const stdoutHandle = kernel32.symbols.GetStdHandle(-11);

    if (!stdoutHandle) {
      return defaultRawWriter;
    }

    return (text: string) => {
      const buffer = Buffer.from(text, "utf16le");
      const charsWritten = new Uint32Array(1);
      const ok = kernel32.symbols.WriteConsoleW(
        stdoutHandle,
        ptr(buffer),
        buffer.byteLength / 2,
        ptr(charsWritten),
        0,
      );

      if (!ok) {
        defaultRawWriter(text);
      }
    };
  } catch {
    return defaultRawWriter;
  }
}

function parseHexColor(hex: string) {
  const value = hex.replace("#", "").slice(0, 6);
  if (value.length !== 6) {
    return null;
  }

  const red = Number.parseInt(value.slice(0, 2), 16);
  const green = Number.parseInt(value.slice(2, 4), 16);
  const blue = Number.parseInt(value.slice(4, 6), 16);

  if ([red, green, blue].some(Number.isNaN)) {
    return null;
  }

  return { red, green, blue };
}

function paint(text: string, options: { bold?: boolean; color?: string; dim?: boolean } = {}) {
  const parts: string[] = [];

  if (options.bold) {
    parts.push(`${CSI}1m`);
  }

  if (options.dim) {
    parts.push(`${CSI}2m`);
  }

  if (options.color) {
    const rgb = parseHexColor(options.color);
    if (rgb) {
      parts.push(`${CSI}38;2;${rgb.red};${rgb.green};${rgb.blue}m`);
    }
  }

  if (parts.length === 0) {
    return text;
  }

  return `${parts.join("")}${text}${ANSI_CODE.reset}`;
}

function moveToFrameStart(lineCount: number) {
  return lineCount > 0 ? `${CSI}${lineCount}F` : "";
}

function moveUp(lineCount: number) {
  return lineCount > 0 ? `${CSI}${lineCount}A\r` : "";
}

function getFrameMetrics() {
  const rows = process.stdout.rows ?? 24;
  return {
    maxLogs: Math.max(1, Math.floor(rows / 3)),
    width: Math.max(32, (process.stdout.columns ?? 80) - TUI_MARGIN * 2),
  };
}

function getPipelineBar(scanProgress: number, imageProgress: number, width: number) {
  const scanWidth = Math.min(Math.floor(scanProgress * width), width);
  const imageWidth = Math.min(Math.floor(imageProgress * width), scanWidth);
  const pendingWidth = Math.max(scanWidth - imageWidth, 0);
  const trackWidth = Math.max(width - scanWidth, 0);

  return {
    image: FILLED_BAR_CHAR.repeat(imageWidth),
    scan: SCAN_BAR_CHAR.repeat(pendingWidth),
    track: TRACK_BAR_CHAR.repeat(trackWidth),
  };
}

function fitSegments(width: number, segments: Array<{ style?: { bold?: boolean; color?: string; dim?: boolean }; text: string }>) {
  let remaining = width;
  let output = "";

  for (const segment of segments) {
    if (remaining <= 0) {
      break;
    }

    const nextText = segment.text.length > remaining
      ? truncateMiddle(segment.text, remaining)
      : segment.text;

    output += paint(nextText, segment.style);
    remaining -= nextText.length;
  }

  return output;
}

class ConsoleCollectorUi implements CollectorUi {
  private lastPostProcessed = -1;
  private lastImageProcessed = -1;

  setBootInfo() {
    writeStdout(ansiColorize("brightBlack", `TTY unavailable, fallback to console mode. ACCESS_TOKEN ${process.env.ACCESS_TOKEN ? "present" : "missing"}`));
  }

  setPhase(phase: string, status: string) {
    writeStdout(`${ansiColorize("brightBlack", `[${phase}]`)} ${ansiColorize("cyan", status)}`);
  }

  setPostProgress({ processed, total, currentPost }: PostProgress) {
    if (processed === this.lastPostProcessed) {
      return;
    }

    this.lastPostProcessed = processed;
    writeStdout(`${ansiColorize("brightBlack", "[posts]")} ${ansiColorize("cyan", `${processed}/${total}`)} ${currentPost ? truncateMiddle(currentPost, 48) : ""}`.trim());
  }

  setImageProgress({ processed, total, successCount, failureCount, currentImage }: ImageProgress) {
    if (processed === this.lastImageProcessed || processed % 10 !== 0) {
      return;
    }

    this.lastImageProcessed = processed;
    writeStdout(`${ansiColorize("brightBlack", "[images]")} ${ansiColorize("cyan", `${processed}/${total}`)} ${ansiColorize("green", `ok=${successCount}`)} ${ansiColorize("red", `err=${failureCount}`)} ${currentImage ? getHostLabel(currentImage) : ""}`.trim());
  }

  appendLog(kind: LogKind, message: string) {
    writeStdout(ansiColorize(kind === "info" ? "cyan" : kind === "ok" ? "green" : "red", `${LOG_PREFIX[kind]} ${message}`));
  }

  finish(status: string) {
    writeStdout(ansiColorize("green", `DONE ${status}`));
  }

  fail(message: string) {
    console.error(ansiColorize("red", `FAILED ${message}`));
  }

  async waitForExit() {
    await Promise.resolve();
  }

  async shutdown() {
    await Promise.resolve();
  }
}

class InlineCollectorUi implements CollectorUi {
  private readonly logLines: LogLine[] = [];
  private readonly state: CollectorState = {
    phase: "boot",
    postsProcessed: 0,
    postsTotal: 0,
    imagesProcessed: 0,
    imagesTotal: 0,
    successCount: 0,
    failureCount: 0,
    startedAt: Date.now(),
    finishedAt: null,
  };

  private displayedScanProgress = 0;
  private displayedImageProgress = 0;
  private exitResolver: (() => void) | null = null;
  private readonly exitPromise: Promise<void>;
  private renderQueued = false;
  private renderedLineCount = 0;
  private shutdownComplete = false;
  private readonly writeRaw: RawWriter;

  needsExplicitExit = true;

  constructor(options: { writeRaw?: RawWriter } = {}) {
    this.exitPromise = new Promise((resolve) => {
      this.exitResolver = resolve;
    });
    this.writeRaw = options.writeRaw || defaultRawWriter;

    this.writeRaw(ANSI_CODE.hideCursor);
    this.queueRender();
  }

  setBootInfo() {}

  setPhase(phase: string, _status: string) {
    if (this.state.phase === phase) {
      return;
    }

    this.state.phase = phase;
    this.queueRender();
  }

  setPostProgress({ processed, total, currentPost: _currentPost }: PostProgress) {
    if (
      this.state.postsProcessed === processed
      && this.state.postsTotal === total
    ) {
      return;
    }

    this.state.postsProcessed = processed;
    this.state.postsTotal = total;
    this.queueRender();
  }

  setImageProgress({ processed, total, successCount, failureCount, currentImage: _currentImage }: ImageProgress) {
    if (
      this.state.imagesProcessed === processed
      && this.state.imagesTotal === total
      && this.state.successCount === successCount
      && this.state.failureCount === failureCount
    ) {
      return;
    }

    this.state.imagesProcessed = processed;
    this.state.imagesTotal = total;
    this.state.successCount = successCount;
    this.state.failureCount = failureCount;
    this.queueRender();
  }

  appendLog(kind: LogKind, message: string) {
    this.logLines.push({ kind, text: `${LOG_PREFIX[kind]} ${message}` });
    if (this.logLines.length > getFrameMetrics().maxLogs) {
      this.logLines.shift();
    }

    this.queueRender();
  }

  finish(_status: string) {
    this.complete("done");
  }

  fail(message: string) {
    this.logLines.push({ kind: "error", text: `${LOG_PREFIX.error} ${message}` });
    if (this.logLines.length > getFrameMetrics().maxLogs) {
      this.logLines.shift();
    }
    this.complete("failed");
  }

  async waitForExit() {
    await this.exitPromise;
  }

  async shutdown(preserveOutput = false) {
    if (this.shutdownComplete) {
      return;
    }

    this.flushRender();
    this.shutdownComplete = true;

    if (!preserveOutput && this.renderedLineCount > 0) {
      let output = moveToFrameStart(this.renderedLineCount);

      for (let index = 0; index < this.renderedLineCount; index += 1) {
        output += `${ANSI_CODE.clearLine}\n`;
      }

      output += moveUp(this.renderedLineCount);
      this.writeRaw(output);
      this.renderedLineCount = 0;
    }

    this.writeRaw(ANSI_CODE.showCursor);
    this.exitResolver?.();
  }

  private canExit() {
    return this.state.finishedAt !== null;
  }

  private complete(phase: "done" | "failed") {
    this.state.phase = phase;
    this.state.finishedAt = Date.now();
    this.queueRender();
    this.exitResolver?.();
  }

  private queueRender() {
    if (this.shutdownComplete || this.renderQueued) {
      return;
    }

    this.renderQueued = true;
    queueMicrotask(() => {
      this.renderQueued = false;
      this.flushRender();
    });
  }

  private flushRender() {
    if (this.shutdownComplete) {
      return;
    }

    const lines = this.buildFrameLines();
    const previousLineCount = this.renderedLineCount;
    const nextLineCount = lines.length;
    const outputLineCount = Math.max(previousLineCount, nextLineCount);
    let output = moveToFrameStart(previousLineCount);

    for (let index = 0; index < outputLineCount; index += 1) {
      output += ANSI_CODE.clearLine;
      if (index < nextLineCount) {
        output += lines[index];
      }
      output += "\n";
    }

    if (outputLineCount > nextLineCount) {
      output += moveUp(outputLineCount - nextLineCount);
    }

    this.renderedLineCount = nextLineCount;
    this.writeRaw(output);
  }

  private buildFrameLines() {
    const { maxLogs, width } = getFrameMetrics();
    const elapsedMs = (this.state.finishedAt ?? Date.now()) - this.state.startedAt;
    const rawScanProgress = this.state.postsTotal > 0 ? this.state.postsProcessed / this.state.postsTotal : 0;
    const rawImageProgress = this.state.imagesTotal > 0
      ? rawScanProgress * this.state.imagesProcessed / this.state.imagesTotal
      : 0;

    this.displayedScanProgress = Math.max(this.displayedScanProgress, rawScanProgress);
    this.displayedImageProgress = Math.min(
      this.displayedScanProgress,
      Math.max(this.displayedImageProgress, rawImageProgress),
    );

    const mode = this.state.phase === "failed"
      ? "failed"
      : this.canExit()
        ? "done"
        : "running";
    const title = mode === "done"
      ? "Collected image dimensions"
      : mode === "failed"
        ? "Failed collecting image dimensions"
        : "Collecting image dimensions";
    const overallProgress = (this.displayedScanProgress + this.displayedImageProgress) / 2;
    const elapsed = formatDuration(elapsedMs);
    const eta = formatEta(elapsedMs, overallProgress, this.canExit());
    const logs = this.logLines.length > 0
      ? this.logLines.slice(-Math.min(this.logLines.length, maxLogs))
      : [{ kind: "info", text: "waiting for results..." } satisfies LogLine];
    const body = [
      this.formatStatusLine(width, title, mode, elapsed, eta),
      this.formatBarLine(width),
      ...logs.map(line => this.formatLogLine(line, width)),
    ].map(line => `${TUI_MARGIN_TEXT}${line}${TUI_MARGIN_TEXT}`);

    return [
      TUI_MARGIN_TEXT,
      ...body,
      TUI_MARGIN_TEXT,
    ];
  }

  private formatStatusLine(width: number, title: string, mode: "running" | "done" | "failed", elapsed: string, eta: string) {
    return fitSegments(width, [
      { text: title, style: { bold: true, color: mode === "failed" ? TUI_PALETTE.error : TUI_PALETTE.title } },
      { text: ` ${mode}`, style: { color: getModeColor(mode) } },
      { text: `  ${elapsed} elapsed`, style: { color: TUI_PALETTE.muted } },
      { text: `  ETA ${eta}`, style: { color: TUI_PALETTE.muted } },
      { text: `  ${this.state.postsProcessed}/${this.state.postsTotal} posts`, style: { color: TUI_PALETTE.value } },
      { text: `  ${this.state.imagesProcessed}/${this.state.imagesTotal} images`, style: { color: TUI_PALETTE.value } },
      { text: `  ${this.state.failureCount} err`, style: { color: TUI_PALETTE.error } },
    ]);
  }

  private formatBarLine(width: number) {
    const bar = getPipelineBar(this.displayedScanProgress, this.displayedImageProgress, width);

    return [
      paint(bar.image, { bold: true, color: TUI_PALETTE.barDone }),
      paint(bar.scan, { color: TUI_PALETTE.barDone }),
      bar.track,
    ].join("");
  }

  private formatLogLine(line: LogLine, width: number) {
    const color = line.kind === "error"
      ? TUI_PALETTE.error
      : line.kind === "ok"
        ? TUI_PALETTE.ok
        : TUI_PALETTE.info;

    return paint(truncateMiddle(line.text, width), { color, dim: line.kind === "info" });
  }
}

export async function createCollectorUi(isInteractiveTerminal: boolean): Promise<CollectorUi> {
  if (!isInteractiveTerminal) {
    return new ConsoleCollectorUi();
  }

  const writeRaw = await createPreferredRawWriter();

  return new InlineCollectorUi({ writeRaw });
}
