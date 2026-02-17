import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function DetailSkeleton({ rows = 10 }: { rows?: number }) {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="h-9 w-20 rounded-md bg-muted" />
        <div className="flex gap-2">
          <div className="h-9 w-32 rounded-md bg-muted" />
          <div className="h-9 w-20 rounded-md bg-muted" />
        </div>
      </div>
      <Card>
        <CardHeader>
          <div className="h-6 w-48 rounded bg-muted" />
        </CardHeader>
        <CardContent className="space-y-3">
          {Array.from({ length: rows }).map((_, i) => (
            <div key={i} className="grid grid-cols-3 gap-2 py-1.5 border-b last:border-0">
              <div className="h-4 w-24 rounded bg-muted" />
              <div className="col-span-2 h-4 w-40 rounded bg-muted" />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
