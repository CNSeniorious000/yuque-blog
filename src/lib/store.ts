import { writable } from "svelte/store";

export const progressStore = writable({ progress: 0, loading: false });

export const isDark = writable(false);

export const breadcrumb = writable<[string, string][]>([]); // [href, title]
export const rightTop = writable("");
export const leftBottom = writable("");
export const rightBottom = writable("");
