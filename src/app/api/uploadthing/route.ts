import { createRouteHandler } from "uploadthing/next";
import { NextRequest } from "next/server";
import { ourFileRouter } from "./core";

// Export routes for Next App Router
const { GET: originalGET, POST: originalPOST } = createRouteHandler({
  router: ourFileRouter,
});

export const GET = async (req: NextRequest) => {
  console.log("UploadThing GET request received at:", req.url);
  return originalGET(req);
};

export const POST = async (req: NextRequest) => {
  console.log("UploadThing POST request received at:", req.url);
  return originalPOST(req);
};
