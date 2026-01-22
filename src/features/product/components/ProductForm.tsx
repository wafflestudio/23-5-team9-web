import { useState, useEffect } from 'react';
import { Button } from '@/shared/ui';

export interface ProductFormData {
  title: string;
  price: number;
  content: string;
  is_sold?: boolean;
}

interface ProductFormProps {
  initialData?: Partial<ProductFormData>;
  onSubmit: (data: ProductFormData) => Promise<void>;
  onCancel: () => void;
  submitLabel?: string;
  showIsSold?: boolean;
  isLoading?: boolean;
}

export const ProductFormFields = ({
  formState,
  onChange,
}: {
  formState: { title: string; price: string; content: string };
  onChange: (field: string, value: string) => void;
}) => (
  <>
    <input
      type="text"
      value={formState.title}
      onChange={(e) => onChange('title', e.target.value)}
      placeholder="상품 제목을 입력하세요"
      className="w-full text-2xl font-bold text-text-heading bg-transparent border-b border-dashed border-border-medium focus:border-primary outline-none pb-1 mb-2"
    />

    <div className="flex items-baseline gap-1 mb-6">
      <input
        type="number"
        value={formState.price}
        onChange={(e) => onChange('price', e.target.value)}
        placeholder="가격"
        min="0"
        className="text-3xl font-bold text-primary bg-transparent border-b border-dashed border-border-medium focus:border-primary outline-none pb-1 w-40"
      />
      <span className="text-3xl font-bold text-primary">원</span>
    </div>

    <div className="mt-6 border-t border-border-base pt-6">
      <textarea
        value={formState.content}
        onChange={(e) => onChange('content', e.target.value)}
        rows={6}
        className="w-full bg-transparent text-text-body leading-relaxed outline-none border-b border-dashed border-border-medium focus:border-primary resize-none"
        placeholder="상품 설명을 입력하세요"
      />
    </div>
  </>
);

const ProductForm = ({
  initialData,
  onSubmit,
  onCancel,
  submitLabel = '등록',
  showIsSold = false,
  isLoading = false,
}: ProductFormProps) => {
  const [formState, setFormState] = useState({
    title: initialData?.title || '',
    price: initialData?.price?.toString() || '',
    content: initialData?.content || '',
    is_sold: initialData?.is_sold || false,
  });

  useEffect(() => {
    if (initialData) {
      setFormState({
        title: initialData.title || '',
        price: initialData.price?.toString() || '',
        content: initialData.content || '',
        is_sold: initialData.is_sold || false,
      });
    }
  }, [initialData?.title, initialData?.price, initialData?.content, initialData?.is_sold]);

  const handleChange = (field: string, value: string | boolean) => {
    setFormState(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    const { title, content, price } = formState;

    if (!title.trim() || !content.trim() || !price) {
      alert('모든 필드를 입력해주세요.');
      return;
    }

    await onSubmit({
      title: title.trim(),
      content: content.trim(),
      price: Number(price),
      is_sold: formState.is_sold,
    });
  };

  return (
    <>
      <ProductFormFields
        formState={formState}
        onChange={handleChange}
      />

      <div className="flex items-center justify-end pt-6 mt-6 border-t border-border-base">
        {showIsSold && (
          <label className="flex items-center gap-2 cursor-pointer mr-auto">
            <input
              type="checkbox"
              checked={formState.is_sold}
              onChange={(e) => handleChange('is_sold', e.target.checked)}
              className="w-4 h-4 accent-primary"
            />
            <span className="text-sm text-text-secondary">판매완료</span>
          </label>
        )}
        <div className="flex gap-2">
          <Button size="sm" variant="secondary" onClick={onCancel}>
            취소
          </Button>
          <Button size="sm" onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? '처리 중...' : submitLabel}
          </Button>
        </div>
      </div>
    </>
  );
};

export default ProductForm;
