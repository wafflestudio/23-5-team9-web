import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import client from '@/shared/api/client';

interface ResourceConfig {
  skipAuth?: boolean;
}

export function createResource<
  T extends { id: string },
  CreateDto = Partial<T>,
  UpdateDto = Partial<T>
>(endpoint: string, queryKey: string, config?: ResourceConfig) {

  const keys = {
    all: [queryKey] as const,
    lists: () => [...keys.all, 'list'] as const,
    list: (params?: Record<string, unknown>) => [...keys.lists(), params] as const,
    details: () => [...keys.all, 'detail'] as const,
    detail: (id: string) => [...keys.details(), id] as const,
  };

  return {
    keys,

    useList: <S = T[]>(params?: Record<string, unknown>, select?: (data: T[]) => S) =>
      useQuery({
        queryKey: keys.list(params),
        queryFn: () => client.get<T[]>(endpoint, {
          params,
          skipAuth: config?.skipAuth
        } as any).then(r => r.data),
        select,
      }),

    useDetail: (id: string, enabled = true) =>
      useQuery({
        queryKey: keys.detail(id),
        queryFn: () => client.get<T>(`${endpoint}${id}`).then(r => r.data),
        enabled,
      }),

    useCreate: () => {
      const qc = useQueryClient();
      return useMutation({
        mutationFn: (data: CreateDto) =>
          client.post<T>(endpoint, data).then(r => r.data),
        onSuccess: () => qc.invalidateQueries({ queryKey: keys.lists() }),
      });
    },

    useUpdate: () => {
      const qc = useQueryClient();
      return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateDto }) =>
          client.patch<T>(`${endpoint}${id}`, data).then(r => r.data),
        onSuccess: (result) => {
          qc.invalidateQueries({ queryKey: keys.lists() });
          qc.invalidateQueries({ queryKey: keys.detail(result.id) });
        },
      });
    },

    useDelete: () => {
      const qc = useQueryClient();
      return useMutation({
        mutationFn: (id: string) =>
          client.delete<T>(`${endpoint}${id}`).then(r => r.data),
        onSuccess: () => qc.invalidateQueries({ queryKey: keys.lists() }),
      });
    },
  };
}
