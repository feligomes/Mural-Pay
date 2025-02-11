import * as z from "zod"

export const transferRequestFormSchema = z.object({
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

export type TransferRequestFormValues = z.infer<typeof transferRequestFormSchema>;

export const validateDocumentNumber = (documentType: string, documentNumber: string): { isValid: boolean; error?: string } => {
  const numVal = documentNumber.replace(/\D/g, '');

  switch (documentType) {
    case 'NATIONAL_ID':
      if (numVal.length < 6 || numVal.length > 10) {
        return {
          isValid: false,
          error: "National ID must be between 6 and 10 digits"
        };
      }
      break;
    case 'RUC':
      if (numVal.length < 10 || numVal.length > 11) {
        return {
          isValid: false,
          error: "RUC must be between 10 and 11 digits"
        };
      }
      break;
    case 'PASSPORT':
    case 'RESIDENT_ID':
      if (numVal.length < 6 || numVal.length > 12) {
        return {
          isValid: false,
          error: "Document number must be between 6 and 12 digits"
        };
      }
      break;
  }

  return { isValid: true };
}; 