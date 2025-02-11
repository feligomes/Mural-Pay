import { TableHead, TableHeader as Header, TableRow } from "@/components/ui/table"

interface TableHeaderProps {
  showAccountColumn: boolean
}

export function TableHeader({ showAccountColumn }: TableHeaderProps) {
  return (
    <Header>
      <TableRow>
        <TableHead className="whitespace-nowrap">DATE</TableHead>
        {showAccountColumn && <TableHead className="whitespace-nowrap">FROM</TableHead>}
        <TableHead className="whitespace-nowrap">AMOUNT (USD)</TableHead>
        <TableHead className="whitespace-nowrap">STATUS</TableHead>
        <TableHead className="whitespace-nowrap">ACTIONS</TableHead>
      </TableRow>
    </Header>
  )
} 