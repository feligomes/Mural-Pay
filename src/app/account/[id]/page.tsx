"use client"

import Link from "next/link"
import { LineChart, Plus, ArrowLeft } from "lucide-react"
import { use } from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TransferRequestsTable } from "@/components/transfer-requests-table"
import { useGetAccountById } from "@/lib/store/api/muralPayApi"
import { Skeleton } from "@/components/ui/skeleton"

export default function AccountPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const { data: account, isLoading, error } = useGetAccountById(resolvedParams.id)

  if (isLoading) {
    return (
      <div className="container mx-auto py-6 space-y-8">
        <div className="mb-6">
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Accounts
            </Button>
          </Link>
        </div>

        <div className="flex justify-between items-center">
          <Skeleton className="h-10 w-64" />
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
              <LineChart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-40" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Wallet Address</CardTitle>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-5 w-full" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Network</CardTitle>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-32" />
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Transfer Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <TransferRequestsTable accountId={resolvedParams.id} />
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto py-6">
        <div>Error loading account: {error.toString()}</div>
      </div>
    )
  }

  if (!account) {
    return (
      <div className="container mx-auto py-6">
        <div className="mb-6">
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Accounts
            </Button>
          </Link>
        </div>
        <div>Account not found</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="mb-6">
        <Link href="/">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Accounts
          </Button>
        </Link>
      </div>

      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Account: {account.name}</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
            <LineChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {account.balance.balance.toLocaleString("en-US", { minimumFractionDigits: 2 })} {account.balance.tokenSymbol}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Wallet Address</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm font-mono" style={{ paddingTop : "6px" }}>{account.address}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Network</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{account.blockchain}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
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

