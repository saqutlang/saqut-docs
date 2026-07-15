import { defineMiddleware } from "astro:middleware";

export const onRequest = defineMiddleware(async (context, next) => {
  const response = await next();

  // Clone because response body can only be read once
  const cloned = response.clone();
  const headers = new Headers(response.headers);

  // RFC 8288 Link headers for agent discovery
  headers.set(
    "Link",
    [
      '</.well-known/api-catalog>; rel="api-catalog"',
      '</auth.md>; rel="service-doc"',
      '</.well-known/mcp/server-card.json>; rel="mcp-server-card"',
    ].join(", "),
  );

  // Markdown for Agents support signal
  headers.set("Vary", "Accept");

  return new Response(cloned.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
});
