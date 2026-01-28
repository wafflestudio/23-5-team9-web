import { useQuery } from '@tanstack/react-query';
import { imageApi, ImageUploadResponse } from '@/features/product/api/imageApi';
import { DetailImage, Thumbnail, Button, Badge } from '@/shared/ui';
import { useTranslation } from '@/shared/i18n';
import { useImageCarousel, useContentTranslation } from '@/features/product/hooks/shared';
import { useDetail } from '@/features/product/hooks/DetailContext';

const NAV_BTN = "absolute top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity";

export function ProductDetailView() {
  const t = useTranslation();
  const { product, isLiked, isOwner, isDeleting, handleLike, startEditing, handleDelete } = useDetail();

  const { data: images = [] } = useQuery<ImageUploadResponse[]>({
    queryKey: ['detail', 'images', product.id, product.image_ids ?? []],
    queryFn: () => product.image_ids?.length ? Promise.all(product.image_ids.map(id => imageApi.getById(id))) : Promise.resolve([]),
  });

  const { index, hasPrev, hasNext, goPrev, goNext, goTo } = useImageCarousel(images.length);
  const { displayTitle, displayContent, needsTranslation, isTranslated, isTranslating, handleTranslate } = useContentTranslation(product.title, product.content ?? '');

  const onTranslate = async () => { if (!await handleTranslate()) alert(t.product.translateFailed); };

  return (
    <>
      {images.length > 0 && (
        <div className="mb-6">
          <div className="relative group">
            <DetailImage src={images[index].image_url} alt={product.title} />
            {images.length > 1 && (
              <>
                {hasPrev && (
                  <button onClick={goPrev} className={`${NAV_BTN} left-3`} aria-label="previous image">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                  </button>
                )}
                {hasNext && (
                  <button onClick={goNext} className={`${NAV_BTN} right-3`} aria-label="next image">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                  </button>
                )}
              </>
            )}
          </div>
          {images.length > 1 && (
            <div className="flex items-center justify-center gap-2 mt-3">
              {images.map((img, i) => (
                <button key={img.id} onClick={() => goTo(i)} className={`rounded-lg overflow-hidden transition-all ${i === index ? 'ring-2 ring-primary ring-offset-2 ring-offset-bg-base' : 'opacity-60 hover:opacity-100'}`} aria-label={i === index ? `image ${i + 1} selected` : `select image ${i + 1}`}>
                  <Thumbnail src={img.image_url} alt={product.title} size={48} />
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          {product.is_sold && <Badge variant="secondary" className="text-xs">{t.product.soldOut}</Badge>}
        </div>
        {needsTranslation && (
          <Button variant="ghost" size="sm" onClick={onTranslate} disabled={isTranslating}>
            {isTranslating ? t.product.translating : isTranslated ? t.product.showOriginal : t.product.translate}
          </Button>
        )}
      </div>

      <h2 className="text-2xl font-bold mb-2 text-text-heading">{displayTitle}</h2>
      <h3 className="text-3xl font-bold mb-6 text-primary">{product.price.toLocaleString()}{t.common.won}</h3>

      <div className="mt-6 border-t border-border-base pt-6">
        <div className="whitespace-pre-wrap leading-relaxed text-text-body">{displayContent}</div>
      </div>

      <div className="flex items-center justify-between pt-6 mt-6 border-t border-border-base">
        <Button variant={isLiked ? "primary" : "outline"} size="sm" onClick={handleLike}>
          <span className="mr-2">{isLiked ? '♥' : '♡'}</span>
          {t.product.like} {product.like_count + (isLiked ? 1 : 0)}
        </Button>
        {isOwner && (
          <div className="flex gap-2">
            <Button size="sm" onClick={startEditing}>{t.common.edit}</Button>
            <Button size="sm" variant="ghost" onClick={handleDelete} disabled={isDeleting}>{t.common.delete}</Button>
          </div>
        )}
      </div>
    </>
  );
}
