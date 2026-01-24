import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/shared/ui';
import { productFormSchema, type ProductFormData } from '../schemas';

export type { ProductFormData };

interface ProductFormProps {
  initialData?: Partial<ProductFormData>;
  onSubmit: (data: ProductFormData) => Promise<void>;
  onCancel: () => void;
  submitLabel?: string;
  showIsSold?: boolean;
  isLoading?: boolean;
}

const ProductForm = ({
  initialData,
  onSubmit,
  onCancel,
  submitLabel = '등록',
  showIsSold = false,
  isLoading = false,
}: ProductFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      title: initialData?.title ?? '',
      price: initialData?.price ?? 0,
      content: initialData?.content ?? '',
      is_sold: initialData?.is_sold ?? false,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="mb-2">
        <input
          type="text"
          {...register('title')}
          placeholder="상품 제목을 입력하세요"
          className="w-full text-2xl font-bold text-text-heading bg-transparent border-b border-dashed border-border-medium focus:border-primary outline-none pb-1"
        />
        {errors.title && (
          <p className="mt-1 text-sm text-status-error">{errors.title.message}</p>
        )}
      </div>

      <div className="mb-6">
        <div className="flex items-baseline gap-1">
          <input
            type="number"
            {...register('price', { valueAsNumber: true })}
            placeholder="가격"
            min="0"
            className="text-3xl font-bold text-primary bg-transparent border-b border-dashed border-border-medium focus:border-primary outline-none pb-1 w-40"
          />
          <span className="text-3xl font-bold text-primary">원</span>
        </div>
        {errors.price && (
          <p className="mt-1 text-sm text-status-error">{errors.price.message}</p>
        )}
      </div>

      <div className="mt-6 border-t border-border-base pt-6">
        <textarea
          {...register('content')}
          rows={6}
          className="w-full bg-transparent text-text-body leading-relaxed outline-none border-b border-dashed border-border-medium focus:border-primary resize-none"
          placeholder="상품 설명을 입력하세요"
        />
        {errors.content && (
          <p className="mt-1 text-sm text-status-error">{errors.content.message}</p>
        )}
      </div>

      <div className="flex items-center justify-end pt-6 mt-6 border-t border-border-base">
        {showIsSold && (
          <label className="flex items-center gap-2 cursor-pointer mr-auto">
            <input
              type="checkbox"
              {...register('is_sold')}
              className="w-4 h-4 accent-primary"
            />
            <span className="text-sm text-text-secondary">판매완료</span>
          </label>
        )}
        <div className="flex gap-2">
          <Button size="sm" variant="secondary" type="button" onClick={onCancel}>
            취소
          </Button>
          <Button size="sm" type="submit" disabled={isLoading}>
            {isLoading ? '처리 중...' : submitLabel}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default ProductForm;
