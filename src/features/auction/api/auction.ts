import client from '@/shared/api/client';
import type { AuctionResponse, BidResponse, CreateAuctionRequest, PlaceBidRequest, ProductWithAuctionResponse } from '@/shared/api/types';

export interface AuctionListParams {
  category_id?: string;
  region_id?: string;
}

export const auctionApi = {
  getList: async (params: AuctionListParams = {}, skipAuth = true): Promise<AuctionResponse[]> => {
    const response = await client.get<AuctionResponse[]>('/api/auction/', {
      params,
      skipAuth,
    });
    return response.data;
  },

  getById: async (productId: string): Promise<ProductWithAuctionResponse> => {
    const response = await client.get<ProductWithAuctionResponse>(`/api/product/${productId}`);
    return response.data;
  },

  create: async (data: CreateAuctionRequest): Promise<ProductWithAuctionResponse> => {
    const response = await client.post<ProductWithAuctionResponse>('/api/product/', data);
    return response.data;
  },

  placeBid: async (auctionId: string, data: PlaceBidRequest): Promise<BidResponse> => {
    const response = await client.post<BidResponse>(`/api/auction/${auctionId}/bids`, data);
    return response.data;
  },
};
