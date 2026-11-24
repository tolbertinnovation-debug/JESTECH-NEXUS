import { SiteFooter, SiteHeader } from "@/components/site-header";
import SiteNotFound from "./(site)/not-found";

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main id="main" className="flex-1">
        <SiteNotFound />
      </main>
      <SiteFooter />
    </>
  );
}
