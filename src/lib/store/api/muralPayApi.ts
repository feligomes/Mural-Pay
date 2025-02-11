import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const API_KEY = '6156b5eab878eefe2ace3af4:2310090bce2b6edf678164e6f40e4cb5a5c460e524a84b51b114249be693ca1d0aa1ea7d:94bcca99e9ef7afc17535ad7456da843.c343b9a378dc9cefeda7fdbe883b3f4be15dd8bb8e89e478f74d025c06f4a4b1';

interface Balance {
  balance: number;
  tokenSymbol: string;
}

interface Account {
  id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  address: string;
  blockchain: string;
  balance: Balance;
  isApiEnabled: boolean;
  isPending: boolean;
}

interface CreateAccountRequest {
  name: string;
  description?: string;
}

export type TransferStatus = 'IN_REVIEW' | 'CANCELLED' | 'PENDING' | 'EXECUTED' | 'FAILED';
export type RecipientTransferType = 'FIAT' | 'BLOCKCHAIN';
export type RecipientType = 'INDIVIDUAL' | 'BUSINESS';

type WithdrawalRequestStatus = 'AWAITING_SOURCE_DEPOSIT' | 'PENDING' | 'COMPLETED' | 'FAILED' | 'CANCELED';
type FiatCurrencyCode = 'USD' | 'COP' | 'ARS' | 'EUR' | 'MXN' | 'BRL' | 'CLP' | 'PEN' | 'BOB' | 'CRC' | 'ZAR';
type BlockchainType = 'ETHEREUM' | 'POLYGON' | 'BASE' | 'CELO';

interface FiatDetails {
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

interface BlockchainDetails {
  walletAddress: string;
  blockchain: BlockchainType;
}

interface Recipient {
  id: string;
  createdAt: string;
  updatedAt: string;
  recipientTransferType: RecipientTransferType;
  tokenAmount: number;
  fiatDetails?: FiatDetails;
  blockchainDetails?: BlockchainDetails;
}

interface TransferRequest {
  id: string;
  createdAt: string;
  updatedAt: string;
  payoutAccountId: string;
  transactionHash?: string;
  memo?: string;
  status: TransferStatus;
  recipientsInfo: Recipient[];
}

interface GetTransferRequestsParams {
  limit?: number;
  nextId?: string;
  status?: TransferStatus[];
  accountId?: string;
}

interface GetTransferRequestsResponse {
  total: number;
  nextId?: string;
  results: TransferRequest[];
}

interface PhysicalAddress {
  address1: string;
  address2?: string;
  country: string;
  state: string;
  city: string;
  zip: string;
}

interface BankContactDetails {
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

interface CreateRecipientInfo {
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

interface CreateTransferRequest {
  payoutAccountId: string;
  memo?: string;
  recipientsInfo: CreateRecipientInfo[];
}

interface BankDetails {
  bankName: string;
  bankCode: string;
}

interface GetBankDetailsResponse {
  fiatCurrencyCode: string;
  bankNames: string[];
  matchingBankNameRequired: boolean;
}

interface ExecuteTransferResponse {
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

export const muralPayApi = createApi({
  reducerPath: 'muralPayApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://api-staging.muralpay.com/api',
    prepareHeaders: (headers) => {
      headers.set('Authorization', `Bearer ${API_KEY}`);
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getAccounts: builder.query<Account[], void>({
      query: () => '/accounts',
    }),
    createAccount: builder.mutation<Account, CreateAccountRequest>({
      query: (body) => ({
        url: '/accounts',
        method: 'POST',
        body,
      }),
    }),
    getBankDetails: builder.query<GetBankDetailsResponse[], string[]>({
      query: (currencies) => {
        const params = new URLSearchParams();
        currencies.forEach(currency => params.append('fiatCurrencyCodes[]', currency));
        return {
          url: '/bank-accounts/get-bank-details-info',
          params,
        };
      },
    }),
    getTransferRequests: builder.query<GetTransferRequestsResponse, GetTransferRequestsParams>({
      query: ({ limit = 20, nextId, status, accountId }) => {
        const params = new URLSearchParams();
        if (limit) params.append('limit', limit.toString());
        if (nextId) params.append('nextId', nextId);
        if (status?.length) status.forEach(s => params.append('status[]', s));
        if (accountId) params.append('accountId', accountId);
        
        return {
          url: '/transfer-requests',
          params,
        };
      },
    }),
    createTransferRequest: builder.mutation<TransferRequest, CreateTransferRequest>({
      query: (body) => ({
        url: '/transfer-requests',
        method: 'POST',
        body,
      }),
    }),
    executeTransferRequest: builder.mutation<ExecuteTransferResponse, string>({
      query: (transferRequestId) => ({
        url: '/transfer-requests/execute',
        method: 'POST',
        body: { transferRequestId },
        headers: {
          'mural-account-api-key': '3b3f528365d2838c60e0a58a:4eb1d03911e65be82712cc28ad776fda907dfe94966638d674bad1d3c5c167474613f01a:29c59899d49966a6e07288b42248eccd.39f4590ff98131bc9b21c4efe69d68dae3de0da5de61a89a3cf3cbbfb9638916'
        }
      }),
    }),
  }),
});

// Custom hook to get a single account from the cached data
export const useGetAccountById = (id: string) => {
  const { data: accounts, ...rest } = muralPayApi.endpoints.getAccounts.useQuery();
  const account = accounts?.find(account => account.id === id);
  return { data: account, ...rest };
};

export const { 
  useGetAccountsQuery, 
  useCreateAccountMutation, 
  useGetTransferRequestsQuery,
  useCreateTransferRequestMutation,
  useExecuteTransferRequestMutation,
  useGetBankDetailsQuery
} = muralPayApi;

export type { 
  Account, 
  Balance, 
  CreateAccountRequest, 
  TransferRequest, 
  GetTransferRequestsResponse,
  Recipient,
  CreateTransferRequest,
  CreateRecipientInfo,
  PhysicalAddress,
  BankContactDetails,
  BankDetails
}; 