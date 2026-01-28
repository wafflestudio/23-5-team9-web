import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import type { AuctionResponse } from '../../types';
import { Card, CardContent, CardImage, CardTitle, Badge } from '@/shared/ui';
import { imageApi, ImageUploadResponse } from '@/features/product/api/imageApi';
import { useTranslation } from '@/shared/i18n';

interface AuctionCardProps {
  auction: AuctionResponse;
}

function formatRemainingTime(endAt: string): string {
  const now = new Date();
  const end = new Date(endAt);
  const diff = end.getTime() - now.getTime();

  if (diff <= 0) return '종료됨';

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  if (days > 0) return `${days}일 ${hours}시간 남음`;
  if (hours > 0) return `${hours}시간 ${minutes}분 남음`;
  return `${minutes}분 남음`;
}

export default function AuctionCard({ auction }: AuctionCardProps) {
  const t = useTranslation();

  const formatPrice = (price: number) => `${price.toLocaleString()}${t.common.won}`;

  const firstImageId = useMemo(
    () => (auction.product.image_ids && auction.product.image_ids.length > 0 ? auction.product.image_ids[0] : undefined),
    [auction.product.image_ids]
  );

  const { data: firstImage } = useQuery<ImageUploadResponse | null>({
    queryKey: ['product', 'image', firstImageId],
    queryFn: async () => (firstImageId ? await imageApi.getById(firstImageId) : null),
    enabled: !!firstImageId,
  });

  const isEnded = auction.status !== 'active';
  const remainingTime = formatRemainingTime(auction.end_at);

  return (
    <Link to={`/auction/${auction.id}`} className="group text-inherit no-underline">
      <Card className="border border-border-medium rounded-lg p-3">
        <CardContent>
          {/* 경매 상태 뱃지 */}
          <div className="flex items-center justify-between mb-3">
            <Badge variant={isEnded ? 'secondary' : 'primary'} className="text-xs">
              {isEnded ? '종료' : '진행중'}
            </Badge>
            {!isEnded && (
              <span className="text-xs text-status-error font-medium">{remainingTime}</span>
            )}
          </div>

          {/* 상품 이미지 */}
          {auction.product.image_ids && auction.product.image_ids.length > 0 && (
            <CardImage src={firstImage?.image_url ?? undefined} alt={auction.product.title} aspectRatio="square" />
          )}

          <CardTitle className="tracking-tighter break-keep text-text-heading">
            {auction.product.title}
          </CardTitle>
          <p className="text-sm text-text-muted line-clamp-2 mb-2">{auction.product.content}</p>

          {/* 가격 정보 */}
          <div className="space-y-1">
            <div className="text-xs text-text-muted">
              시작가: {formatPrice(auction.starting_price)}
            </div>
            <div className="text-[15px] font-extrabold text-primary">
              현재가: {formatPrice(auction.current_price)}
            </div>
          </div>

          {/* 입찰 수 */}
          <div className="mt-2 text-xs text-text-secondary">
            입찰 {auction.bid_count}회
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
