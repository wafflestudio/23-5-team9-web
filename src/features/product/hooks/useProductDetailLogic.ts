import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useProduct, useUserProducts, useDeleteProduct, useUpdateProduct } from "@/features/product/hooks/useProducts";
import { useUser, useUserProfile } from "@/features/user/hooks/useUser";
import { useCreateRoom } from "@/features/chat/hooks/useChat";
import type { UpdateProductRequest } from "@/features/product/api/productApi";
import type { ProductFormData } from "@/features/product/schemas";

export function useProductDetailLogic(productId: string) {
  const navigate = useNavigate();
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
      alert('본인의 상품입니다.');
      return;
    }

    createRoom.mutate(product.owner_id, {
      onSuccess: (roomId) => navigate(`/chat/${roomId}`),
      onError: () => alert('채팅방을 열 수 없습니다.'),
    });
  }, [product, isLoggedIn, user?.id, navigate, createRoom]);

  const handleDelete = useCallback(async () => {
    if (!product) return;
    if (!confirm('정말로 이 상품을 삭제하시겠습니까?')) return;

    try {
      await deleteProduct.mutateAsync(product.id);
      alert('상품이 삭제되었습니다.');
      navigate('/products');
    } catch {
      alert('상품 삭제에 실패했습니다.');
    }
  }, [product, deleteProduct, navigate]);

  const handleEdit = useCallback(async (data: ProductFormData) => {
    if (!product) return;

    const updateData: UpdateProductRequest = {
      title: data.title.trim(),
      content: data.content.trim(),
      price: data.price,
      category_id: product.category_id,
      region_id: product.region_id,
      is_sold: data.is_sold ?? false,
    };

    try {
      await updateProduct.mutateAsync({ id: product.id, data: updateData });
      alert('상품이 수정되었습니다.');
      setIsEditing(false);
    } catch {
      alert('상품 수정에 실패했습니다.');
    }
  }, [product, updateProduct]);

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
