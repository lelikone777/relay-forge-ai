import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function PageSkeleton() {
  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <Skeleton className="h-5 w-36" />
        <Skeleton className="h-10 w-80" />
        <Skeleton className="h-5 w-[34rem]" />
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        {[0, 1, 2].map((item) => (
          <Card key={item}>
            <CardHeader className="space-y-3">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-9 w-28" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-28 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
