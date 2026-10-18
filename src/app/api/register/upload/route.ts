import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";
import { getSettings } from "@/lib/settings";
import { clientIp, rateLimit } from "@/lib/spam";
import { MAX_UPLOAD, REG_UPLOAD_PREFIX, UPLOAD_TYPES, useBlob } from "@/lib/storage";

// Issues short-lived tokens so the browser can upload a project file (≤10 MB) straight to
// Vercel Blob, bypassing Vercel's 4.5 MB function request limit.
export async function POST(req: Request) {
  if (!useBlob()) return NextResponse.json({ error: "Direct upload is not configured." }, { status: 400 });
  const body = (await req.json()) as HandleUploadBody;
  try {
    const json = await handleUpload({
      body,
      request: req,
      onBeforeGenerateToken: async (pathname) => {
        if (!(await getSettings()).registrationOpen) throw new Error("Registration is closed.");
        if (!rateLimit(`upload:${clientIp(req.headers)}`, 10, 15 * 60_000)) throw new Error("Too many uploads. Please wait a few minutes.");
        if (!pathname.startsWith(REG_UPLOAD_PREFIX)) throw new Error("Invalid upload path.");
        return {
          allowedContentTypes: UPLOAD_TYPES,
          maximumSizeInBytes: MAX_UPLOAD,
          addRandomSuffix: true,
        };
      },
      onUploadCompleted: async () => {},
    });
    return NextResponse.json(json);
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 400 });
  }
}
