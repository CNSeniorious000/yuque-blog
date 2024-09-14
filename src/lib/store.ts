import { writable } from "svelte/store";

export const progressStore = writable({ progress: 0, loading: false });

export const isDark = writable(false);

export const rightTop = writable("");
export const leftBottom = writable("");
export const editUrl = writable("");

export const pageTitle = writable("Muspi Merol");
export const pageDescription = writable("");
