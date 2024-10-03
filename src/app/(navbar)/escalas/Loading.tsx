import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-28">
      <Skeleton className="h-10 w-64 mx-auto mb-8" />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(15)].map((_, index) => (
          <div key={index} className="h-full">
            <Card className="h-full">
              <CardHeader>
                <CardTitle>
                  <Skeleton className="h-8 w-3/4" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Skeleton className="h-6 w-full" />
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
}
