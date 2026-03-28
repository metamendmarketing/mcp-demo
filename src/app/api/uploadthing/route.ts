import { createRouteHandler } from "uploadthing/next";
import { ourFileRouter } from "./core";

/**
 * PRODUCTION DIAGNOSTIC: Ensure UPLOADTHING_TOKEN is clean of quotes/spaces 
 * commonly introduced during manual environment variable entry.
 */
if (process.env.UPLOADTHING_TOKEN) {
  process.env.UPLOADTHING_TOKEN = process.env.UPLOADTHING_TOKEN.replace(/['"]/g, '').trim();
}

// Export routes for Next App Router
export const { GET, POST } = createRouteHandler({
  router: ourFileRouter,
});
