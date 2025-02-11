import { Recipient, CreateRecipientInfo } from './recipient.interface';

export type TransferStatus = 'IN_REVIEW' | 'CANCELLED' | 'PENDING' | 'EXECUTED' | 'FAILED';
export type RecipientTransferType = 'FIAT' | 'BLOCKCHAIN';
export type RecipientType = 'INDIVIDUAL' | 'BUSINESS';
export type WithdrawalRequestStatus = 'AWAITING_SOURCE_DEPOSIT' | 'PENDING' | 'COMPLETED' | 'FAILED' | 'CANCELED';
export type FiatCurrencyCode = 'USD' | 'COP' | 'ARS' | 'EUR' | 'MXN' | 'BRL' | 'CLP' | 'PEN' | 'BOB' | 'CRC' | 'ZAR';
export type BlockchainType = 'ETHEREUM' | 'POLYGON' | 'BASE' | 'CELO';

export interface TransferRequest {
    id: string;
    createdAt: string;
    updatedAt: string;
    payoutAccountId: string;
    transactionHash?: string;
    memo?: string;
    status: TransferStatus;
    recipientsInfo: Recipient[];
}

export interface GetTransferRequestsParams {
    limit?: number;
    nextId?: string;
    status?: TransferStatus[];
    accountId?: string;
}

export interface GetTransferRequestsResponse {
    total: number;
    nextId?: string;
    results: TransferRequest[];
}

export interface CreateTransferRequest {
    payoutAccountId: string;
    memo?: string;
    recipientsInfo: CreateRecipientInfo[];
}

export interface ExecuteTransferResponse {
    id: string;
    createdAt: string;
    updatedAt: string;
    payoutAccountId: string;
    memo?: string;
    status: TransferStatus;
    recipientsInfo: {
        id: string;
        currencyCode: string;
        tokenAmount: number;
        createdAt: string;
        updatedAt: string;
        withdrawalRequestStatus: WithdrawalRequestStatus;
    }[];
} 