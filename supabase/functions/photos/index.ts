// supabase/functions/photos/index.ts

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

serve(async (req) => {
  const url = new URL(req.url);
  const filename = url.pathname.split("/photos/")[1];

  if (!filename) {
    return new Response("Missing file name", { status: 400 });
  }

  const supabaseAssetUrl = `https://bnumwujvaribzfexpmmc.supabase.co/storage/v1/object/public/website-materials/photos/${filename}`;
  const res = await fetch(supabaseAssetUrl);

  if (!res.ok) {
    return new Response("Not found", { status: 404 });
  }

  const fallbackContentType = filename.endsWith(".mp4")
    ? "video/mp4"
    : "application/octet-stream";

  return new Response(res.body, {
    status: 200,
    headers: {
      "Content-Type": res.headers.get("Content-Type") || fallbackContentType,
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
});
