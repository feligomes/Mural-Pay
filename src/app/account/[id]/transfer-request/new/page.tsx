"use client"

import { ArrowLeft, Loader2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { use } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useCreateTransferRequestMutation, useGetBankDetailsQuery } from "@/lib/store/api/muralPayApi"
import type { CreateTransferRequest } from "@/lib/store/api/muralPayApi"
import { useToast } from "@/components/ui/use-toast"

const COLOMBIA_CURRENCY = "COP"

const formSchema = z.object({
  memo: z.string().optional(),
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  dateOfBirth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"),
  phoneNumber: z.string().min(1, "Phone number is required"),
  recipientType: z.enum(['INDIVIDUAL', 'BUSINESS'] as const),
  tokenAmount: z.string()
    .min(1, "Amount is required")
    .refine((val) => !isNaN(Number(val)), "Must be a valid number")
    .refine((val) => Number(val) > 0, "Amount must be greater than 0"),
  bankCode: z.string().min(1, "Bank code is required"),
  bankName: z.string().min(1, "Bank name is required"),
  bankAccountOwnerName: z.string().min(1, "Account owner name is required"),
  accountType: z.enum(['SAVINGS', 'CHECKING'] as const),
  bankAccountNumber: z.string()
    .min(6, "Account number must be at least 6 digits")
    .max(18, "Account number must not exceed 18 digits")
    .regex(/^\d+$/, "Account number must contain only digits"),
  documentType: z.enum(['NATIONAL_ID', 'PASSPORT', 'RESIDENT_ID', 'RUC'] as const),
  documentNumber: z.string()
    .min(6, "Document number must be at least 6 digits")
    .max(12, "Document number must not exceed 12 digits")
    .regex(/^\d+$/, "Document number must contain only digits"),
  address1: z.string().min(1, "Address is required"),
  address2: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  zip: z.string().min(1, "ZIP code is required"),
});

type FormValues = z.infer<typeof formSchema>;

export default function NewTransferRequestPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const router = useRouter()
  const { toast } = useToast()
  const [createTransferRequest, { isLoading: isCreating }] = useCreateTransferRequestMutation()
  const { data: bankDetails, isLoading: isBanksLoading } = useGetBankDetailsQuery([COLOMBIA_CURRENCY])

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
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

  const onSubmit = async (values: FormValues) => {
    const numVal = values.documentNumber.replace(/\D/g, '');
    let isValidDocumentNumber = true;
    let documentError = "";

    switch (values.documentType) {
      case 'NATIONAL_ID':
        if (numVal.length < 6 || numVal.length > 10) {
          isValidDocumentNumber = false;
          documentError = "National ID must be between 6 and 10 digits";
        }
        break;
      case 'RUC':
        if (numVal.length < 10 || numVal.length > 11) {
          isValidDocumentNumber = false;
          documentError = "RUC must be between 10 and 11 digits";
        }
        break;
      case 'PASSPORT':
      case 'RESIDENT_ID':
        if (numVal.length < 6 || numVal.length > 12) {
          isValidDocumentNumber = false;
          documentError = "Document number must be between 6 and 12 digits";
        }
        break;
    }

    if (!isValidDocumentNumber) {
      form.setError('documentNumber', { message: documentError });
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
    } catch (error: any) {
      console.error("Failed to create transfer request:", error)
      toast({
        title: "Error",
        description: error.data?.message || "Failed to create transfer request",
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
              <FormField
                control={form.control}
                name="memo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Memo (Optional)</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Add a memo for this transfer"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Recipient Information</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="recipientType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Recipient Type</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="INDIVIDUAL">Individual</SelectItem>
                            <SelectItem value="BUSINESS">Business</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input type="email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="dateOfBirth"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date of Birth</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phoneNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="tokenAmount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Amount (USD)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

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
                          onValueChange={handleBankChange} 
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

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Physical Address</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="address1"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address Line 1</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="address2"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address Line 2</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>City</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="state"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>State/Province</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="zip"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>ZIP/Postal Code</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

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