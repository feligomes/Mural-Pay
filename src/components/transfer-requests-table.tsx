"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, Search, Loader2 } from "lucide-react"
import { format } from "date-fns"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { 
  useGetTransferRequestsQuery, 
  useExecuteTransferRequestMutation, 
  useGetAccountsQuery,
  type TransferStatus 
} from "@/lib/store/api/muralPayApi"
import { useToast } from "@/components/ui/use-toast"

const STATUS_COLORS: Record<TransferStatus, { variant: "default" | "secondary" | "destructive", label: string }> = {
  'IN_REVIEW': { variant: 'secondary', label: 'In Review' },
  'CANCELLED': { variant: 'destructive', label: 'Cancelled' },
  'PENDING': { variant: 'secondary', label: 'Pending' },
  'EXECUTED': { variant: 'default', label: 'Executed' },
  'FAILED': { variant: 'destructive', label: 'Failed' },
}

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

  console.log("accounts", accounts)
  console.log("data", data)

  const [executeTransfer, { isLoading: isExecuting }] = useExecuteTransferRequestMutation()

  const handleExecute = async (transferRequestId: string) => {
    try {
      const response = await executeTransfer(transferRequestId).unwrap()
      setConfirmExecuteId(null)
      toast({
        title: "Success",
        description: `Transfer request status changed to ${STATUS_COLORS[response.status].label}`,
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
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
        {!accountId && (
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by account name"
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        )}
        <div className="flex items-center">
          <Select
            value={selectedStatus}
            onValueChange={(value) => setSelectedStatus(value as TransferStatus | "ALL")}
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

      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="whitespace-nowrap">DATE</TableHead>
              {!accountId && <TableHead className="whitespace-nowrap">FROM</TableHead>}
              <TableHead className="whitespace-nowrap">AMOUNT (USD)</TableHead>
              <TableHead className="whitespace-nowrap">STATUS</TableHead>
              <TableHead className="whitespace-nowrap">ACTIONS</TableHead>
            </TableRow>
          </TableHeader>
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
                <TableRow key={request.id}>
                  <TableCell className="whitespace-nowrap">
                    {format(new Date(request.createdAt), 'MMM dd, yyyy')}
                  </TableCell>
                  {!accountId && (
                    <TableCell className="font-medium whitespace-nowrap">
                      {getAccountName(request.payoutAccountId)}
                    </TableCell>
                  )}
                  <TableCell className="whitespace-nowrap">
                    <div className="text-sm font-medium">
                      {request.recipientsInfo.reduce((total, recipient) => total + recipient.tokenAmount, 0)
                        .toLocaleString("en-US", { minimumFractionDigits: 2 })}
                    </div>
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    <Badge variant={STATUS_COLORS[request.status].variant}>
                      {STATUS_COLORS[request.status].label}
                    </Badge>
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    {request.status === 'IN_REVIEW' && (
                      <Button
                        size="sm"
                        style={{ height: "30px !important" }}
                        onClick={() => setConfirmExecuteId(request.id)}
                        disabled={isExecuting}
                      >
                        {isExecuting && confirmExecuteId === request.id ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Executing...
                          </>
                        ) : (
                          'Execute'
                        )}
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!confirmExecuteId} onOpenChange={() => setConfirmExecuteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Execute Transfer</DialogTitle>
            <DialogDescription>
              Are you sure you want to execute this transfer request? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmExecuteId(null)} disabled={isExecuting}>
              Cancel
            </Button>
            <Button 
              onClick={() => confirmExecuteId && handleExecute(confirmExecuteId)}
              disabled={isExecuting}
            >
              {isExecuting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Executing...
                </>
              ) : (
                'Confirm'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="text-sm text-muted-foreground">
          Total: {filteredRequests.length} requests
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrevPage}
            disabled={prevIds.length === 0}
            className="flex-1 sm:flex-none"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleNextPage}
            disabled={!data?.nextId}
            className="flex-1 sm:flex-none"
          >
            Next
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  )
} 