import { BlockchainType, FiatCurrencyCode, RecipientTransferType, RecipientType, WithdrawalRequestStatus } from './transfer.interface';

export interface FiatDetails {
    withdrawalRequestStatus: WithdrawalRequestStatus;
    currencyCode: FiatCurrencyCode;
    fiatAmount: number;
    transactionFee: number;
    exchangeFeePercentage: number;
    exchangeRate: number;
    feeTotal: number;
    initiatedAt: string;
    completedAt?: string;
}

export interface BlockchainDetails {
    walletAddress: string;
    blockchain: BlockchainType;
}

export interface Recipient {
    id: string;
    createdAt: string;
    updatedAt: string;
    recipientTransferType: RecipientTransferType;
    tokenAmount: number;
    fiatDetails?: FiatDetails;
    blockchainDetails?: BlockchainDetails;
}

export interface PhysicalAddress {
    address1: string;
    address2?: string;
    country: string;
    state: string;
    city: string;
    zip: string;
}

export interface BankContactDetails {
    bankName: string;
    bankAccountOwnerName: string;
    currencyCode: string;
    accountType: 'SAVINGS' | 'CHECKING';
    bankAccountNumber: string;
    bankCode: string;
    documentNumber: string;
    documentType: 'NATIONAL_ID' | 'PASSPORT' | 'RESIDENT_ID' | 'RUC';
    physicalAddress: PhysicalAddress;
}

export interface CreateRecipientInfo {
    name: string;
    currencyCode: string;
    tokenAmount: number;
    email: string;
    dateOfBirth: string;
    phoneNumber: string;
    recipientType: RecipientType;
    bankDetails: BankContactDetails;
    recipientTransferType: RecipientTransferType;
} 