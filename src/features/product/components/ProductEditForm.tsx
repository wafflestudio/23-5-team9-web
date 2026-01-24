import { useForm } from 'react-hook-form';
import { Button } from '@/shared/ui';
import type { Product } from '@/features/product/api/productApi';
import type { ProductEditFormData } from '@/features/product/hooks/useProductDetailLogic';

interface ProductEditFormProps {
  product: Product;
  isUpdating: boolean;
  onSubmit: (data: ProductEditFormData) => Promise<void>;
  onCancel: () => void;
}

export function ProductEditForm({
  product,
  isUpdating,
  onSubmit,
  onCancel,
}: ProductEditFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<ProductEditFormData>({
    defaultValues: {
      title: product.title,
      price: product.price,
      content: product.content,
      is_sold: product.is_sold,
    },
  });

  const handleFormSubmit = handleSubmit(async (data) => {
    if (!data.title.trim() || !data.content.trim()) {
      alert('모든 필드를 입력해주세요.');
      return;
    }
    await onSubmit(data);
  });

  return (
    <form onSubmit={handleFormSubmit}>
      <div className="flex items-center gap-2 mb-4" />

      <input
        type="text"
        {...register('title', { required: '제목을 입력해주세요.' })}
        placeholder="상품 제목을 입력하세요"
        className="w-full text-2xl font-bold text-text-heading bg-transparent border-b border-dashed border-border-medium focus:border-primary outline-none pb-1 mb-2"
      />
      {errors.title && <p className="text-red-500 text-sm mb-2">{errors.title.message}</p>}

      <div className="flex items-baseline gap-1 mb-6">
        <input
          type="number"
          {...register('price', { required: '가격을 입력해주세요.', valueAsNumber: true, min: 0 })}
          placeholder="가격"
          min="0"
          className="text-3xl font-bold text-primary bg-transparent border-b border-dashed border-border-medium focus:border-primary outline-none pb-1 w-40"
        />
        <span className="text-3xl font-bold text-primary">원</span>
      </div>
      {errors.price && <p className="text-red-500 text-sm mb-2">{errors.price.message}</p>}

      <div className="mt-6 border-t border-border-base pt-6">
        <textarea
          {...register('content', { required: '상품 설명을 입력해주세요.' })}
          rows={6}
          className="w-full bg-transparent text-text-body leading-relaxed outline-none border-b border-dashed border-border-medium focus:border-primary resize-none"
          placeholder="상품 설명을 입력하세요"
        />
        {errors.content && <p className="text-red-500 text-sm mt-1">{errors.content.message}</p>}
      </div>

      <div className="flex items-center justify-between pt-6 mt-6 border-t border-border-base">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            {...register('is_sold')}
            className="w-4 h-4 accent-primary"
          />
          <span className="text-sm text-text-secondary">판매완료</span>
        </label>

        <div className="flex gap-2">
          <Button type="button" size="sm" variant="secondary" onClick={onCancel}>
            취소
          </Button>
          <Button type="submit" size="sm" disabled={isUpdating}>
            {isUpdating ? '저장 중...' : '저장'}
          </Button>
        </div>
      </div>
    </form>
  );
}
