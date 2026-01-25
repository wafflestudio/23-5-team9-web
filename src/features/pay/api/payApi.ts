import client from '@/shared/api/client';

export interface PayTransaction {
  id: string;
  type: 'DEPOSIT' | 'WITHDRAW' | 'TRANSFER';
  details: {
    amount: number;
    description: string;
    time: string;
    user: {
      id: string;
      nickname: string;
      profile_image: string;
    };
    receive_user?: {
      id: string;
      nickname: string;
      profile_image: string;
    };
  };
}

export interface DepositRequest {
  amount: number;
  description: string;
  request_key: string;
}

export interface WithdrawRequest {
  amount: number;
  description: string;
  request_key: string;
}

export interface TransferRequest {
  amount: number;
  description: string;
  request_key: string;
  receive_user_id: string;
}

export interface GetTransactionsParams {
  limit?: number;
  offset?: number;
}

export const payApi = {
  getTransactions: async (params?: GetTransactionsParams): Promise<PayTransaction[]> => {
    return client.get('/api/pay/', { searchParams: params as Record<string, string | number> }).json<PayTransaction[]>();
  },

  deposit: async (data: DepositRequest): Promise<PayTransaction> => {
    return client.post('/api/pay/deposit', { json: data }).json<PayTransaction>();
  },

  withdraw: async (data: WithdrawRequest): Promise<PayTransaction> => {
    return client.post('/api/pay/withdraw', { json: data }).json<PayTransaction>();
  },

  transfer: async (data: TransferRequest): Promise<PayTransaction> => {
    return client.post('/api/pay/transfer', { json: data }).json<PayTransaction>();
  },
};
