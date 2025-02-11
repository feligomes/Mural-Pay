"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, Search } from "lucide-react"
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
import { useGetTransferRequestsQuery, useExecuteTransferRequestMutation, type TransferStatus } from "@/lib/store/api/muralPayApi"
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
  const { toast } = useToast()

  const { data, isLoading } = useGetTransferRequestsQuery({
    limit: 20,
    nextId,
    status: selectedStatus === "ALL" ? undefined : [selectedStatus],
    accountId,
  })

  const [executeTransfer] = useExecuteTransferRequestMutation()

  const handleExecute = async (transferRequestId: string) => {
    try {
      await executeTransfer(transferRequestId).unwrap()
      toast({
        title: "Success",
        description: "Transfer request executed successfully",
      })
    } catch (error) {
      console.error("Failed to execute transfer:", error)
      toast({
        title: "Error",
        description: "Failed to execute transfer request",
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

  const filteredRequests = data?.results?.filter(
    (request) =>
      request.memo?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.payoutAccountId.toLowerCase().includes(searchQuery.toLowerCase())
  ) || []

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by memo or account"
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select
          value={selectedStatus}
          onValueChange={(value) => setSelectedStatus(value as TransferStatus | "ALL")}
        >
          <SelectTrigger className="w-[180px]">
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

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>DATE</TableHead>
              <TableHead>ACCOUNT</TableHead>
              <TableHead>MEMO</TableHead>
              <TableHead>RECIPIENTS</TableHead>
              <TableHead>STATUS</TableHead>
              <TableHead>TRANSACTION</TableHead>
              <TableHead>ACTIONS</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : !data?.results || filteredRequests.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center">
                  No transfer requests found
                </TableCell>
              </TableRow>
            ) : (
              filteredRequests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell>
                    {format(new Date(request.createdAt), 'MMM dd, yyyy')}
                  </TableCell>
                  <TableCell className="font-medium">{request.payoutAccountId}</TableCell>
                  <TableCell>{request.memo || '-'}</TableCell>
                  <TableCell>
                    {request.recipientsInfo.map((recipient, index) => (
                      <div key={recipient.id} className="text-sm">
                        {recipient.tokenAmount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                        {index < request.recipientsInfo.length - 1 && ", "}
                      </div>
                    ))}
                  </TableCell>
                  <TableCell>
                    <Badge variant={STATUS_COLORS[request.status].variant}>
                      {STATUS_COLORS[request.status].label}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {request.transactionHash ? (
                      <span className="text-sm font-mono">{request.transactionHash.slice(0, 8)}...</span>
                    ) : '-'}
                  </TableCell>
                  <TableCell>
                    {request.status === 'PENDING' && (
                      <Button
                        size="sm"
                        onClick={() => handleExecute(request.id)}
                      >
                        Execute
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex justify-between items-center">
        <div className="text-sm text-muted-foreground">
          Total: {data?.total || 0} requests
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrevPage}
            disabled={prevIds.length === 0}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleNextPage}
            disabled={!data?.nextId}
          >
            Next
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  )
} 