export interface Balance {
    balance: number;
    tokenSymbol: string;
}

export interface Account {
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

export interface CreateAccountRequest {
    name: string;
    description?: string;
} 