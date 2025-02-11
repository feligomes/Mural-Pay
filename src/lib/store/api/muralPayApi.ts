import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_CONFIG } from '../../config/api.config';
import { Account, CreateAccountRequest, Balance } from '../../interfaces/account.interface';
import { 
    TransferRequest, 
    GetTransferRequestsParams, 
    GetTransferRequestsResponse,
    CreateTransferRequest,
    ExecuteTransferResponse,
} from '../../interfaces/transfer.interface';
import { GetBankDetailsResponse, BankDetails } from '../../interfaces/bank.interface';
import { 
    Recipient,
    CreateRecipientInfo,
    PhysicalAddress,
    BankContactDetails
} from '../../interfaces/recipient.interface';

export const muralPayApi = createApi({
    reducerPath: 'muralPayApi',
    baseQuery: fetchBaseQuery({
        baseUrl: API_CONFIG.BASE_URL,
        prepareHeaders: (headers) => {
            headers.set('Authorization', `Bearer ${API_CONFIG.API_KEY}`);
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
                    'mural-account-api-key': API_CONFIG.MURAL_ACCOUNT_API_KEY
                }
            }),
        }),
    }),
});

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