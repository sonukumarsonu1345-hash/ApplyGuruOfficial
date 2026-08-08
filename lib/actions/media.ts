"use server";

import { revalidatePath } from "next/cache";
import path from "node:path";
import { mkdir, writeFile, unlink } from "node:fs/promises";

import { prisma } from "@/lib/prisma";
import { requireStaff, requireAdmin } from "@/lib/authz";

export type MediaFormState = {
  error?: string;
};

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");
const MAX_FILE_BYTES = 8 * 1024 * 1024; // 8MB
const ALLOWED_MIME_PREFIXES = ["image/", "application/pdf"];

function sanitizeFilename(name: string) {
  const ext = path.extname(name).toLowerCase();
  const base = path
    .basename(name, ext)
    .toLowerCase()
    .replace(/[^a-z0-9-_]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
  return `${base || "file"}${ext}`;
}

/**
 * Writes the uploaded file to /public/uploads and records it in the Media
 * table. Both ADMIN and EDITOR can upload — content editors need to be able
 * to add images to the listings they're writing.
 *
 * Storage note: this writes to the local filesystem, which works for a
 * traditional Node server but is NOT persistent on most serverless hosts
 * (Vercel, etc. reset the filesystem between deploys/invocations). For a
 * serverless production deployment, swap this for an object-storage
 * upload (S3, Cloudinary, Vercel Blob, ...) and keep storing the returned
 * public URL in the same `Media.url` column — nothing else in the admin UI
 * needs to change.
 */
export async function uploadMedia(_prevState: MediaFormState, formData: FormData): Promise<MediaFormState> {
  const session = await requireStaff();

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { error: "Choose a file to upload." };
  }

  if (file.size > MAX_FILE_BYTES) {
    return { error: "File is too large (8MB max)." };
  }

  if (!ALLOWED_MIME_PREFIXES.some((prefix) => file.type.startsWith(prefix))) {
    return { error: "Only images and PDFs are allowed." };
  }

  await mkdir(UPLOAD_DIR, { recursive: true });

  const safeName = sanitizeFilename(file.name || "upload");
  const uniqueName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${safeName}`;
  const bytes = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(UPLOAD_DIR, uniqueName), bytes);

  const altText = String(formData.get("altText") ?? "").trim();

  await prisma.media.create({
    data: {
      url: `/uploads/${uniqueName}`,
      filename: file.name || uniqueName,
      mimeType: file.type || "application/octet-stream",
      size: file.size,
      altText: altText || null,
      uploadedById: session.user.id,
    },
  });

  revalidatePath("/admin/media");
  return {};
}

/** Admin-only: Editors can upload but cannot remove files from the library. */
export async function deleteMedia(id: string) {
  await requireAdmin();

  const media = await prisma.media.findUnique({ where: { id } });
  if (!media) return;

  await prisma.media.delete({ where: { id } });

  // Best-effort disk cleanup — if this throws (e.g. file already gone),
  // the DB record is still removed either way, so the library stays
  // consistent from the user's point of view.
  if (media.url.startsWith("/uploads/")) {
    try {
      await unlink(path.join(process.cwd(), "public", media.url));
    } catch {
      // ignore
    }
  }

  revalidatePath("/admin/media");
}
