import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useProduct, useUserProducts, useDeleteProduct, useUpdateProduct } from "@/features/product/hooks/useProducts";
import { useUser, useUserProfile } from "@/features/user/hooks/useUser";
import { useCreateRoom } from "@/features/chat/hooks/useChat";
import { useTranslation } from "@/shared/i18n";
import type { UpdateProductRequest } from "@/features/product/types";
import type { ProductFormData } from "@/features/product/hooks/schemas";

export function useProductDetailLogic(productId: string) {
  const navigate = useNavigate();
  const t = useTranslation();
  const { user, isLoggedIn } = useUser();

  // Data Fetching
  const { product, loading: productLoading, error: productError } = useProduct(productId);
  const { profile: sellerProfile } = useUserProfile(product?.owner_id);
  const { products: sellerProducts } = useUserProducts(product?.owner_id!);

  // Mutations
  const deleteProduct = useDeleteProduct();
  const updateProduct = useUpdateProduct();
  const createRoom = useCreateRoom();

  // Local State
  const [isLiked, setIsLiked] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Derived State
  const isOwner = product && String(user?.id) === product.owner_id;

  // Handlers
  const handleLike = useCallback(() => {
    setIsLiked(prev => !prev);
  }, []);

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

  const handleDelete = useCallback(async () => {
    if (!product) return;
    if (!confirm(t.product.confirmDelete)) return;

    try {
      await deleteProduct.mutateAsync(product.id);
      alert(t.product.deleted);
      navigate('/products');
    } catch {
      alert(t.product.deleteFailed);
    }
  }, [product, deleteProduct, navigate, t]);

  const handleEdit = useCallback(async (data: ProductFormData, imageIds?: string[]) => {
    if (!product) return;

    const updateData: UpdateProductRequest = {
      title: data.title.trim(),
      content: data.content.trim(),
      price: data.price,
      category_id: product.category_id,
      region_id: product.region_id,
      is_sold: data.is_sold ?? false,
      image_ids: imageIds,
    };

    try {
      await updateProduct.mutateAsync({ id: product.id, data: updateData });
      alert(t.product.updated);
      setIsEditing(false);
    } catch {
      alert(t.product.updateFailed);
    }
  }, [product, updateProduct, t]);

  const handleNavigateToSeller = useCallback(() => {
    if (product?.owner_id) {
      navigate(`/user/${product.owner_id}`);
    }
  }, [product?.owner_id, navigate]);

  const startEditing = useCallback(() => setIsEditing(true), []);
  const cancelEditing = useCallback(() => setIsEditing(false), []);

  return {
    // Data
    product,
    sellerProfile,
    sellerProducts,

    // Loading/Error States
    productLoading,
    productError,
    isDeleting: deleteProduct.isPending,
    isUpdating: updateProduct.isPending,
    isChatLoading: createRoom.isPending,

    // UI State
    isLiked,
    isEditing,
    isOwner,

    // Handlers
    handleLike,
    handleChat,
    handleDelete,
    handleEdit,
    handleNavigateToSeller,
    startEditing,
    cancelEditing,
  };
}
