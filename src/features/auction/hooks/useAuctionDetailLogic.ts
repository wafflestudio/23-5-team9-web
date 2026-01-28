import { useState, useCallback, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuction, usePlaceBid } from "@/features/auction/hooks/useAuctions";
import { useUserProducts } from "@/features/product/hooks/useProducts";
import { useUser, useUserProfile } from "@/features/user/hooks/useUser";
import { useTranslation } from "@/shared/i18n";
import { useDetailHandlers } from "@/features/product/hooks/shared";
import { getErrorMessage } from "@/shared/api/types";

function formatRemainingTime(endAt: string, t: { timeEnded: string; days: string; hours: string; minutes: string; seconds: string }): string {
  const diff = new Date(endAt).getTime() - Date.now();
  if (diff <= 0) return t.timeEnded;

  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff % 86400000) / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);

  if (d > 0) return `${d}${t.days} ${h}${t.hours} ${m}${t.minutes}`;
  if (h > 0) return `${h}${t.hours} ${m}${t.minutes} ${s}${t.seconds}`;
  return `${m}${t.minutes} ${s}${t.seconds}`;
}

export function useAuctionDetailLogic(auctionId: string) {
  const navigate = useNavigate();
  const t = useTranslation();
  const { isLoggedIn } = useUser();

  const { auction, loading: auctionLoading, error: auctionError, refetch } = useAuction(auctionId);
  const product = auction?.product;
  const { profile: sellerProfile } = useUserProfile(product?.owner_id);
  const { products: sellerProducts } = useUserProducts(product?.owner_id!);

  const placeBidMutation = usePlaceBid();
  const [bidPrice, setBidPrice] = useState('');
  const [remainingTime, setRemainingTime] = useState('');

  const handlers = useDetailHandlers({ product, redirectPath: '/auctions', onEditSuccess: refetch });

  const isEnded = auction?.status !== 'active';
  const minBidPrice = auction ? auction.current_price + 1 : 0;

  const timeLabels = useMemo(() => ({
    timeEnded: t.auction.timeEnded,
    days: t.auction.days,
    hours: t.auction.hours,
    minutes: t.auction.minutes,
    seconds: t.auction.seconds,
  }), [t]);

  useEffect(() => {
    if (!auction) return;
    const update = () => setRemainingTime(formatRemainingTime(auction.end_at, timeLabels));
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [auction, timeLabels]);

  const handleBid = useCallback(async () => {
    if (!isLoggedIn) { navigate('/auth/login'); return; }

    const price = parseInt(bidPrice, 10);
    if (isNaN(price) || price <= 0) { alert(t.auction.invalidAmount); return; }
    if (auction && price <= auction.current_price) {
      alert(t.auction.bidHigherThanCurrent.replace('{price}', auction.current_price.toLocaleString()));
      return;
    }

    try {
      await placeBidMutation.mutateAsync({ auctionId, data: { bid_price: price } });
      setBidPrice('');
      refetch();
      alert(t.auction.bidPlaced);
    } catch (err) {
      alert(getErrorMessage(err, t.auction.bidFailed));
    }
  }, [isLoggedIn, bidPrice, auction, auctionId, placeBidMutation, refetch, navigate, t]);

  return {
    auction,
    product,
    sellerProfile,
    sellerProducts,
    auctionLoading,
    auctionError,
    isBidding: placeBidMutation.isPending,
    isEnded,
    remainingTime,
    bidPrice,
    minBidPrice,
    handleBid,
    setBidPrice,
    refetch,
    ...handlers,
  };
}
