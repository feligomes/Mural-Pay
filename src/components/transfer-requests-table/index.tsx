"use client"

import { useState } from "react"
import { Loader2 } from "lucide-react"
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table"
import { 
  useGetTransferRequestsQuery, 
  useExecuteTransferRequestMutation, 
  useGetAccountsQuery,
} from "@/lib/store/api/muralPayApi"
import { useToast } from "@/components/ui/use-toast"
import { TransferStatus } from "@/lib/interfaces/transfer.interface"
import { ExecuteDialog } from "./execute-dialog"
import { SearchFilters } from "./search-filters"
import { Pagination } from "./pagination"
import { TableHeader } from "./table-header"
import { TableRow as RequestRow } from "./table-row"

interface TransferRequestsTableProps {
  accountId?: string;
}

export function TransferRequestsTable({ accountId }: TransferRequestsTableProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedStatus, setSelectedStatus] = useState<TransferStatus | "ALL">("ALL")
  const [nextId, setNextId] = useState<string>()
  const [prevIds, setPrevIds] = useState<string[]>([])
  const [confirmExecuteId, setConfirmExecuteId] = useState<string | null>(null)
  const { toast } = useToast()

  const { data: accounts } = useGetAccountsQuery()
  const { data, isFetching } = useGetTransferRequestsQuery({
    limit: 20,
    nextId,
    status: selectedStatus === "ALL" ? undefined : [selectedStatus],
  })

  const [executeTransfer, { isLoading: isExecuting }] = useExecuteTransferRequestMutation()

  const handleExecute = async () => {
    if (!confirmExecuteId) return
    
    try {
      const response = await executeTransfer(confirmExecuteId).unwrap()
      setConfirmExecuteId(null)
      toast({
        title: "Success",
        description: `Transfer request status changed to ${response.status}`,
      })
    } catch (error: any) {
      console.error("Failed to execute transfer:", error)
      toast({
        title: "Error",
        description: error.data?.message || "Failed to execute transfer request",
        variant: "destructive",
      })
    }
  }

  const handleNextPage = () => {
    if (data?.nextId) {
      setPrevIds([...prevIds, nextId || ''])
      setNextId(data.nextId)
    }
  }

  const handlePrevPage = () => {
    const newPrevIds = [...prevIds]
    const prevId = newPrevIds.pop()
    setPrevIds(newPrevIds)
    setNextId(prevId)
  }

  const getAccountName = (accountId: string) => {
    const account = accounts?.find(acc => acc.id === accountId)
    return account?.name || accountId
  }

  const filteredRequests = data?.results?.filter(
    (request) =>
      (!accountId || request.payoutAccountId === accountId) &&
      (!searchQuery || !accountId && getAccountName(request.payoutAccountId).toLowerCase().includes(searchQuery.toLowerCase()))
  ) || []

  return (
    <div className="space-y-4">
      <SearchFilters
        showSearch={!accountId}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedStatus={selectedStatus}
        onStatusChange={(value: TransferStatus | "ALL") => setSelectedStatus(value)}
      />

      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader showAccountColumn={!accountId} />
          <TableBody>
            {isFetching ? (
              <TableRow>
                <TableCell colSpan={accountId ? 4 : 5} className="h-24">
                  <div className="flex items-center justify-center">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  </div>
                </TableCell>
              </TableRow>
            ) : !data?.results || filteredRequests.length === 0 ? (
              <TableRow>
                <TableCell colSpan={accountId ? 4 : 5} className="text-center">
                  No transfer requests found
                </TableCell>
              </TableRow>
            ) : (
              filteredRequests.map((request) => (
                <RequestRow
                  key={request.id}
                  request={request}
                  accountName={getAccountName(request.payoutAccountId)}
                  showAccountColumn={!accountId}
                  isExecuting={isExecuting}
                  executingId={confirmExecuteId}
                  onExecute={setConfirmExecuteId}
                />
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <ExecuteDialog
        open={!!confirmExecuteId}
        onOpenChange={(open) => !open && setConfirmExecuteId(null)}
        onConfirm={handleExecute}
        isExecuting={isExecuting}
      />

      <Pagination
        totalCount={filteredRequests.length}
        onPrevPage={handlePrevPage}
        onNextPage={handleNextPage}
        hasPrevPage={prevIds.length > 0}
        hasNextPage={!!data?.nextId}
      />
    </div>
  )
} 