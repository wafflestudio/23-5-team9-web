import { useState } from 'react';
import { Button, Badge } from '@/shared/ui';
import { useTranslation } from '@/shared/i18n';
import { useLanguage } from '@/shared/store/languageStore';
import { translateMultiple } from '@/shared/lib/translate';
import { useProductDetail } from '@/features/product/hooks/ProductDetailContext';

export function ProductDetailView() {
  const t = useTranslation();
  const { language } = useLanguage();
  const { product, isLiked, isOwner, isDeleting, handleLike, startEditing, handleDelete } = useProductDetail();

  const [isTranslated, setIsTranslated] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [translatedTitle, setTranslatedTitle] = useState('');
  const [translatedContent, setTranslatedContent] = useState('');

  if (!product) return null;

  const hasKorean = /[가-힣]/.test(product.title + product.content);
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
      const results = await translateMultiple([product.title, product.content], targetLang, sourceLang);
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
  const displayContent = isTranslated ? translatedContent : product.content;

  return (
    <>
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
