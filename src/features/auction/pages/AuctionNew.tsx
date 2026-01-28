import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Sortable from 'sortablejs';
import { useUser } from '@/features/user/hooks/useUser';
import { useCreateAuction } from '@/features/auction/hooks/useAuctions';
import { auctionFormSchema, type AuctionFormData } from '@/features/auction/hooks/schemas';
import { PageContainer } from '@/shared/layouts/PageContainer';
import { DetailHeader, DetailSection, LoginRequired, OnboardingRequired, Button, CardImage } from '@/shared/ui';
import { imageApi } from '@/features/product/api/imageApi';
import { useTranslation } from '@/shared/i18n';
import { getErrorMessage } from '@/shared/api/types';

type UploadEntry = {
  id?: string;
  image_url?: string;
  file?: File;
  uploading: boolean;
  progress: number;
  previewUrl?: string;
  failedToLoad?: boolean;
  clientId: string;
};

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

  const [uploadedImages, setUploadedImages] = useState<UploadEntry[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const imagesContainerRef = useRef<HTMLDivElement | null>(null);

  const uploadFile = useCallback(async (file: File) => {
    const clientId = crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`;
    const entry: UploadEntry = { clientId, file, uploading: true, progress: 0, previewUrl: URL.createObjectURL(file) };
    setUploadedImages((prev) => [...prev, entry]);

    try {
      const res = await imageApi.upload(file, (ev) => {
        if (ev.total && ev.loaded) {
          const pct = Math.round((ev.loaded / ev.total) * 100);
          setUploadedImages((prev) => prev.map((p) => (p.clientId === clientId ? { ...p, progress: pct } : p)));
        }
      });

      setUploadedImages((prev) => prev.map((p) => (p.clientId === clientId ? { ...p, id: res.id, image_url: res.image_url, uploading: false, progress: 100 } : p)));
    } catch {
      setUploadedImages((prev) => prev.map((p) => (p.clientId === clientId ? { ...p, uploading: false } : p)));
      alert(t.product.imageUploadFailed);
    }
  }, [t]);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    for (let i = 0; i < files.length; i++) {
      uploadFile(files[i]);
    }
    if (e.currentTarget) e.currentTarget.value = '';
  }, [uploadFile]);

  const handleDrop = useCallback((e: React.DragEvent<HTMLFormElement>) => {
    e.preventDefault();
    setDragOver(false);
    const files = e.dataTransfer.files;
    for (let i = 0; i < files.length; i++) uploadFile(files[i]);
  }, [uploadFile]);

  const handleFormDragOver = useCallback((e: React.DragEvent<HTMLFormElement>) => {
    e.preventDefault();
    const types = Array.from(e.dataTransfer?.types ?? []) as string[];
    setDragOver(types.includes('Files'));
  }, []);

  const removeImage = useCallback((id?: string, previewUrl?: string) => {
    setUploadedImages((prev) => prev.filter((p) => (id ? p.id !== id : p.previewUrl !== previewUrl)));
    if (previewUrl) {
      try { URL.revokeObjectURL(previewUrl); } catch {}
    }
  }, []);

  useEffect(() => {
    const el = imagesContainerRef.current;
    if (!el) return;
    const sortable = Sortable.create(el, {
      animation: 150,
      onEnd: (evt: any) => {
        const oldIndex = evt.oldIndex ?? 0;
        const newIndex = evt.newIndex ?? 0;
        setUploadedImages((prev) => {
          const copy = [...prev];
          const [moved] = copy.splice(oldIndex, 1);
          copy.splice(newIndex, 0, moved);
          return copy;
        });
      },
    });
    return () => { try { sortable.destroy(); } catch {} };
  }, []);

  const handleImageError = useCallback((clientId: string) => {
    setUploadedImages((prev) => prev.map((p) => {
      if (p.clientId !== clientId) return p;
      if (p.previewUrl && p.image_url) {
        return { ...p, image_url: undefined };
      }
      return { ...p, failedToLoad: true };
    }));
  }, []);

  const isAnyUploading = uploadedImages.some((u) => u.uploading);

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

    const endAt = new Date(`${data.end_date}T${data.end_time}`).toISOString();

    try {
      const payload = {
        product_data: {
          title: data.title,
          content: data.content,
          price: data.starting_price,
          image_ids: uploadedImages.map((i) => i.id).filter(Boolean) as string[],
          category_id: data.category_id,
        },
        auction_data: {
          starting_price: data.starting_price,
          end_at: endAt,
        },
      };

      const newAuction = await createAuction.mutateAsync(payload);
      alert('경매가 등록되었습니다!');
      navigate(`/auction/${newAuction.id}`);
    } catch (err) {
      alert(getErrorMessage(err, '경매 등록에 실패했습니다.'));
    }
  });

  // 최소 종료 시간 (현재 시간 + 1시간)
  const now = new Date();
  const minDate = now.toISOString().split('T')[0];

  return (
    <PageContainer title="경매 등록">
      <DetailHeader />
      <DetailSection>
        <form
          onSubmit={onSubmit}
          onDragOver={handleFormDragOver}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className="relative"
        >
          <input ref={inputRef} type="file" accept="image/*" multiple onChange={handleFileChange} className="hidden" />

          {/* 제목 */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-text-secondary mb-1">상품 제목</label>
            <input
              type="text"
              {...register('title')}
              placeholder="상품 제목을 입력해주세요"
              className="w-full text-xl font-bold text-text-heading bg-transparent border-b border-dashed border-border-medium focus:border-primary outline-none pb-1"
            />
            {errors.title && <p className="mt-1 text-sm text-status-error">{errors.title.message}</p>}
          </div>

          {/* 시작가 */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-text-secondary mb-1">시작가</label>
            <div className="flex items-baseline gap-1">
              <input
                type="number"
                {...register('starting_price', { valueAsNumber: true })}
                placeholder="시작가"
                min="1"
                className="text-2xl font-bold text-primary bg-transparent border-b border-dashed border-border-medium focus:border-primary outline-none pb-1 w-40"
              />
              <span className="text-2xl font-bold text-primary">{t.common.won}</span>
            </div>
            {errors.starting_price && <p className="mt-1 text-sm text-status-error">{errors.starting_price.message}</p>}
          </div>

          {/* 종료 일시 */}
          <div className="mb-4 grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">종료 날짜</label>
              <input
                type="date"
                {...register('end_date')}
                min={minDate}
                className="w-full px-3 py-2 border border-border-medium rounded-lg bg-bg-base text-text-body focus:border-primary outline-none"
              />
              {errors.end_date && <p className="mt-1 text-sm text-status-error">{errors.end_date.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">종료 시간</label>
              <input
                type="time"
                {...register('end_time')}
                className="w-full px-3 py-2 border border-border-medium rounded-lg bg-bg-base text-text-body focus:border-primary outline-none"
              />
              {errors.end_time && <p className="mt-1 text-sm text-status-error">{errors.end_time.message}</p>}
            </div>
          </div>

          {/* 상품 설명 */}
          <div className="mt-6 border-t border-border-base pt-6">
            <label className="block text-sm font-medium text-text-secondary mb-1">상품 설명</label>
            <textarea
              {...register('content')}
              rows={6}
              className="w-full bg-transparent text-text-body leading-relaxed outline-none border border-border-medium rounded-lg p-3 focus:border-primary resize-none"
              placeholder="상품에 대한 설명을 입력해주세요"
            />
            {errors.content && <p className="mt-1 text-sm text-status-error">{errors.content.message}</p>}
          </div>

          {/* 이미지 업로드 */}
          <div className="mt-4">
            <div className="mb-2">
              <div className={`flex flex-col items-center justify-center gap-2 py-4 ${dragOver ? 'text-primary' : 'text-text-secondary'}`}>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => inputRef.current?.click()}
                  className={`px-3 ${dragOver ? 'text-primary border-primary' : ''}`}
                >
                  {t.product.imagesSelect}
                </Button>
                <div className="text-sm mt-2">{t.product.imagesDropzone}</div>
              </div>
              <div className="flex justify-end mt-2">
                <div className="text-sm text-text-secondary">{t.product.imagesSelected.replace('{count}', String(uploadedImages.length))}</div>
              </div>
            </div>

            <div ref={imagesContainerRef} className="flex gap-3 mt-3 flex-wrap items-start">
              {uploadedImages.length === 0 && (
                <div className="text-sm text-text-secondary ml-1">{t.product.imagesNone}</div>
              )}
              {uploadedImages.map((img, idx) => (
                <div key={img.clientId} className="relative" data-clientid={img.clientId}>
                  <CardImage
                    src={img.previewUrl ?? img.image_url ?? undefined}
                    alt={`preview-${idx}`}
                    className="w-28 h-28"
                    onError={() => handleImageError(img.clientId)}
                  />

                  {img.uploading && (
                    <div className="absolute top-0 left-0 w-28 h-28 bg-black bg-opacity-40 flex items-center justify-center rounded-xl">
                      <div className="text-white text-sm">{img.progress}%</div>
                    </div>
                  )}

                  <Button
                    type="button"
                    size="sm"
                    variant="secondary"
                    onClick={(e) => { e.stopPropagation(); removeImage(img.id, img.previewUrl); }}
                    className="absolute -top-2 -right-2"
                    aria-label="remove image"
                  >
                    {t.common.delete}
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* 카테고리 (hidden) */}
          <input type="hidden" {...register('category_id')} value="1" />

          {/* 제출 버튼 */}
          <div className="flex items-center justify-end pt-6 mt-6 border-t border-border-base">
            <div className="flex gap-2">
              <Button size="sm" variant="ghost" type="button" onClick={() => navigate(-1)}>
                {t.common.cancel}
              </Button>
              <Button size="sm" type="submit" disabled={createAuction.isPending || isAnyUploading}>
                {createAuction.isPending ? t.common.processing : '경매 등록'}
              </Button>
            </div>
          </div>
        </form>
      </DetailSection>
    </PageContainer>
  );
}
