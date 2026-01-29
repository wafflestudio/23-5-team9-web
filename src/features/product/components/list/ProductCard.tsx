import { useState, useMemo, MouseEvent } from 'react';
import { Link } from 'react-router-dom';
import type { Product } from '@/features/product/types';
import type { AuctionInfo } from '@/shared/api/types';
import { Card, CardContent, CardImage, CardTitle, Badge, Button, StatGroup, Avatar } from '@/shared/ui';
import { useUserProfile } from '@/features/user/hooks/useUser';
import { useTranslation } from '@/shared/i18n';
import { formatPrice, formatRemainingTime } from '@/shared/lib/formatting';
import { useFirstImage } from '@/features/image';

interface ProductCardProps {
  product: Product & { auction?: AuctionInfo };
  showActions?: boolean;
  onEdit?: (product: Product) => void;
  onDelete?: (product: Product) => void;
}

export default function ProductCard({ product, showActions, onEdit, onDelete }: ProductCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(product.like_count);
  const { profile } = useUserProfile(product.owner_id);
  const t = useTranslation();
  const firstImageUrl = useFirstImage(product.image_ids);

  const auction = product.auction;
  const isAuction = !!auction;
  const isAuctionEnded = auction?.status !== 'active';

  const timeLabels = useMemo(() => ({
    timeEnded: t.auction.timeEnded,
    days: t.auction.days,
    hours: t.auction.hours,
    minutes: t.auction.minutes,
    remaining: t.auction.remaining,
  }), [t]);

  const remainingTime = auction ? formatRemainingTime(auction.end_at, timeLabels) : '';

  const stop = (e: MouseEvent) => { e.preventDefault(); e.stopPropagation(); };

  const handleLike = (e: MouseEvent) => {
    stop(e);
    setIsLiked(prev => !prev);
    setLikeCount(prev => prev + (isLiked ? -1 : 1));
  };

  return (
    <Link to={`/products/${product.id}`} className="group text-inherit no-underline">
      <Card className="border border-border-medium rounded-lg p-3">
        <CardContent>
          <div className="flex items-center gap-2 mb-3">
            <Avatar src={profile?.profile_image ?? undefined} alt={profile?.nickname || t.product.seller} size="sm" />
            <span className="text-sm text-text-secondary truncate">{profile?.nickname || t.common.unknown}</span>
          </div>

          {isAuction && (
            <div className="flex items-center justify-between mb-2">
              <Badge variant={isAuctionEnded ? 'secondary' : 'primary'} className="text-xs">
                {isAuctionEnded ? t.auction.ended : t.auction.inProgress}
              </Badge>
              {!isAuctionEnded && (
                <span className="text-xs text-status-error font-medium">{remainingTime}</span>
              )}
            </div>
          )}

          {!isAuction && product.is_sold && (
            <div className="mb-2">
              <Badge variant="secondary" className="text-xs">{t.product.soldOut}</Badge>
            </div>
          )}

          {(product.image_ids?.length ?? 0) > 0 && (
            <CardImage src={firstImageUrl ?? undefined} alt={product.title} aspectRatio="square" />
          )}

          <CardTitle className="tracking-tighter break-keep text-text-heading">{product.title}</CardTitle>
          <p className="text-sm text-text-muted line-clamp-2 mb-2">{product.content}</p>

          {isAuction ? (
            <div className="space-y-1">
              <div className="text-xs text-text-muted">
                {t.auction.startingPrice}: {formatPrice(product.price, t.common.won)}
              </div>
              <div className="text-[15px] font-extrabold text-primary">
                {t.auction.currentPrice}: {formatPrice(auction.current_price, t.common.won)}
              </div>
              <div className="text-xs text-text-secondary">
                {t.auction.bidsCount.replace('{count}', String(auction.bid_count))}
              </div>
            </div>
          ) : (
            <div className="mb-1 text-[15px] font-extrabold text-primary">{formatPrice(product.price, t.common.won)}</div>
          )}

          <StatGroup className="mt-auto pt-2.5">
            <Button
              onClick={handleLike}
              variant="ghost"
              size="sm"
              className={`p-1 flex items-center gap-1 text-[13px] ${isLiked ? 'text-primary' : 'text-text-muted'}`}
            >
              <span>{isLiked ? '♥' : '♡'}</span>
              <span>{likeCount}</span>
            </Button>
          </StatGroup>

          {showActions && (
            <div className="flex gap-2 mt-3 pt-3 border-t border-border-medium">
              <Button onClick={(e) => { stop(e); onEdit?.(product); }} variant="secondary" size="sm" className="flex-1">{t.common.edit}</Button>
              <Button onClick={(e) => { stop(e); onDelete?.(product); }} variant="ghost" size="sm" className="flex-1 text-status-error hover:bg-status-error-hover">{t.common.delete}</Button>
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
