import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { auctionApi, AuctionListParams } from '../api/auction';
import type { CreateAuctionRequest, PlaceBidRequest } from '../types';

export const auctionKeys = {
  all: ['auctions'] as const,
  lists: () => [...auctionKeys.all, 'list'] as const,
  list: (filters: AuctionListParams) => [...auctionKeys.lists(), filters] as const,
  details: () => [...auctionKeys.all, 'detail'] as const,
  detail: (id: string) => [...auctionKeys.details(), id] as const,
};

export function useAuctions(options: { categoryId?: string; regionId?: string } = {}) {
  const { categoryId, regionId } = options;

  const params: AuctionListParams = {
    category_id: categoryId === 'all' ? undefined : categoryId,
    region_id: regionId,
  };

  const queryInfo = useQuery({
    queryKey: auctionKeys.list(params),
    queryFn: () => auctionApi.getList(params, true),
  });

  return {
    auctions: queryInfo.data ?? [],
    loading: queryInfo.isLoading,
    error: queryInfo.error as Error | null,
    refetch: queryInfo.refetch,
  };
}

export function useAuction(auctionId: string) {
  const queryInfo = useQuery({
    queryKey: auctionKeys.detail(auctionId),
    queryFn: () => auctionApi.getById(auctionId),
    enabled: !!auctionId,
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
    mutationFn: ({ auctionId, data }: { auctionId: string; data: PlaceBidRequest }) =>
      auctionApi.placeBid(auctionId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: auctionKeys.detail(variables.auctionId) });
      queryClient.invalidateQueries({ queryKey: auctionKeys.lists() });
    },
  });
}
