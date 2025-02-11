import { FiatCurrencyCode } from './transfer.interface';

export interface BankDetails {
    bankName: string;
    bankCode: string;
}

export interface GetBankDetailsResponse {
    fiatCurrencyCode: FiatCurrencyCode;
    bankNames: string[];
    matchingBankNameRequired: boolean;
} 