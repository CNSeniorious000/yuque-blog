import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async ({ fetch, params: { path } }) => {
  const res = await fetch(`https://cdn.nlark.com/${path}`);
  return new Response(res.body, res);
};
