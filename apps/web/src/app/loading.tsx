import { PageSkeleton } from "@/components/states/page-skeleton";
import { SiteHeader } from "@/components/site-header";

export default function Loading() {
  return (
    <>
      <SiteHeader />
      <div className="shell-container py-10">
        <PageSkeleton />
      </div>
    </>
  );
}
