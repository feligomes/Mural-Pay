import { UseFormReturn } from "react-hook-form"
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { TransferRequestFormValues } from "@/lib/schemas/transfer-request.schema"
import { useGetBankDetailsQuery } from "@/lib/store/api/muralPayApi"

const COLOMBIA_CURRENCY = "COP"

interface BankInformationFormProps {
  form: UseFormReturn<TransferRequestFormValues>
  onBankChange: (bankName: string) => void
}

export function BankInformationForm({ form, onBankChange }: BankInformationFormProps) {
  const { data: bankDetails, isLoading: isBanksLoading } = useGetBankDetailsQuery([COLOMBIA_CURRENCY])

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Bank Information</h3>
      <div className="grid gap-4 md:grid-cols-2">
        <FormField
          control={form.control}
          name="bankCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bank Name</FormLabel>
              <Select 
                onValueChange={onBankChange} 
                value={field.value}
                disabled={isBanksLoading}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={isBanksLoading ? "Loading banks..." : "Select a bank"} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {isBanksLoading ? (
                    <SelectItem value="loading" disabled>Loading banks...</SelectItem>
                  ) : !bankDetails?.[0]?.bankNames ? (
                    <SelectItem value="empty" disabled>No banks available</SelectItem>
                  ) : (
                    bankDetails[0].bankNames.map((bankName) => (
                      <SelectItem key={bankName} value={bankName}>
                        {bankName}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="bankAccountOwnerName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Account Owner Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="accountType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Account Type</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="SAVINGS">Savings</SelectItem>
                  <SelectItem value="CHECKING">Checking</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="bankAccountNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Account Number</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="documentType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Document Type</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="NATIONAL_ID">National ID (CC)</SelectItem>
                  <SelectItem value="PASSPORT">Passport</SelectItem>
                  <SelectItem value="RESIDENT_ID">Resident ID (CE)</SelectItem>
                  <SelectItem value="RUC">RUC / NIT</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="documentNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Document Number</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  )
} 