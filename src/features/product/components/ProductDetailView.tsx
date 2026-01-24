import { Button, Badge } from '@/shared/ui';
import { useTranslation } from '@/shared/i18n';
import type { Product } from '@/features/product/api/productApi';

interface ProductDetailViewProps {
  product: Product;
  isLiked: boolean;
  isOwner: boolean;
  isDeleting: boolean;
  onLike: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function ProductDetailView({
  product,
  isLiked,
  isOwner,
  isDeleting,
  onLike,
  onEdit,
  onDelete,
}: ProductDetailViewProps) {
  const t = useTranslation();

  return (
    <>
      <div className="flex items-center gap-2 mb-4">
        {product.is_sold && <Badge variant="secondary" className="text-xs">{t.product.soldOut}</Badge>}
      </div>

      <h2 className="text-2xl font-bold mb-2 text-text-heading">{product.title}</h2>
      <h3 className="text-3xl font-bold mb-6 text-primary">{product.price.toLocaleString()}{t.common.won}</h3>

      <div className="mt-6 border-t border-border-base pt-6">
        <div className="whitespace-pre-wrap leading-relaxed text-text-body">
          {product.content}
        </div>
      </div>

      <div className="flex items-center justify-between pt-6 mt-6 border-t border-border-base">
        <Button
          variant={isLiked ? "primary" : "outline"}
          size="sm"
          onClick={onLike}
        >
          <span className="mr-2">{isLiked ? '♥' : '♡'}</span>
          {t.product.like} {product.like_count + (isLiked ? 1 : 0)}
        </Button>

        {isOwner && (
          <div className="flex gap-2">
            <Button size="sm" variant="secondary" onClick={onEdit}>
              {t.common.edit}
            </Button>
            <Button size="sm" variant="ghost" onClick={onDelete} disabled={isDeleting}>
              {t.common.delete}
            </Button>
          </div>
        )}
      </div>
    </>
  );
}
