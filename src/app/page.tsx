'use client'

import Link from "next/link"
import { Plus, Wallet } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useGetAccountsQuery } from "@/lib/store/api/muralPayApi"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { TransferRequestsTable } from "@/components/transfer-requests-table"
import { Skeleton } from "@/components/ui/skeleton"

export default function AccountsPage() {
  const { data: accounts, isLoading, error } = useGetAccountsQuery()

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-6 space-y-6 sm:space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold">Accounts</h1>
          <Link href="/account/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create new
            </Button>
          </Link>
        </div>

        <div className="space-y-3 sm:space-y-4">
          {[1, 2].map((index) => (
            <div key={index} className="rounded-lg border p-6">
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

  if (error) {
    return (
      <div className="container mx-auto py-6">
        <div>Error loading accounts: {error.toString()}</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-6 space-y-6 sm:space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold">Accounts</h1>
        <Link href="/account/new">
          <Button size={"default"}>
            <Plus className="mr-2 h-4 w-4" />
            Create new
          </Button>
        </Link>
      </div>

      <div className="space-y-3 sm:space-y-4">
        {accounts?.map((account) => (
          <Link key={account.id} href={`/account/${account.id}`} className="block">
            <div className="rounded-lg border p-4 sm:p-6 hover:border-primary transition-colors">
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4 sm:mb-8">
                <div>
                  <h2 className="text-xl sm:text-2xl font-semibold">{account.name || 'Unnamed Account'}</h2>
                  <div className="text-sm text-muted-foreground mt-1">{account.blockchain}</div>
                </div>
                <div className="text-left sm:text-right w-full sm:w-auto">
                  <div className="text-sm text-muted-foreground">Balance</div>
                  <div className="text-xl sm:text-2xl font-bold">
                    ${account.balance.balance.toLocaleString("en-US", { minimumFractionDigits: 2 })} {account.balance.tokenSymbol}
                  </div>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between text-sm text-muted-foreground gap-2">
                <div className="flex items-center gap-2">
                  <Wallet className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  {account.address.slice(0, 4)}...{account.address.slice(-4)}
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

