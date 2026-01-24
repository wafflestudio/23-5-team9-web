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
    const response = await client.get<PayTransaction[]>('/api/pay/', { params });
    return response.data;
  },

  deposit: async (data: DepositRequest): Promise<PayTransaction> => {
    const response = await client.post<PayTransaction>('/api/pay/deposit', data);
    return response.data;
  },

  withdraw: async (data: WithdrawRequest): Promise<PayTransaction> => {
    const response = await client.post<PayTransaction>('/api/pay/withdraw', data);
    return response.data;
  },

  transfer: async (data: TransferRequest): Promise<PayTransaction> => {
    const response = await client.post<PayTransaction>('/api/pay/transfer', data);
    return response.data;
  },
};
