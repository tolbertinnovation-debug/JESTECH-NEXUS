"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Download, Trash2, WifiOff } from "lucide-react";
import { buttonClass } from "./ui";

const SAVED = "nexus-saved";
const META_KEY = "nexus-saved-meta";

type SavedMeta = { url: string; title: string; savedAt: string; files?: string[] };

function readMeta(): SavedMeta[] {
  try {
    return JSON.parse(localStorage.getItem(META_KEY) ?? "[]") as SavedMeta[];
  } catch {
    return [];
  }
}
function writeMeta(list: SavedMeta[]) {
  try {
    localStorage.setItem(META_KEY, JSON.stringify(list));
  } catch {
    /* storage unavailable: saving still works, the list just won't show titles */
  }
}

/** Registers the service worker once (production only, so dev reloads stay predictable). */
export function ServiceWorkerRegistration() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production" || !("serviceWorker" in navigator)) return;
    navigator.serviceWorker.register("/sw.js").catch(() => {});
  }, []);
  return null;
}

/**
 * Saves a page (and optional files) into the device cache so they open without internet.
 * `urls[0]` is the page shown in the Saved list.
 */
export function SaveOfflineButton({
  urls,
  label = "Save offline",
  title,
  size = "md",
}: {
  urls: string[];
  label?: string;
  title?: string;
  size?: "sm" | "md";
}) {
  const [state, setState] = useState<"idle" | "saving" | "saved" | "error" | "unsupported">("idle");
  const primary = urls[0]!;

  useEffect(() => {
    if (!("caches" in window)) {
      setState("unsupported");
      return;
    }
    caches
      .open(SAVED)
      .then((c) => c.match(primary))
      .then((hit) => hit && setState("saved"))
      .catch(() => {});
  }, [primary]);

  async function save() {
    setState("saving");
    try {
      const cache = await caches.open(SAVED);
      await cache.addAll(urls);
      const meta = readMeta().filter((m) => m.url !== primary);
      meta.unshift({ url: primary, title: title ?? document.title, savedAt: new Date().toISOString(), files: urls.slice(1) });
      writeMeta(meta);
      setState("saved");
    } catch {
      setState("error");
    }
  }

  if (state === "unsupported") return null;
  if (state === "saved")
    return (
      <span className="inline-flex min-h-9 items-center gap-1.5 text-sm font-semibold text-ink-muted">
        <CheckCircle2 className="size-4 text-brand" aria-hidden /> Saved on this device
      </span>
    );
  return (
    <button type="button" onClick={save} disabled={state === "saving"} className={buttonClass("primary", size)}>
      <Download className="size-4" aria-hidden />
      {state === "saving" ? "Saving…" : state === "error" ? "Try again" : label}
    </button>
  );
}

/** Lists everything saved on this device. */
export function SavedOnDevice() {
  const [items, setItems] = useState<SavedMeta[] | null>(null);

  useEffect(() => {
    setItems(readMeta());
  }, []);

  async function remove(item: SavedMeta) {
    const cache = await caches.open(SAVED);
    await Promise.all([item.url, ...(item.files ?? [])].map((u) => cache.delete(u)));
    const next = readMeta().filter((m) => m.url !== item.url);
    writeMeta(next);
    setItems(next);
  }

  if (items === null) return null;
  if (items.length === 0)
    return (
      <p className="rounded-card border border-dashed border-line p-6 text-center text-sm text-subtle">
        Nothing saved yet. Use <strong>Save offline</strong> on a lesson or library resource.
      </p>
    );
  return (
    <ul className="divide-y divide-line rounded-card border border-line">
      {items.map((item) => (
        <li key={item.url} className="flex items-center justify-between gap-3 p-4">
          <a href={item.url} className="font-medium underline">
            {item.title.replace(/ · JesTech Nexus$/, "")}
          </a>
          <button
            type="button"
            onClick={() => remove(item)}
            className="inline-flex size-10 items-center justify-center rounded-md hover:bg-mist"
            aria-label={`Remove ${item.title} from this device`}
          >
            <Trash2 className="size-4" aria-hidden />
          </button>
        </li>
      ))}
    </ul>
  );
}

export function OfflineNotice() {
  const [offline, setOffline] = useState(false);
  useEffect(() => {
    const update = () => setOffline(!navigator.onLine);
    update();
    window.addEventListener("online", update);
    window.addEventListener("offline", update);
    return () => {
      window.removeEventListener("online", update);
      window.removeEventListener("offline", update);
    };
  }, []);
  if (!offline) return null;
  return (
    <div role="status" className="bg-brand-tint text-sm">
      <p className="container-page flex items-center gap-2 py-2">
        <WifiOff className="size-4" aria-hidden /> You are offline. Saved lessons and files still open.
      </p>
    </div>
  );
}
