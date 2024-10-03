import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="container mx-auto px-4 pt-12 lg:pt-28 pb-16">
      <Skeleton className="w-64 h-12 mb-6" />
      <Tabs defaultValue="all" className="mb-8">
        <TabsList>
          <TabsTrigger value="all">
            <Skeleton className="w-12 h-6" />
          </TabsTrigger>
          <TabsTrigger value="">
            <Skeleton className="w-12 h-6" />
          </TabsTrigger>
          <TabsTrigger value="unread">
            <Skeleton className="w-12 h-6" />
          </TabsTrigger>
        </TabsList>
      </Tabs>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((_, i) => (
          <Card key={i} className="flex flex-col h-full bg-white shadow-md">
            <CardHeader>
              <CardTitle>
                <Skeleton className="h-6 w-3/4" />
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-grow flex flex-col">
              <Skeleton className="h-48 w-full mb-4 rounded-lg" />{" "}
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-4/6" />
              </div>
            </CardContent>
            <CardFooter>
              <Skeleton className="h-9 w-full rounded-md" />
            </CardFooter>
          </Card>
        ))}
      </div>
      <div className="mt-8 flex justify-center">
        <Skeleton className="w-64 h-10 rounded-md" />
      </div>
    </div>
  );
}
