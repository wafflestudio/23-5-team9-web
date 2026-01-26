import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, CardImage } from '@/shared/ui';
import { useTranslation } from '@/shared/i18n';
import { productFormSchema, type ProductFormData } from '@/features/product/hooks/schemas';
import { useCallback, useEffect, useRef, useState } from 'react';
import Sortable from 'sortablejs';
import { imageApi } from '@/features/product/api/imageApi';

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

  type UploadEntry = {
    id?: string;
    image_url?: string;
    file?: File;
    uploading: boolean;
    progress: number; // 0-100
    previewUrl?: string;
    failedToLoad?: boolean;
    clientId: string;
  };

  const [uploadedImages, setUploadedImages] = useState<UploadEntry[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const imagesContainerRef = useRef<HTMLDivElement | null>(null);

  // If initialData.image_ids present, fetch their urls
  useEffect(() => {
    let mounted = true;
    async function fetchInitial() {
      if (!initialData?.image_ids || initialData.image_ids.length === 0) return;
      const results: UploadEntry[] = [];
      for (const id of initialData.image_ids) {
        try {
          const r = await imageApi.getById(id);
          results.push({ clientId: `server-${r.id}`, id: r.id, image_url: r.image_url, uploading: false, progress: 100 });
        } catch {
          // ignore
        }
      }
      if (mounted) setUploadedImages(results);
    }
    fetchInitial();
    return () => {
      mounted = false;
    };
  }, [initialData?.image_ids]);

  const uploadFile = useCallback(async (file: File) => {
    const clientId = (crypto && typeof crypto.randomUUID === 'function') ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`;
    const entry: UploadEntry = { clientId, file, uploading: true, progress: 0, previewUrl: URL.createObjectURL(file) };
    setUploadedImages((prev) => [...prev, entry]);

    try {
      const res = await imageApi.upload(file, (ev) => {
        if (ev.total && ev.loaded) {
          const pct = Math.round(((ev.loaded ?? 0) / ev.total) * 100);
          setUploadedImages((prev) => prev.map((p) => (p.clientId === clientId ? { ...p, progress: pct } : p)));
        }
      });

      setUploadedImages((prev) => prev.map((p) => (p.clientId === clientId ? { ...p, id: res.id, image_url: res.image_url, uploading: false, progress: 100 } : p)));
    } catch (err) {
      // mark as not uploading and show error indicator
      setUploadedImages((prev) => prev.map((p) => (p.clientId === clientId ? { ...p, uploading: false } : p)));
      alert(t.product.imageUploadFailed);
    }
  }, []);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    for (let i = 0; i < files.length; i++) {
      uploadFile(files[i]);
    }
    // clear input
    if (e.currentTarget) e.currentTarget.value = '';
  }, [uploadFile]);

  const handleDrop = useCallback((e: React.DragEvent<HTMLFormElement>) => {
    e.preventDefault();
    setDragOver(false);
    const files = e.dataTransfer.files;
    for (let i = 0; i < files.length; i++) uploadFile(files[i]);
  }, [uploadFile]);

  const removeImage = useCallback((id?: string, previewUrl?: string) => {
    setUploadedImages((prev) => prev.filter((p) => (id ? p.id !== id : p.previewUrl !== previewUrl)));
    if (previewUrl) {
      try { URL.revokeObjectURL(previewUrl); } catch {};
    }
  }, []);

  useEffect(() => {
    const el = imagesContainerRef.current;
    if (!el) return;
    const sortable = Sortable.create(el, {
      animation: 150,
      ghostClass: 'opacity-50',
      chosenClass: 'invisible',
      onEnd: (evt : any) => {
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
      // If we have a local preview, drop the server url so src falls back to previewUrl.
      if (p.previewUrl && p.image_url) {
        return { ...p, image_url: undefined };
      }
      // Mark as failed so we don't loop trying the same broken url.
      return { ...p, failedToLoad: true };
    }));
  }, []);

  const isAnyUploading = uploadedImages.some((u) => u.uploading);

  const wrappedSubmit = handleSubmit(async (data) => {
    if (isAnyUploading) {
      alert(t.product.imageUploadingWait);
      return;
    }

    const payload = {
      ...data,
      image_ids: uploadedImages.map((i) => i.id).filter(Boolean) as string[],
    } as ProductFormData;
    await onSubmit(payload);
  });

  return (
    <form
      onSubmit={wrappedSubmit}
      onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
      onDragLeave={() => setDragOver(false)}
      onDrop={handleDrop}
      className="relative"
    >
      {dragOver && (
        <div className="absolute inset-0 pointer-events-none rounded-lg border-2 border-dashed border-primary bg-primary/5" />
      )}
        <input ref={inputRef} type="file" accept="image/*" multiple onChange={handleFileChange} className="hidden" />
      <div className="mb-2">
        <input
          type="text"
          {...register('title')}
          placeholder={t.product.enterTitle}
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
            placeholder={t.product.price}
            min="0"
            className="text-3xl font-bold text-primary bg-transparent border-b border-dashed border-border-medium focus:border-primary outline-none pb-1 w-40"
          />
          <span className="text-3xl font-bold text-primary">{t.common.won}</span>
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
          placeholder={t.product.enterDescription}
        />
        {errors.content && (
          <p className="mt-1 text-sm text-status-error">{errors.content.message}</p>
        )}
      </div>

      <div className="mt-4">
        <div className="mb-2">
          <div className={`flex flex-col items-center justify-center gap-2 py-4 ${dragOver ? 'text-primary' : 'text-text-secondary'}`}>
            <Button type="button" size="sm" variant="outline" onClick={() => inputRef.current?.click()} className="px-3">{t.product.imagesSelect}</Button>
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

      <div className="flex items-center justify-end pt-6 mt-6 border-t border-border-base">
        {showIsSold && (
          <label className="flex items-center gap-2 cursor-pointer mr-auto">
            <input
              type="checkbox"
              {...register('is_sold')}
              className="w-4 h-4 accent-primary"
            />
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
