'use client'

import Link from "next/link"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useGetAccountsQuery } from "@/lib/store/api/muralPayApi"
import type { Account } from "@/lib/store/api/muralPayApi"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { TransferRequestsTable } from "@/components/transfer-requests-table"

export default function AccountsPage() {
  const { data: accounts, isLoading, error } = useGetAccountsQuery()

  if (isLoading) {
    return (
      <div className="container mx-auto py-6">
        <div>Loading accounts...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto py-6">
        <div>Error loading accounts: {error.toString()}</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Accounts</h1>
        <Link href="/account/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create new
          </Button>
        </Link>
      </div>

      <div className="space-y-4">
        {accounts?.map((account) => (
          <Link key={account.id} href={`/account/${account.id}`} className="block">
            <div className="rounded-lg border p-6 hover:border-primary transition-colors">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h2 className="text-2xl font-semibold">{account.name || 'Unnamed Account'}</h2>
                  <div className="text-sm text-muted-foreground mt-1">{account.blockchain}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-muted-foreground">Balance</div>
                  <div className="text-2xl font-bold">
                    {account.balance.balance.toLocaleString("en-US", { minimumFractionDigits: 2 })} {account.balance.tokenSymbol}
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-muted" />
                  {account.address}
                </div>
                {account.isPending && (
                  <span className="text-yellow-600">Pending</span>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Transfer Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <TransferRequestsTable />
        </CardContent>
      </Card>
    </div>
  )
}

