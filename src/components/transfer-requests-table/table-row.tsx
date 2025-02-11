import { format } from "date-fns"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { TableCell, TableRow as Row } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { TransferStatus } from "@/lib/interfaces/transfer.interface"

const STATUS_COLORS: Record<TransferStatus, { variant: "default" | "secondary" | "destructive", label: string }> = {
  'IN_REVIEW': { variant: 'secondary', label: 'In Review' },
  'CANCELLED': { variant: 'destructive', label: 'Cancelled' },
  'PENDING': { variant: 'secondary', label: 'Pending' },
  'EXECUTED': { variant: 'default', label: 'Executed' },
  'FAILED': { variant: 'destructive', label: 'Failed' },
}

interface TableRowProps {
  request: {
    id: string
    createdAt: string
    payoutAccountId: string
    status: TransferStatus
    recipientsInfo: Array<{ tokenAmount: number }>
  }
  accountName: string
  showAccountColumn: boolean
  isExecuting: boolean
  executingId: string | null
  onExecute: (id: string) => void
}

export function TableRow({
  request,
  accountName,
  showAccountColumn,
  isExecuting,
  executingId,
  onExecute,
}: TableRowProps) {
  return (
    <Row>
      <TableCell className="whitespace-nowrap">
        {format(new Date(request.createdAt), 'MMM dd, yyyy')}
      </TableCell>
      {showAccountColumn && (
        <TableCell className="font-medium whitespace-nowrap">
          {accountName}
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
            onClick={() => onExecute(request.id)}
            disabled={isExecuting}
          >
            {isExecuting && executingId === request.id ? (
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
    </Row>
  )
} 