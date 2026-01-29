import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserProducts, useCreateProduct } from "@/features/product/hooks/useProducts";
import { EmptyState, Button, DetailSection } from '@/shared/ui';
import ProductCard from "@/features/product/components/list/ProductCard";
import ProductForm from "@/features/product/components/form/ProductForm";
import { useTranslation } from '@/shared/i18n';

import { useUser } from '@/features/user/hooks/useUser';
import { PageContainer } from '@/shared/layouts/PageContainer';
import { OnboardingRequired } from '@/shared/ui';

const UserProfile = () => {
  const navigate = useNavigate();
  const { products } = useUserProducts('me');
  const createProduct = useCreateProduct();
  const t = useTranslation();

  const [showForm, setShowForm] = useState(false);

  const handleSubmit = async (data: { title: string; price: number; content: string; image_ids?: string[]; isAuction?: boolean; auctionEndAt?: string }) => {
    const { isAuction, auctionEndAt, ...productData } = data;
    const newProduct = await createProduct.mutateAsync({
      ...productData,
      image_ids: productData.image_ids ?? [],
      category_id: '1',
      ...(isAuction && auctionEndAt ? { auction: { end_at: new Date(auctionEndAt).toISOString() } } : {}),
    });
    alert(isAuction ? t.auction.registered : t.product.productRegistered);
    setShowForm(false);
    navigate(`/products/${newProduct.id}`);
  };

  const handleCancel = () => {
    setShowForm(false);
  };

  const { needsOnboarding } = useUser();

  if (needsOnboarding) {
      return (
        <PageContainer title="채팅">
          <OnboardingRequired />
        </PageContainer>
      );
    }

  return (
    <div className="flex flex-col gap-6">
      {!showForm ? (
        <div className="flex justify-end">
          <Button size="sm" onClick={() => setShowForm(true)}>
            {t.product.registerProduct}
          </Button>
        </div>
      ) : (
        <DetailSection>
          <ProductForm
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isLoading={createProduct.isPending}
          />
        </DetailSection>
      )}

      <div>
        <h3 className="text-lg font-bold mb-4">{t.product.mySalesItems}</h3>
        {products.length === 0 ? (
          <EmptyState message={t.product.noSalesItems} />
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
