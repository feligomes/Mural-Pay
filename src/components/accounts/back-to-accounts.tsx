import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

export function BackToAccounts() {
  return (
    <div className="mb-4 sm:mb-6">
      <Link href="/">
        <Button variant="ghost" size="sm">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Accounts
        </Button>
      </Link>
    </div>
  )
} 