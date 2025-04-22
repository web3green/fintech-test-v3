import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const BlogPostCardSkeleton: React.FC = () => {
  return (
    <Card className="h-full overflow-hidden">
      <Skeleton className="h-48 w-full" />

      <CardContent className="p-5 space-y-3">
        <div className="flex items-center space-x-2">
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-4 w-12" />
        </div>

        <Skeleton className="h-6 w-3/4" />

        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>

        <div className="flex items-center justify-between pt-2">
           <Skeleton className="h-5 w-1/4" />
           <Skeleton className="h-5 w-1/4" />
        </div>
      </CardContent>
    </Card>
  );
}; 