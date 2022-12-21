import { writable } from "svelte/store";

export let progressStore = writable({ progress: 0, loading: false });

export let isDark = writable(false);

export let breadcrumbStore = writable([]); // [href, title]
export let rightTop = writable("");
export let leftBottom = writable("");
export let rightBottom = writable("");
