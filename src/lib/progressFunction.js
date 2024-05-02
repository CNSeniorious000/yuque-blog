import { progressStore } from "./store";

let placebo = null;
let loading = false;
let animationTimeout = null;

function startIncreasing() {
  if (!loading) {
    return console.warn({ loading });
  }

  let now = 0.2;
  progressStore.set({ progress: now, loading });

  const target = 0.7;
  const weight = 0.3;

  placebo = setInterval(() => {
    now = now * (1 - weight) + target * weight;
    progressStore.set({ progress: now, loading });
  }, 700);
}

function stopIncreasing() {
  clearInterval(placebo);
  placebo = null;
}

function resetBar() {
  if (animationTimeout) {
    clearTimeout(animationTimeout);
    animationTimeout = null;
  }
  if (placebo) {
    console.warn({ placebo });
  }
  progressStore.set({ progress: 0, loading });
}

export function startBar() {
  stopIncreasing();
  loading = true;
  resetBar();
  startIncreasing();
}

export function finishBar() {
  if (!loading) {
    return resetBar();
  }

  stopIncreasing();
  progressStore.set({ progress: 2, loading: false });

  animationTimeout = setTimeout(() => {
    if (!loading) {
      return;
    }
    loading = false;
    resetBar();
  }, 500); // reset progress bar after 500ms animation
}
