import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { auctionApi, AuctionListParams } from '../api/auction';
import { useRegionFilter } from '@/features/product/hooks/shared';
import type { CreateAuctionRequest, PlaceBidRequest } from '../types';

export const auctionKeys = {
  all: ['auctions'] as const,
  lists: () => [...auctionKeys.all, 'list'] as const,
  list: (filters: AuctionListParams) => [...auctionKeys.lists(), filters] as const,
  details: () => [...auctionKeys.all, 'detail'] as const,
  detail: (id: string) => [...auctionKeys.details(), id] as const,
};

export function useAuctions(options: { categoryId?: string; regionId?: string; sido?: string; sigugun?: string } = {}) {
  const { categoryId, regionId, sido, sigugun } = options;

  const params: AuctionListParams = {
    category_id: categoryId === 'all' ? undefined : categoryId,
    region_id: regionId,
  };

  const queryInfo = useQuery({
    queryKey: auctionKeys.list(params),
    queryFn: () => auctionApi.getList(params, true),
  });

  const { filtered, isFiltering } = useRegionFilter(queryInfo.data, { regionId, sido, sigugun }, queryInfo.isLoading);

  return {
    auctions: filtered,
    loading: queryInfo.isLoading || isFiltering,
    error: queryInfo.error as Error | null,
    refetch: queryInfo.refetch,
  };
}

export function useAuction(productId: string) {
  const queryInfo = useQuery({
    queryKey: auctionKeys.detail(productId),
    queryFn: () => auctionApi.getById(productId),
    enabled: !!productId,
  });

  return {
    auction: queryInfo.data,
    loading: queryInfo.isLoading,
    error: queryInfo.error as Error | null,
    refetch: queryInfo.refetch,
  };
}

export function useCreateAuction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateAuctionRequest) => auctionApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: auctionKeys.lists() });
    },
  });
}

export function usePlaceBid() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ auctionId, productId, data }: { auctionId: string; productId: string; data: PlaceBidRequest }) =>
      auctionApi.placeBid(auctionId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: auctionKeys.detail(variables.productId) });
      queryClient.invalidateQueries({ queryKey: auctionKeys.lists() });
    },
  });
}
