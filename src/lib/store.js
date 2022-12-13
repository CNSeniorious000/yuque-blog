import { writable } from "svelte/store";

export let progressStore = writable({ progress: 0, loading: false });

export let isDark = writable(false);
