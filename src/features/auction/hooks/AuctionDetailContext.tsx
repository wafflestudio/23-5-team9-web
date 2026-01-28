import { useAuctionDetailLogic } from './useAuctionDetailLogic';
import { useTranslation } from '@/shared/i18n';
import { createDetailProvider } from '@/features/product/hooks/DetailContext';

function useAuctionLogicWithMessages(id: string) {
  const t = useTranslation();
  return { ...useAuctionDetailLogic(id), messages: { error: t.auction.notFound, empty: t.auction.notFound } };
}

const { Provider, useContextHook } = createDetailProvider({
  useLogic: useAuctionLogicWithMessages,
  loadingKey: 'auctionLoading',
  errorKey: 'auctionError',
  dataKey: 'auction',
  getMessages: (logic) => logic.messages,
});

export { Provider as AuctionDetailProvider, useContextHook as useAuctionDetail };
