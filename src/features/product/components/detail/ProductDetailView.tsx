import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { imageApi } from '@/features/product/api/imageApi';
import type { ImageUploadResponse } from '@/features/product/api/imageApi';
import { DetailImage, Thumbnail } from '@/shared/ui';
import { Button, Badge } from '@/shared/ui';
import { useTranslation } from '@/shared/i18n';
import { useLanguage } from '@/shared/store/languageStore';
import { translateMultiple } from '@/shared/lib/translate';
import { useDetail } from '@/features/product/hooks/DetailContext';

export function ProductDetailView() {
  const t = useTranslation();
  const { language } = useLanguage();
  const { product, isLiked, isOwner, isDeleting, handleLike, startEditing, handleDelete } = useDetail();

  const { data: images } = useQuery<ImageUploadResponse[]>({
    // include the product's image_ids in the key so this query refetches
    // whenever the product's images change
    queryKey: ['detail', 'images', product.id, product.image_ids ?? []],
    queryFn: async () => {
      if (!product.image_ids || product.image_ids.length === 0) return [];
      const results = await Promise.all(product.image_ids.map(id => imageApi.getById(id)));
      return results;
    },
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  useEffect(() => {
    setCurrentIndex(0);
  }, [images]);

  const [isTranslated, setIsTranslated] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [translatedTitle, setTranslatedTitle] = useState('');
  const [translatedContent, setTranslatedContent] = useState('');

  const hasKorean = /[가-힣]/.test(product.title + (product.content ?? ''));
  const postLang = hasKorean ? 'ko' : 'en';
  const needsTranslation = postLang !== language;
  const targetLang = language;
  const sourceLang = postLang;

  const handleTranslate = async () => {
    if (isTranslated) {
      setIsTranslated(false);
      return;
    }

    if (translatedTitle && translatedContent) {
      setIsTranslated(true);
      return;
    }

    setIsTranslating(true);
    try {
      const results = await translateMultiple([product.title, product.content ?? ''], targetLang, sourceLang);
      setTranslatedTitle(results[0].translatedText);
      setTranslatedContent(results[1].translatedText);
      setIsTranslated(true);
    } catch {
      alert(t.product.translateFailed);
    } finally {
      setIsTranslating(false);
    }
  };

  const displayTitle = isTranslated ? translatedTitle : product.title;
  const displayContent = isTranslated ? translatedContent : (product.content ?? '');

  return (
    <>
      {images && images.length > 0 && (
        <div className="mb-6">
          <div className="relative group">
            <DetailImage src={images[currentIndex].image_url} alt={product.title} />

            {images.length > 1 && (
              <>
                {currentIndex > 0 && (
                  <button
                    onClick={() => setCurrentIndex((i) => i - 1)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label="previous image"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                )}
                {currentIndex < images.length - 1 && (
                  <button
                    onClick={() => setCurrentIndex((i) => i + 1)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label="next image"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                )}
              </>
            )}
          </div>

          {images.length > 1 && (
            <div className="flex items-center justify-center gap-2 mt-3">
              {images.map((img, idx) => (
                <button
                  key={img.id}
                  onClick={() => setCurrentIndex(idx)}
                  className={`rounded-lg overflow-hidden transition-all ${idx === currentIndex ? 'ring-2 ring-primary ring-offset-2 ring-offset-bg-base' : 'opacity-60 hover:opacity-100'}`}
                  aria-label={idx === currentIndex ? `image ${idx + 1} selected` : `select image ${idx + 1}`}
                >
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
          <Button
            variant="ghost"
            size="sm"
            onClick={handleTranslate}
            disabled={isTranslating}
          >
            {isTranslating ? t.product.translating : isTranslated ? t.product.showOriginal : t.product.translate}
          </Button>
        )}
      </div>

      <h2 className="text-2xl font-bold mb-2 text-text-heading">{displayTitle}</h2>
      <h3 className="text-3xl font-bold mb-6 text-primary">{product.price.toLocaleString()}{t.common.won}</h3>

      <div className="mt-6 border-t border-border-base pt-6">
        <div className="whitespace-pre-wrap leading-relaxed text-text-body">
          {displayContent}
        </div>
      </div>

      <div className="flex items-center justify-between pt-6 mt-6 border-t border-border-base">
        <Button
          variant={isLiked ? "primary" : "outline"}
          size="sm"
          onClick={handleLike}
        >
          <span className="mr-2">{isLiked ? '♥' : '♡'}</span>
          {t.product.like} {product.like_count + (isLiked ? 1 : 0)}
        </Button>

        {isOwner && (
          <div className="flex gap-2">
            <Button size="sm" onClick={startEditing}>
              {t.common.edit}
            </Button>
            <Button size="sm" variant="ghost" onClick={handleDelete} disabled={isDeleting}>
              {t.common.delete}
            </Button>
          </div>
        )}
      </div>
    </>
  );
}
