import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { TransferStatus } from "@/lib/interfaces/transfer.interface"

interface SearchFiltersProps {
  showSearch: boolean
  searchQuery: string
  onSearchChange: (value: string) => void
  selectedStatus: TransferStatus | "ALL"
  onStatusChange: (value: TransferStatus | "ALL") => void
}

export function SearchFilters({
  showSearch,
  searchQuery,
  onSearchChange,
  selectedStatus,
  onStatusChange,
}: SearchFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
      {showSearch && (
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by account name"
            className="pl-8"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      )}
      <div className="flex items-center">
        <Select
          value={selectedStatus}
          onValueChange={onStatusChange}
        >
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Statuses</SelectItem>
            <SelectItem value="IN_REVIEW">In Review</SelectItem>
            <SelectItem value="PENDING">Pending</SelectItem>
            <SelectItem value="EXECUTED">Executed</SelectItem>
            <SelectItem value="CANCELLED">Cancelled</SelectItem>
            <SelectItem value="FAILED">Failed</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
} 