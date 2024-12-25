import { writable } from "svelte/store";

export const progressStore = writable({ progress: 0, loading: false });

export const language = writable<string | undefined>();
