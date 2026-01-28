import { useState, useCallback, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuction, usePlaceBid } from "@/features/auction/hooks/useAuctions";
import { useDeleteProduct, useUpdateProduct, useUserProducts } from "@/features/product/hooks/useProducts";
import { useUser, useUserProfile } from "@/features/user/hooks/useUser";
import { useCreateRoom } from "@/features/chat/hooks/useChat";
import { useTranslation } from "@/shared/i18n";
import { getErrorMessage } from "@/shared/api/types";
import type { UpdateProductRequest } from "@/features/product/types";
import type { ProductFormData } from "@/features/product/hooks/schemas";

type AuctionTimeTranslations = {
  timeEnded: string;
  days: string;
  hours: string;
  minutes: string;
  seconds: string;
};

function formatRemainingTime(endAt: string, t: AuctionTimeTranslations): string {
  const now = new Date();
  const end = new Date(endAt);
  const diff = end.getTime() - now.getTime();

  if (diff <= 0) return t.timeEnded;

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  if (days > 0) return `${days}${t.days} ${hours}${t.hours} ${minutes}${t.minutes}`;
  if (hours > 0) return `${hours}${t.hours} ${minutes}${t.minutes} ${seconds}${t.seconds}`;
  return `${minutes}${t.minutes} ${seconds}${t.seconds}`;
}

export function useAuctionDetailLogic(auctionId: string) {
  const navigate = useNavigate();
  const t = useTranslation();
  const { user, isLoggedIn } = useUser();

  // Data Fetching
  const { auction, loading: auctionLoading, error: auctionError, refetch } = useAuction(auctionId);
  const product = auction?.product;
  const { profile: sellerProfile } = useUserProfile(product?.owner_id);
  const { products: sellerProducts } = useUserProducts(product?.owner_id!);

  // Mutations
  const placeBidMutation = usePlaceBid();
  const createRoom = useCreateRoom();
  const deleteProduct = useDeleteProduct();
  const updateProduct = useUpdateProduct();

  // Local State
  const [bidPrice, setBidPrice] = useState('');
  const [remainingTime, setRemainingTime] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  // Derived State
  const isOwner = product && String(user?.id) === product.owner_id;
  const isEnded = auction?.status !== 'active';
  const minBidPrice = auction ? auction.current_price + 1 : 0;

  // Time translations memoized
  const auctionTimeTranslations = useMemo(() => ({
    timeEnded: t.auction.timeEnded,
    days: t.auction.days,
    hours: t.auction.hours,
    minutes: t.auction.minutes,
    seconds: t.auction.seconds,
  }), [t]);

  // Update remaining time (every second)
  useEffect(() => {
    if (!auction) return;

    const updateTime = () => {
      setRemainingTime(formatRemainingTime(auction.end_at, auctionTimeTranslations));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, [auction, auctionTimeTranslations]);

  // Handlers
  const handleBid = useCallback(async () => {
    if (!isLoggedIn) {
      navigate('/auth/login');
      return;
    }

    const price = parseInt(bidPrice, 10);
    if (isNaN(price) || price <= 0) {
      alert(t.auction.invalidAmount);
      return;
    }

    if (auction && price <= auction.current_price) {
      alert(t.auction.bidHigherThanCurrent.replace('{price}', auction.current_price.toLocaleString()));
      return;
    }

    try {
      await placeBidMutation.mutateAsync({
        auctionId,
        data: { bid_price: price },
      });
      setBidPrice('');
      refetch();
      alert(t.auction.bidPlaced);
    } catch (err) {
      alert(getErrorMessage(err, t.auction.bidFailed));
    }
  }, [isLoggedIn, bidPrice, auction, auctionId, placeBidMutation, refetch, navigate, t]);

  const handleChat = useCallback(async () => {
    if (!product) return;
    if (!isLoggedIn) {
      navigate('/auth/login');
      return;
    }
    if (String(user?.id) === product.owner_id) {
      alert(t.product.ownProduct);
      return;
    }

    createRoom.mutate(product.owner_id, {
      onSuccess: (roomId) => navigate(`/chat/${roomId}`),
      onError: () => alert(t.chat.cannotOpenRoom),
    });
  }, [product, isLoggedIn, user?.id, navigate, createRoom, t]);

  const handleNavigateToSeller = useCallback(() => {
    if (product?.owner_id) {
      navigate(`/user/${product.owner_id}`);
    }
  }, [product?.owner_id, navigate]);

  const handleLike = useCallback(() => {
    setIsLiked(prev => !prev);
  }, []);

  const handleDelete = useCallback(async () => {
    if (!product) return;
    if (!confirm(t.product.confirmDelete)) return;

    try {
      await deleteProduct.mutateAsync(product.id);
      alert(t.product.deleted);
      navigate('/auctions');
    } catch {
      alert(t.product.deleteFailed);
    }
  }, [product, deleteProduct, navigate, t]);

  const handleEdit = useCallback(async (data: ProductFormData) => {
    if (!product) return;

    const updateData: UpdateProductRequest = {
      title: data.title.trim(),
      content: data.content.trim(),
      price: data.price,
      category_id: product.category_id,
      image_ids: data.image_ids ?? [],
      region_id: product.region_id,
      is_sold: data.is_sold ?? false,
    };

    try {
      await updateProduct.mutateAsync({ id: product.id, data: updateData });
      alert(t.product.updated);
      setIsEditing(false);
      refetch();
    } catch {
      alert(t.product.updateFailed);
    }
  }, [product, updateProduct, refetch, t]);

  const startEditing = useCallback(() => setIsEditing(true), []);
  const cancelEditing = useCallback(() => setIsEditing(false), []);

  return {
    // Data
    auction,
    product,
    sellerProfile,
    sellerProducts,

    // Loading/Error States
    auctionLoading,
    auctionError,
    isBidding: placeBidMutation.isPending,
    isChatLoading: createRoom.isPending,
    isDeleting: deleteProduct.isPending,
    isUpdating: updateProduct.isPending,

    // UI State
    isOwner,
    isEnded,
    isEditing,
    isLiked,
    remainingTime,
    bidPrice,
    minBidPrice,

    // Handlers
    handleBid,
    handleChat,
    handleNavigateToSeller,
    handleLike,
    handleDelete,
    handleEdit,
    startEditing,
    cancelEditing,
    setBidPrice,
    refetch,
  };
}
