"use client"

import Link from "next/link"
import { Plus } from "lucide-react"
import { use } from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useGetAccountById } from "@/lib/store/api/muralPayApi"
import { TransferRequestsTable } from "@/components/transfer-requests-table"
import { AccountInfoSkeleton } from "@/components/accounts/account-info-skeleton"
import { AccountInfoCards } from "@/components/accounts/account-info-cards"
import { BackToAccounts } from "@/components/accounts/back-to-accounts"

export default function AccountPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const { data: account, isLoading, error } = useGetAccountById(resolvedParams.id)

  if (error) {
    return (
      <div className="container mx-auto py-6">
        <div>Error loading account: {error.toString()}</div>
      </div>
    )
  }

  if (!account && !isLoading) {
    return (
      <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-6 space-y-6 sm:space-y-8">
        <BackToAccounts />
        <div>Account not found</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-6 space-y-6 sm:space-y-8">
      <BackToAccounts />
      {isLoading ? (
        <AccountInfoSkeleton />
      ) : (
        <AccountInfoCards account={account!} />
      )}
      <Card>
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <CardTitle>Transfer Requests</CardTitle>
          <Link href={`/account/${resolvedParams.id}/transfer-request/new`}>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Transfer Request
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          <TransferRequestsTable accountId={resolvedParams.id} />
        </CardContent>
      </Card>
    </div>
  )
}

