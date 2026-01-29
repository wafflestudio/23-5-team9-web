import client from '@/shared/api/client';
import type {
  AuctionResponse,
  BidResponse,
  CreateAuctionRequest,
  PlaceBidRequest,
  ProductDetailResponse,
  ProductWithAuctionResponse,
} from '@/shared/api/types';

export interface AuctionListParams {
  category_id?: string;
  region_id?: string;
}

export const auctionApi = {
  getList: async (params: AuctionListParams = {}, skipAuth = true): Promise<AuctionResponse[]> => {
    const response = await client.get<ProductWithAuctionResponse[]>('/api/product/', {
      params: { ...params, auction: true },
      skipAuth,
    });

    // API returns products with `auction` nested. Convert to AuctionResponse[] shape.
    const products = response.data || [];
    const auctions: AuctionResponse[] = products
      .filter((p) => p.auction != null)
      .map((p) => ({
        ...p.auction,
        product: {
          id: p.id,
          owner_id: p.owner_id,
          title: p.title,
          image_ids: p.image_ids,
          content: p.content,
          price: p.price,
          like_count: p.like_count,
          category_id: p.category_id,
          region_id: p.region_id,
          is_sold: p.is_sold,
        },
      }));

    return auctions;
  },

  create: async (data: CreateAuctionRequest): Promise<ProductDetailResponse> => {
    const response = await client.post<ProductDetailResponse>('/api/product/', data);
    return response.data;
  },

  placeBid: async (auctionId: string, data: PlaceBidRequest): Promise<BidResponse> => {
    const response = await client.post<BidResponse>(`/api/auction/${auctionId}/bids`, data);
    return response.data;
  },
};
