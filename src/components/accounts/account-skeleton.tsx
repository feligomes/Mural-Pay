import { Skeleton } from "@/components/ui/skeleton"

export function AccountSkeleton() {
  return (
    <div className="rounded-lg border p-6">
      <div className="flex justify-between items-start mb-8">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-24" />
        </div>
        <div className="text-right space-y-2">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-8 w-32" />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Skeleton className="h-4 w-4 rounded-full" />
        <Skeleton className="h-4 w-96" />
      </div>
    </div>
  )
} 