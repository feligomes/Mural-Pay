import Link from "next/link"
import { Wallet } from "lucide-react"
import { Account } from "@/lib/interfaces/account.interface"

interface AccountCardProps {
  account: Account
}

export function AccountCard({ account }: AccountCardProps) {
  return (
    <Link href={`/account/${account.id}`} className="block">
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
          {account.isPending ? (
            <span className="text-yellow-600">Pending</span>
          ) : (
            <div className="flex items-center gap-2">
              <Wallet className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              {account.address.slice(0, 4)}...{account.address.slice(-4)}
            </div>
          )}
        </div>
      </div>
    </Link>
  )
} 