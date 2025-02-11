"use client"

import { useState } from "react"
import { Search } from "lucide-react"
import { useGetAccountsQuery } from "@/lib/store/api/muralPayApi"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

export function PaymentRequestsTable() {
  const [searchQuery, setSearchQuery] = useState("")
  const { data: accounts, isLoading, error } = useGetAccountsQuery()

  if (isLoading) {
    return <div>Loading accounts...</div>
  }

  if (error) {
    return <div>Error loading accounts: {error.toString()}</div>
  }

  const filteredAccounts = accounts?.filter(
    (account) =>
      account.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      account.email?.toLowerCase().includes(searchQuery.toLowerCase())
  ) || []

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or email"
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ACCOUNT</TableHead>
              <TableHead>EMAIL</TableHead>
              <TableHead>STATUS</TableHead>
              <TableHead>TYPE</TableHead>
              <TableHead className="w-[100px]">ACTION</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAccounts.map((account) => (
              <TableRow key={account.id}>
                <TableCell>
                  <div className="font-medium">{account.name || 'N/A'}</div>
                  <div className="text-sm text-muted-foreground">{account.id}</div>
                </TableCell>
                <TableCell>{account.email || 'N/A'}</TableCell>
                <TableCell>
                  <Badge variant={account.status === "active" ? "default" : "secondary"}>
                    {account.status || 'Unknown'}
                  </Badge>
                </TableCell>
                <TableCell>{account.type || 'N/A'}</TableCell>
                <TableCell>
                  <Button size="sm" onClick={() => console.log('View account:', account.id)}>
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

