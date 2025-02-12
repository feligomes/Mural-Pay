"use client"

import { ArrowLeft, Loader2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { use } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import type { ApiError } from "@/lib/interfaces/api.interface"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormField } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useCreateTransferRequestMutation } from "@/lib/store/api/muralPayApi"
import type { CreateTransferRequest } from "@/lib/store/api/muralPayApi"
import { useToast } from "@/components/ui/use-toast"
import { transferRequestFormSchema, type TransferRequestFormValues, validateDocumentNumber } from "@/lib/schemas/transfer-request.schema"
import { RecipientInformationForm } from "@/components/transfer-request/recipient-information-form"
import { BankInformationForm } from "@/components/transfer-request/bank-information-form"
import { PhysicalAddressForm } from "@/components/transfer-request/physical-address-form"

const COLOMBIA_CURRENCY = "COP"

export default function NewTransferRequestPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const router = useRouter()
  const { toast } = useToast()
  const [createTransferRequest, { isLoading: isCreating }] = useCreateTransferRequestMutation()

  const form = useForm<TransferRequestFormValues>({
    resolver: zodResolver(transferRequestFormSchema),
    defaultValues: {
      memo: "",
      name: "",
      email: "",
      dateOfBirth: "",
      phoneNumber: "",
      recipientType: "INDIVIDUAL",
      tokenAmount: "",
      bankCode: "",
      bankName: "",
      bankAccountOwnerName: "",
      accountType: "SAVINGS",
      bankAccountNumber: "",
      documentType: "NATIONAL_ID",
      documentNumber: "",
      address1: "",
      address2: "",
      city: "",
      state: "",
      zip: "",
    },
  })

  const handleBankChange = (bankName: string) => {
    form.setValue('bankCode', bankName);
    form.setValue('bankName', bankName);
  };

  const onSubmit = async (values: TransferRequestFormValues) => {
    const documentValidation = validateDocumentNumber(values.documentType, values.documentNumber);
    if (!documentValidation.isValid) {
      form.setError('documentNumber', { message: documentValidation.error });
      return;
    }

    try {
      const request: CreateTransferRequest = {
        payoutAccountId: resolvedParams.id,
        memo: values.memo,
        recipientsInfo: [{
          name: values.name,
          currencyCode: COLOMBIA_CURRENCY,
          tokenAmount: parseFloat(parseFloat(values.tokenAmount).toFixed(2)),
          email: values.email,
          dateOfBirth: values.dateOfBirth,
          phoneNumber: values.phoneNumber,
          recipientType: values.recipientType,
          recipientTransferType: "FIAT",
          bankDetails: {
            bankName: values.bankName,
            bankCode: values.bankCode,
            bankAccountOwnerName: values.bankAccountOwnerName,
            currencyCode: COLOMBIA_CURRENCY,
            accountType: values.accountType,
            bankAccountNumber: values.bankAccountNumber,
            documentType: values.documentType,
            documentNumber: values.documentNumber,
            physicalAddress: {
              address1: values.address1,
              address2: values.address2,
              country: "CO",
              state: values.state,
              city: values.city,
              zip: values.zip,
            },
          },
        }],
      }

      await createTransferRequest(request).unwrap()
      toast({
        title: "Success",
        description: "Transfer request created successfully",
      })
      router.push(`/account/${resolvedParams.id}`)
      router.refresh()
    } catch (error: unknown) {
      console.error("Failed to create transfer request:", error)
      const apiError = error as ApiError
      toast({
        title: "Error",
        description: apiError.data.message || "Failed to create transfer request",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="container mx-auto py-6 max-w-2xl">
      <div className="mb-6">
        <Link href={`/account/${resolvedParams.id}`}>
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Account
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>New Transfer Request (Colombia)</CardTitle>
          <CardDescription>
            Create a new transfer request, limited to Colombian bank accounts.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="memo"
                  render={({ field }) => (
                    <div>
                      <label className="text-sm font-medium">Memo (Optional)</label>
                      <Input 
                        placeholder="Add a memo for this transfer"
                        className="mt-1.5"
                        {...field}
                      />
                    </div>
                  )}
                />
              </div>

              <RecipientInformationForm form={form} />
              <BankInformationForm form={form} onBankChange={handleBankChange} />
              <PhysicalAddressForm form={form} />

              <Button type="submit" className="w-full" disabled={isCreating}>
                {isCreating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isCreating ? "Creating..." : "Create Transfer Request"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
} 