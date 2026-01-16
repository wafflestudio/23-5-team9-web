import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useProducts } from "@/features/product/hooks/useProducts";
import { useUser, useUserProfile } from "@/features/user/hooks/useUser";
import { createOrGetRoom } from "@/features/chat/api/chatApi";
import { Loading, ErrorMessage, EmptyState } from "@/shared/ui/StatusMessage";
import { PageContainer } from "@/shared/layouts/PageContainer";
import { Button } from "@/shared/ui/Button";
import { DetailHeader } from "@/shared/ui/DetailHeader";
import { DetailSection } from "@/shared/ui/DetailSection";
import Badge from "@/shared/ui/Badge";
import Avatar from "@/shared/ui/Avatar";

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, loading, error } = useProducts();
  const { user, isLoggedIn } = useUser();
  const product = products.find(p => p.id === id);
  const { profile: sellerProfile } = useUserProfile(product?.ownerId);

  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [chatLoading, setChatLoading] = useState(false);

  useEffect(() => {
    if (product) {
      setLikeCount(product.likeCount);
    }
  }, [product]);

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} />;
  if (!product) return <EmptyState message="상품 정보가 없습니다." />;

  const handleLikeClick = () => {
    setIsLiked(!isLiked);
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
  };

  const handleChatClick = async () => {
    if (!isLoggedIn) {
      navigate('/auth/login');
      return;
    }

    if (String(user?.id) === product.ownerId) {
      alert('본인의 상품입니다.');
      return;
    }

    setChatLoading(true);
    try {
      const roomId = await createOrGetRoom(product.ownerId);
      navigate(`/chat/${roomId}`);
    } catch (err) {
      console.error('채팅방 생성 실패:', err);
      alert('채팅방을 열 수 없습니다.');
    } finally {
      setChatLoading(false);
    }
  };

  return (
    <PageContainer>
      <DetailHeader />

      {/* 판매자 프로필 */}
      <DetailSection className="mb-4">
        <div className="flex items-center gap-3">
          <Avatar
            src={sellerProfile?.profile_image || undefined}
            alt={sellerProfile?.nickname || '판매자'}
            size="sm"
          />
          <div>
            <div className="font-semibold text-text-heading">
              {sellerProfile?.nickname || '알 수 없음'}
            </div>
            <div className="text-sm text-text-secondary">판매자</div>
          </div>
        </div>
      </DetailSection>

      <DetailSection>
        <div className="flex items-center gap-2 mb-4">
          {product.isSold && (
            <Badge variant="secondary" className="text-xs">
              판매완료
            </Badge>
          )}
        </div>

        <h2 className="text-2xl font-bold mb-2">{product.title}</h2>
        <h3 className="text-3xl font-bold mb-6 text-text-heading">{product.price.toLocaleString()}원</h3>

        <div className="mt-6 whitespace-pre-wrap leading-relaxed text-text-body border-t border-border-base pt-6">
          {product.content}
        </div>

        <div className="flex gap-4 pt-6 mt-6 border-t border-border-base">
          <Button
            variant={isLiked ? "primary" : "outline"}
            size="sm"
            onClick={handleLikeClick}
          >
            <span className="mr-2">{isLiked ? '♥' : '♡'}</span>
            좋아요 {likeCount}
          </Button>
        </div>
      </DetailSection>

      <div className="mt-6">
        <Button
          size="lg"
          fullWidth
          onClick={handleChatClick}
          disabled={chatLoading}
        >
          {chatLoading ? '채팅방 연결 중...' : '채팅하기'}
        </Button>
      </div>
    </PageContainer>
  );
}

export default ProductDetail;
