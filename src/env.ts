import { defineEnvVars } from "@sveltejs/kit/env";
import { requireGithubToken } from "#lib/api/github.js";
import { building } from "$app/env";

// route analysis and builds may run without a token; the server itself cannot — fail at boot with github.ts's error
export const variables = defineEnvVars({
  GITHUB_TOKEN: { schema: input => (building ? input ?? "" : requireGithubToken(input)) },
});
