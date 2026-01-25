import { useState, MouseEvent } from 'react';
import { Link } from 'react-router-dom';
import { Product } from '@/features/product/types';
import { Avatar, Badge, Button } from '@mantine/core';
import { Card, CardContent, CardTitle, StatGroup } from '@/shared/components';
import { useUserProfile } from '@/features/user/hooks/useUser';
import { useTranslation } from '@/shared/i18n';

interface ProductCardProps {
  product: Product;
  showActions?: boolean;
  onEdit?: (product: Product) => void;
  onDelete?: (product: Product) => void;
}

export default function ProductCard({ product, showActions, onEdit, onDelete }: ProductCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(product.like_count);
  const { profile } = useUserProfile(product.owner_id);
  const t = useTranslation();

  const formatPrice = (price: number) => `${price.toLocaleString()}${t.common.won}`;

  // 이벤트 핸들러 (상단 분리)
  const stop = (e: MouseEvent) => { e.preventDefault(); e.stopPropagation(); };

  const handleLike = (e: MouseEvent) => {
    stop(e);
    setIsLiked(prev => !prev);
    setLikeCount(prev => prev + (isLiked ? -1 : 1));
  };

  const handleEdit = (e: MouseEvent) => { stop(e); onEdit?.(product); };
  const handleDelete = (e: MouseEvent) => { stop(e); onDelete?.(product); };

  return (
    <Link to={`/products/${product.id}`} className="group text-inherit no-underline">
      <Card className="border border-border-medium rounded-lg p-3">
        <CardContent>
          {/* 판매자 프로필 */}
          <div className="flex items-center gap-2 mb-3">
            <Avatar src={profile?.profile_image ?? undefined} alt={profile?.nickname || t.product.seller} size="sm" />
            <span className="text-sm text-text-secondary truncate">{profile?.nickname || t.common.unknown}</span>
          </div>

          {/* 판매완료 뱃지 */}
          {product.is_sold && (
            <div className="mb-2">
              <Badge variant="light" color="gray" className="text-xs">{t.product.soldOut}</Badge>
            </div>
          )}

          <CardTitle className="tracking-tighter break-keep text-text-heading">{product.title}</CardTitle>
          <p className="text-sm text-text-muted line-clamp-2 mb-2">{product.content}</p>
          <div className="mb-1 text-[15px] font-extrabold text-primary">{formatPrice(product.price)}</div>

          {/* 좋아요 */}
          <StatGroup className="mt-auto pt-2.5">
            <Button
              onClick={handleLike}
              variant="subtle"
              color="gray"
              size="sm"
              className={`p-1 flex items-center gap-1 text-[13px] ${isLiked ? 'text-primary' : 'text-text-muted'}`}
            >
              <span>{isLiked ? '♥' : '♡'}</span>
              <span>{likeCount}</span>
            </Button>
          </StatGroup>

          {/* 액션 버튼 */}
          {showActions && (
            <div className="flex gap-2 mt-3 pt-3 border-t border-border-medium">
              <Button onClick={handleEdit} variant="light" size="sm" className="flex-1">{t.common.edit}</Button>
              <Button onClick={handleDelete} variant="subtle" color="gray" size="sm" className="flex-1 text-status-error hover:bg-status-error-hover">{t.common.delete}</Button>
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
