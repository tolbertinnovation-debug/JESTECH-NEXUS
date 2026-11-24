import type { Metadata } from "next";
import { SavedOnDevice } from "@/components/offline";

export const metadata: Metadata = { title: "Saved items" };

export default function SavedPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Saved items</h1>
      <p className="text-sm text-subtle">
        Lessons and files saved on this device. They open without internet. Downloaded files also stay in your phone&apos;s
        downloads folder.
      </p>
      <SavedOnDevice />
    </div>
  );
}
