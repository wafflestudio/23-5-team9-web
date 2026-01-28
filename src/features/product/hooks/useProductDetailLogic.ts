import { useProduct, useUserProducts } from "@/features/product/hooks/useProducts";
import { useUserProfile } from "@/features/user/hooks/useUser";
import { useDetailHandlers } from "./shared";

export function useProductDetailLogic(productId: string) {
  const { product, loading: productLoading, error: productError } = useProduct(productId);
  const { profile: sellerProfile } = useUserProfile(product?.owner_id);
  const { products: sellerProducts } = useUserProducts(product?.owner_id!);

  const handlers = useDetailHandlers({ product, redirectPath: '/products' });

  return {
    product,
    sellerProfile,
    sellerProducts,
    productLoading,
    productError,
    ...handlers,
  };
}
