import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/shared/ui';
import { useTranslation } from '@/shared/i18n';
import { productFormSchema, type ProductFormData } from '@/features/product/hooks/schemas';
import { useImageUpload, ImageUploadSection } from '@/features/image';

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
  submitLabel,
  showIsSold = false,
  isLoading = false,
}: ProductFormProps) => {
  const t = useTranslation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      title: initialData?.title ?? '',
      price: initialData?.price,
      content: initialData?.content ?? '',
      is_sold: initialData?.is_sold ?? false,
      image_ids: initialData?.image_ids ?? [],
    },
  });

  const {
    images,
    dragOver,
    inputRef,
    containerRef,
    isAnyUploading,
    imageIds,
    openFilePicker,
    handleFileChange,
    handleDrop,
    handleDragOver,
    handleDragLeave,
    removeImage,
    handleImageError,
  } = useImageUpload({
    initialImageIds: initialData?.image_ids,
    onUploadFailed: () => alert(t.product.imageUploadFailed),
  });

  const wrappedSubmit = handleSubmit(async (data) => {
    if (isAnyUploading) {
      alert(t.product.imageUploadingWait);
      return;
    }
    await onSubmit({ ...data, image_ids: imageIds });
  });

  return (
    <form
      onSubmit={wrappedSubmit}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className="relative"
    >
      <div className="mb-2">
        <input
          type="text"
          {...register('title')}
          placeholder={t.product.enterTitle}
          className="w-full text-2xl font-bold text-text-heading bg-transparent border-b border-dashed border-border-medium focus:border-primary outline-none pb-1"
        />
        {errors.title && <p className="mt-1 text-sm text-status-error">{errors.title.message}</p>}
      </div>

      <div className="mb-6">
        <div className="flex items-baseline gap-1">
          <input
            type="number"
            {...register('price', { valueAsNumber: true })}
            placeholder={t.product.price}
            min="0"
            className="text-3xl font-bold text-primary bg-transparent border-b border-dashed border-border-medium focus:border-primary outline-none pb-1 w-40"
          />
          <span className="text-3xl font-bold text-primary">{t.common.won}</span>
        </div>
        {errors.price && <p className="mt-1 text-sm text-status-error">{errors.price.message}</p>}
      </div>

      <div className="mt-6 border-t border-border-base pt-6">
        <textarea
          {...register('content')}
          rows={6}
          className="w-full bg-transparent text-text-body leading-relaxed outline-none border-b border-dashed border-border-medium focus:border-primary resize-none"
          placeholder={t.product.enterDescription}
        />
        {errors.content && <p className="mt-1 text-sm text-status-error">{errors.content.message}</p>}
      </div>

      <ImageUploadSection
        images={images}
        dragOver={dragOver}
        inputRef={inputRef}
        containerRef={containerRef}
        onFileChange={handleFileChange}
        onOpenPicker={openFilePicker}
        onRemove={removeImage}
        onImageError={handleImageError}
        labels={{
          select: t.product.imagesSelect,
          dropzone: t.product.imagesDropzone,
          selected: t.product.imagesSelected,
          none: t.product.imagesNone,
          delete: t.common.delete,
        }}
      />

      <div className="flex items-center justify-end pt-6 mt-6 border-t border-border-base">
        {showIsSold && (
          <label className="flex items-center gap-2 cursor-pointer mr-auto">
            <input type="checkbox" {...register('is_sold')} className="w-4 h-4 accent-primary" />
            <span className="text-sm text-text-secondary">{t.product.soldOut}</span>
          </label>
        )}
        <div className="flex gap-2">
          <Button size="sm" variant="ghost" type="button" onClick={onCancel}>
            {t.common.cancel}
          </Button>
          <Button size="sm" type="submit" disabled={isLoading}>
            {isLoading ? t.common.processing : (submitLabel || t.common.save)}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default ProductForm;
