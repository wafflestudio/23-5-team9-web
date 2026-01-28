import ProductForm from '@/features/product/components/form/ProductForm';
import { useTranslation } from '@/shared/i18n';
import { useProductDetail } from '@/features/product/hooks/ProductDetailContext';

export function ProductEditForm() {
  const t = useTranslation();
  const { product, handleEdit, cancelEditing, isUpdating } = useProductDetail();

  if (!product) return null;

  return (
    <ProductForm
      initialData={{ ...product, content: product.content ?? undefined }}
      initialImageIds={product.image_ids}
      onSubmit={handleEdit}
      onCancel={cancelEditing}
      submitLabel={t.common.save}
      showIsSold={true}
      isLoading={isUpdating}
    />
  );
}
