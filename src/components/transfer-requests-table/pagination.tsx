import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface PaginationProps {
  totalCount: number
  onPrevPage: () => void
  onNextPage: () => void
  hasPrevPage: boolean
  hasNextPage: boolean
}

export function Pagination({
  totalCount,
  onPrevPage,
  onNextPage,
  hasPrevPage,
  hasNextPage,
}: PaginationProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div className="text-sm text-muted-foreground">
        Total: {totalCount} requests
      </div>
      <div className="flex gap-2 w-full sm:w-auto">
        <Button
          variant="outline"
          size="sm"
          onClick={onPrevPage}
          disabled={!hasPrevPage}
          className="flex-1 sm:flex-none"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onNextPage}
          disabled={!hasNextPage}
          className="flex-1 sm:flex-none"
        >
          Next
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
    </div>
  )
} 