import type { Metadata } from "next";
import Image from "next/image";
import type { Role } from "@prisma/client";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { MediaUploadForm } from "./MediaUploadForm";
import { DeleteMediaButton } from "./DeleteMediaButton";
import { CopyUrlButton } from "./CopyUrlButton";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Media Library" };

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default async function MediaLibraryPage() {
  const session = await auth();
  const role = session!.user.role as Role;
  const canDelete = role === "ADMIN";

  const media = await prisma.media.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-ink-800 dark:text-paper">Media Library</h1>
      <p className="mt-1 text-sm text-ink-500 dark:text-ink-300">
        Upload images and PDFs, then paste the URL into a listing&apos;s Featured image field.
      </p>

      <div className="mt-6">
        <MediaUploadForm />
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {media.length === 0 ? (
          <p className="col-span-full text-center text-ink-400 dark:text-ink-300">
            No files uploaded yet.
          </p>
        ) : (
          media.map((item) => (
            <div key={item.id} className="card-surface overflow-hidden">
              {item.mimeType.startsWith("image/") ? (
                <div className="relative aspect-video bg-ink-50 dark:bg-ink-700/40">
                  <Image
                    src={item.url}
                    alt={item.altText ?? item.filename}
                    fill
                    className="object-contain"
                    unoptimized
                  />
                </div>
              ) : (
                <div className="flex aspect-video items-center justify-center bg-ink-50 text-sm text-ink-400 dark:bg-ink-700/40 dark:text-ink-300">
                  PDF file
                </div>
              )}
              <div className="p-4">
                <p className="truncate text-sm font-medium text-ink-800 dark:text-paper" title={item.filename}>
                  {item.filename}
                </p>
                <p className="text-xs text-ink-400 dark:text-ink-300">{formatBytes(item.size)}</p>
                <div className="mt-3 flex items-center gap-4 text-sm">
                  <CopyUrlButton url={item.url} />
                  {canDelete ? <DeleteMediaButton id={item.id} filename={item.filename} /> : null}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
