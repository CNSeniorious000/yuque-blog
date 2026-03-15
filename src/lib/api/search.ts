import { apiBaseurl, headers } from "$lib/serverConstants";

interface SearchDoc {
  slug: string;
  title: string;
  description?: string | null;
}

interface SearchResult {
  type: "doc" | "repo";
  target?: SearchDoc;
}

interface SearchPostsOptions {
  scope?: string;
  creator?: string;
}

function stripHighlightTags(text: string | null | undefined) {
  return text?.replaceAll(/<\/?em>/g, "") ?? "";
}

export async function searchPosts(query: string, { scope, creator }: SearchPostsOptions = {}) {
  const params = new URLSearchParams({
    q: query,
    type: "doc",
    page: "1",
  });
  if (scope) {
    params.set("scope", scope);
  }
  if (creator) {
    params.set("creator", creator);
  }

  const res = await fetch(`${apiBaseurl}/search?${params}`, { headers });
  if (!res.ok) {
    throw new Error(`Failed to search posts "${query}": ${res.statusText}`);
  }

  const { data, meta: { total } } = await res.json() as { data: SearchResult[]; meta: { total: number } };

  return {
    total,
    articles: data
      .filter(({ type, target }) => type === "doc" && Boolean(target))
      .map(({ target }) => ({
        slug: target!.slug,
        title: stripHighlightTags(target!.title),
        description: stripHighlightTags(target!.description),
      })),
  };
}
