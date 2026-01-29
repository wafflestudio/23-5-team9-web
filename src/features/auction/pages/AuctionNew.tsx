import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useUser } from '@/features/user/hooks/useUser';
import { useCreateAuction } from '@/features/auction/hooks/useAuctions';
import { auctionFormSchema, type AuctionFormData } from '@/features/auction/hooks/schemas';
import { PageContainer } from '@/shared/layouts/PageContainer';
import { DetailHeader, DetailSection, LoginRequired, OnboardingRequired, Button } from '@/shared/ui';
import { useTranslation } from '@/shared/i18n';
import { getErrorMessage } from '@/shared/api/types';
import { useImageUpload, ImageUploadSection } from '@/features/image';

export default function AuctionNew() {
  const navigate = useNavigate();
  const { isLoggedIn, needsOnboarding } = useUser();
  const createAuction = useCreateAuction();
  const t = useTranslation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AuctionFormData>({
    resolver: zodResolver(auctionFormSchema),
    defaultValues: {
      title: '',
      content: '',
      starting_price: undefined,
      end_date: '',
      end_time: '',
      image_ids: [],
      category_id: '1',
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
    onUploadFailed: () => alert(t.product.imageUploadFailed),
  });

  if (!isLoggedIn) {
    return (
      <PageContainer>
        <DetailHeader />
        <LoginRequired />
      </PageContainer>
    );
  }

  if (needsOnboarding) {
    return (
      <PageContainer>
        <DetailHeader />
        <OnboardingRequired />
      </PageContainer>
    );
  }

  const onSubmit = handleSubmit(async (data) => {
    if (isAnyUploading) {
      alert(t.product.imageUploadingWait);
      return;
    }

    try {
      const newProduct = await createAuction.mutateAsync({
        title: data.title,
        content: data.content,
        price: data.starting_price,
        image_ids: imageIds,
        category_id: data.category_id,
        auction: {
          end_at: new Date(`${data.end_date}T${data.end_time}`).toISOString(),
        },
      });
      alert(t.auction.registered);
      navigate(`/auction/${newProduct.auction.id}`);
    } catch (err) {
      alert(getErrorMessage(err, t.auction.registerFailed));
    }
  });

  const minDate = new Date().toISOString().split('T')[0];

  return (
    <PageContainer title={t.auction.create}>
      <DetailHeader />
      <DetailSection>
        <form
          onSubmit={onSubmit}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className="relative"
        >
          <div className="mb-4">
            <label className="block text-sm font-medium text-text-secondary mb-1">{t.auction.productTitle}</label>
            <input
              type="text"
              {...register('title')}
              placeholder={t.auction.enterProductTitle}
              className="w-full text-xl font-bold text-text-heading bg-transparent border-b border-dashed border-border-medium focus:border-primary outline-none pb-1"
            />
            {errors.title && <p className="mt-1 text-sm text-status-error">{errors.title.message}</p>}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-text-secondary mb-1">{t.auction.startingPrice}</label>
            <div className="flex items-baseline gap-1">
              <input
                type="number"
                {...register('starting_price', { valueAsNumber: true })}
                placeholder={t.auction.startingPrice}
                min="1"
                className="text-2xl font-bold text-primary bg-transparent border-b border-dashed border-border-medium focus:border-primary outline-none pb-1 w-40"
              />
              <span className="text-2xl font-bold text-primary">{t.common.won}</span>
            </div>
            {errors.starting_price && <p className="mt-1 text-sm text-status-error">{errors.starting_price.message}</p>}
          </div>

          <div className="mb-4 grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">{t.auction.endDate}</label>
              <input
                type="date"
                {...register('end_date')}
                min={minDate}
                className="w-full px-3 py-2 border border-border-medium rounded-lg bg-bg-base text-text-body focus:border-primary outline-none"
              />
              {errors.end_date && <p className="mt-1 text-sm text-status-error">{errors.end_date.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">{t.auction.endHour}</label>
              <input
                type="time"
                {...register('end_time')}
                className="w-full px-3 py-2 border border-border-medium rounded-lg bg-bg-base text-text-body focus:border-primary outline-none"
              />
              {errors.end_time && <p className="mt-1 text-sm text-status-error">{errors.end_time.message}</p>}
            </div>
          </div>

          <div className="mt-6 border-t border-border-base pt-6">
            <label className="block text-sm font-medium text-text-secondary mb-1">{t.auction.productDescription}</label>
            <textarea
              {...register('content')}
              rows={6}
              className="w-full bg-transparent text-text-body leading-relaxed outline-none border border-border-medium rounded-lg p-3 focus:border-primary resize-none"
              placeholder={t.auction.enterProductDescription}
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

          <input type="hidden" {...register('category_id')} value="1" />

          <div className="flex items-center justify-end pt-6 mt-6 border-t border-border-base">
            <div className="flex gap-2">
              <Button size="sm" variant="ghost" type="button" onClick={() => navigate(-1)}>
                {t.common.cancel}
              </Button>
              <Button size="sm" type="submit" disabled={createAuction.isPending || isAnyUploading}>
                {createAuction.isPending ? t.common.processing : t.auction.create}
              </Button>
            </div>
          </div>
        </form>
      </DetailSection>
    </PageContainer>
  );
}
