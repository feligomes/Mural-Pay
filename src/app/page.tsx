'use client'

import Link from "next/link"
import { Plus } from "lucide-react"
import type { ApiError } from "@/lib/interfaces/api.interface"
import { Button } from "@/components/ui/button"
import { useGetAccountsQuery } from "@/lib/store/api/muralPayApi"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { TransferRequestsTable } from "@/components/transfer-requests-table"
import { AccountCard } from "@/components/accounts/account-card"
import { AccountSkeleton } from "@/components/accounts/account-skeleton"

function PageHeader() {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <h1 className="text-2xl sm:text-3xl font-bold">Accounts</h1>
      <Link href="/account/new">
        <Button size="default">
          <Plus className="mr-2 h-4 w-4" />
          Create new
        </Button>
      </Link>
    </div>
  )
}

export default function AccountsPage() {
  const { data: accounts, isLoading, error } = useGetAccountsQuery()

  if (error) {
    return (
      <div className="container mx-auto py-6">
        <div className="text-red-500">Error loading accounts: {(error as ApiError).data.message || error.toString()}</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-6 space-y-6 sm:space-y-8">
      <PageHeader />

      <div className="space-y-3 sm:space-y-4">
        {isLoading ? (
          <>
            <AccountSkeleton />
            <AccountSkeleton />
          </>
        ) : (
          accounts?.map((account) => (
            <AccountCard key={account.id} account={account} />
          ))
        )}
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

