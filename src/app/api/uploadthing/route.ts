import { createRouteHandler } from "uploadthing/next";
import { ourFileRouter } from "./core";

/**
 * RESILIENT AUTHENTICATION LAYER:
 * We manually decode the UPLOADTHING_TOKEN to ensure stability on the Edge.
 * This bypasses potential parser conflicts with sub-path hosting.
 */
if (process.env.UPLOADTHING_TOKEN) {
  try {
    const raw = process.env.UPLOADTHING_TOKEN.replace(/['"\s]/g, '');
    const decoded = JSON.parse(Buffer.from(raw, 'base64').toString());
    if (decoded.apiKey) process.env.UPLOADTHING_SECRET = decoded.apiKey;
    if (decoded.appId) process.env.UPLOADTHING_APP_ID = decoded.appId;
  } catch (e) {
    console.error("Manual Token Decode Failed:", e);
  }
}

// Export routes for Next App Router
export const { GET, POST } = createRouteHandler({
  router: ourFileRouter,
});
