import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import type { AuctionResponse } from '../types';
import { Card, CardContent, CardImage, CardTitle, Badge } from '@/shared/ui';
import { useTranslation } from '@/shared/i18n';
import { formatPrice, formatRemainingTime } from '@/shared/lib/formatting';
import { useFirstImage } from '@/features/image';

interface AuctionCardProps {
  auction: AuctionResponse;
}

export default function AuctionCard({ auction }: AuctionCardProps) {
  const t = useTranslation();
  const firstImageUrl = useFirstImage(auction.product.image_ids);

  const timeLabels = useMemo(() => ({
    timeEnded: t.auction.timeEnded,
    days: t.auction.days,
    hours: t.auction.hours,
    minutes: t.auction.minutes,
    remaining: t.auction.remaining,
  }), [t]);

  const isEnded = auction.status !== 'active';
  const remainingTime = formatRemainingTime(auction.end_at, timeLabels);

  return (
    <Link to={`/products/${auction.product_id}`} className="group text-inherit no-underline">
      <Card className="border border-border-medium rounded-lg p-3">
        <CardContent>
          <div className="flex items-center justify-between mb-3">
            <Badge variant={isEnded ? 'secondary' : 'primary'} className="text-xs">
              {isEnded ? t.auction.ended : t.auction.inProgress}
            </Badge>
            {!isEnded && (
              <span className="text-xs text-status-error font-medium">{remainingTime}</span>
            )}
          </div>

          {(auction.product.image_ids?.length ?? 0) > 0 && (
            <CardImage src={firstImageUrl ?? undefined} alt={auction.product.title} aspectRatio="square" />
          )}

          <CardTitle className="tracking-tighter break-keep text-text-heading">
            {auction.product.title}
          </CardTitle>
          <p className="text-sm text-text-muted line-clamp-2 mb-2">{auction.product.content}</p>

          <div className="space-y-1">
            <div className="text-xs text-text-muted">
              {t.auction.startingPrice}: {formatPrice(auction.product.price, t.common.won)}
            </div>
            <div className="text-[15px] font-extrabold text-primary">
              {t.auction.currentPrice}: {formatPrice(auction.current_price, t.common.won)}
            </div>
          </div>

          <div className="mt-2 text-xs text-text-secondary">
            {t.auction.bidsCount.replace('{count}', String(auction.bid_count))}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
