import type { Metadata } from "next";
import { SavedOnDevice } from "@/components/offline";
import { PageHeader } from "@/components/ui";

export const metadata: Metadata = { title: "Saved on this device" };

export default function OfflinePage() {
  return (
    <>
      <PageHeader
        title="Saved on this device"
        intro="Lessons and files you saved open here without internet. If you are offline, the page you wanted is not saved yet."
      />
      <div className="container-page max-w-2xl py-10">
        <SavedOnDevice />
      </div>
    </>
  );
}
