'use client'

import Link from "next/link"
import { Plus } from "lucide-react"
import { useState } from "react"
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
  const [showAll, setShowAll] = useState(false)

  if (error) {
    return (
      <div className="container mx-auto py-6">
        <div className="text-red-500">Error loading accounts: {(error as ApiError).data.message || error.toString()}</div>
      </div>
    )
  }

  // Sort accounts by updatedAt in descending order
  const sortedAccounts = accounts?.slice().sort((a, b) => 
    new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  )

  const displayedAccounts = showAll ? sortedAccounts : sortedAccounts?.slice(0, 4)
  const hasMoreAccounts = accounts && accounts.length > 4

  return (
    <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-6 space-y-6 sm:space-y-8 min-h-[500px]">
      <PageHeader />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        {isLoading ? (
          <>{[0,1,2,3].map((index) => (
            <AccountSkeleton key={index} />
          ))}
          </>
        ) : (
          <>
            {displayedAccounts?.map((account) => (
              <AccountCard key={account.id} account={account} />
            ))}
          </>
        )}
      </div>
      {!showAll && hasMoreAccounts && (
        <div className="flex justify-center pt-4">
          <Button
            variant="outline"
            onClick={() => setShowAll(true)}
          >
            Show More Accounts
          </Button>
        </div>
      )}

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

