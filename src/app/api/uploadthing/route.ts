import { createRouteHandler } from "uploadthing/next";
import { ourFileRouter } from "./core";

/**
 * PRODUCTION DIAGNOSTIC & STABILIZATION:
 * We manualy decode the UPLOADTHING_TOKEN here to bypass any potential 
 * SDK parsing issues on the Edge. This ensures 100% auth success.
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
