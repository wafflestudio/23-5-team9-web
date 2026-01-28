import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { PageContainer } from '@/shared/layouts/PageContainer';
import { DetailHeader, DetailSection, DetailImage, Thumbnail, Button, Badge, Input } from '@/shared/ui';
import { useAuction, usePlaceBid } from '@/features/auction/hooks/useAuctions';
import { imageApi, ImageUploadResponse } from '@/features/product/api/imageApi';
import { useTranslation } from '@/shared/i18n';
import { useIsLoggedIn } from '@/features/auth/hooks/store';
import { getErrorMessage } from '@/shared/api/types';

function formatRemainingTime(endAt: string): string {
  const now = new Date();
  const end = new Date(endAt);
  const diff = end.getTime() - now.getTime();

  if (diff <= 0) return '종료됨';

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  if (days > 0) return `${days}일 ${hours}시간 ${minutes}분`;
  if (hours > 0) return `${hours}시간 ${minutes}분 ${seconds}초`;
  return `${minutes}분 ${seconds}초`;
}

function formatDateTime(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function AuctionDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const t = useTranslation();
  const isLoggedIn = useIsLoggedIn();

  const { auction, loading, error, refetch } = useAuction(id!);
  const placeBidMutation = usePlaceBid();

  const [bidPrice, setBidPrice] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [remainingTime, setRemainingTime] = useState('');

  // 남은 시간 업데이트 (1초마다)
  useEffect(() => {
    if (!auction) return;

    const updateTime = () => {
      setRemainingTime(formatRemainingTime(auction.end_at));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, [auction]);

  // 이미지 조회
  const { data: images } = useQuery<ImageUploadResponse[]>({
    queryKey: ['auction', 'images', auction?.product.id, auction?.product.image_ids ?? []],
    queryFn: async () => {
      if (!auction?.product.image_ids || auction.product.image_ids.length === 0) return [];
      return Promise.all(auction.product.image_ids.map(imgId => imageApi.getById(imgId)));
    },
    enabled: !!auction,
  });

  useEffect(() => {
    setCurrentIndex(0);
  }, [images]);

  const handleBid = async () => {
    if (!isLoggedIn) {
      navigate('/auth/login');
      return;
    }

    const price = parseInt(bidPrice, 10);
    if (isNaN(price) || price <= 0) {
      alert('유효한 금액을 입력해주세요.');
      return;
    }

    if (auction && price <= auction.current_price) {
      alert(`현재가(${auction.current_price.toLocaleString()}원)보다 높은 금액을 입력해주세요.`);
      return;
    }

    try {
      await placeBidMutation.mutateAsync({
        auctionId: id!,
        data: { bid_price: price },
      });
      setBidPrice('');
      refetch();
      alert('입찰이 완료되었습니다!');
    } catch (err) {
      alert(getErrorMessage(err, '입찰에 실패했습니다.'));
    }
  };

  if (loading) {
    return (
      <PageContainer>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </PageContainer>
    );
  }

  if (error || !auction) {
    return (
      <PageContainer>
        <div className="text-center py-12">
          <p className="text-text-muted">경매를 찾을 수 없습니다.</p>
        </div>
      </PageContainer>
    );
  }

  const isEnded = auction.status !== 'active';
  const minBidPrice = auction.current_price + 1;

  return (
    <PageContainer>
      <DetailHeader />

      <DetailSection className="mb-4">
        {/* 경매 상태 */}
        <div className="flex items-center justify-between mb-4">
          <Badge variant={isEnded ? 'secondary' : 'primary'} size="lg">
            {isEnded ? '경매 종료' : '경매 진행중'}
          </Badge>
          {!isEnded && (
            <span className="text-status-error font-bold">{remainingTime} 남음</span>
          )}
        </div>

        {/* 종료 시간 */}
        <p className="text-sm text-text-muted mb-4">
          종료: {formatDateTime(auction.end_at)}
        </p>
      </DetailSection>

      <DetailSection>
        {/* 상품 이미지 */}
        {images && images.length > 0 && (
          <div className="mb-6">
            <div className="relative group">
              <DetailImage src={images[currentIndex].image_url} alt={auction.product.title} />

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
                    <Thumbnail src={img.image_url} alt={auction.product.title} size={48} />
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 상품 제목 */}
        <h2 className="text-2xl font-bold mb-4 text-text-heading">{auction.product.title}</h2>

        {/* 가격 정보 */}
        <div className="bg-bg-secondary rounded-lg p-4 mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-text-muted">시작가</span>
            <span className="text-text-body">{auction.starting_price.toLocaleString()}{t.common.won}</span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-text-muted">현재가</span>
            <span className="text-2xl font-bold text-primary">{auction.current_price.toLocaleString()}{t.common.won}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-text-muted">입찰 수</span>
            <span className="text-text-body">{auction.bid_count}회</span>
          </div>
        </div>

        {/* 입찰 폼 */}
        {!isEnded && (
          <div className="border border-border-base rounded-lg p-4 mb-6">
            <h3 className="font-semibold mb-3">입찰하기</h3>
            <p className="text-sm text-text-muted mb-3">
              최소 입찰가: {minBidPrice.toLocaleString()}{t.common.won} 이상
            </p>
            <div className="flex gap-2">
              <Input
                type="number"
                value={bidPrice}
                onChange={(e) => setBidPrice(e.target.value)}
                placeholder={`${minBidPrice.toLocaleString()}원 이상 입력`}
                min={minBidPrice}
                className="flex-1"
              />
              <Button
                variant="primary"
                onClick={handleBid}
                disabled={placeBidMutation.isPending}
              >
                {placeBidMutation.isPending ? '입찰중...' : '입찰'}
              </Button>
            </div>
          </div>
        )}

        {/* 상품 설명 */}
        <div className="border-t border-border-base pt-6">
          <h3 className="font-semibold mb-3">상품 설명</h3>
          <div className="whitespace-pre-wrap leading-relaxed text-text-body">
            {auction.product.content}
          </div>
        </div>
      </DetailSection>
    </PageContainer>
  );
}
