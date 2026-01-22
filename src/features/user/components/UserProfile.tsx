import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserProducts, useCreateProduct } from "@/features/product/hooks/useProducts";
import { EmptyState, Button, DetailSection } from '@/shared/ui';
import ProductCard from "@/features/product/components/ProductCard";
import ProductForm from "@/features/product/components/ProductForm";

const UserProfile = () => {
  const navigate = useNavigate();
  const { products } = useUserProducts('me');
  const createProduct = useCreateProduct();

  const [showForm, setShowForm] = useState(false);

  const handleSubmit = async (data: { title: string; price: number; content: string }) => {
    const newProduct = await createProduct.mutateAsync({
      ...data,
      category_id: '1',
    });
    alert('상품이 등록되었습니다.');
    setShowForm(false);
    navigate(`/products/${newProduct.id}`);
  };

  const handleCancel = () => {
    setShowForm(false);
  };

  return (
    <div className="flex flex-col gap-6">
      {!showForm ? (
        <div className="flex justify-end">
          <Button size="sm" onClick={() => setShowForm(true)}>
            + 상품 등록
          </Button>
        </div>
      ) : (
        <DetailSection>
          <h3 className="text-lg font-bold mb-4">새 상품 등록</h3>
          <ProductForm
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isLoading={createProduct.isPending}
          />
        </DetailSection>
      )}

      <div>
        <h3 className="text-lg font-bold mb-4">나의 판매 물품</h3>
        {products.length === 0 ? (
          <EmptyState message="판매 중인 상품이 없습니다." />
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
