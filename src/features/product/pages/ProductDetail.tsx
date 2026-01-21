import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useProduct, useUserProducts } from "@/features/product/hooks/useProducts";
import { useUser, useUserProfile } from "@/features/user/hooks/useUser";
import { createOrGetRoom } from "@/features/chat/api/chatApi";
import { PageContainer } from "@/shared/layouts/PageContainer";
import { Loading, ErrorMessage, EmptyState, Button, DetailHeader, DetailSection, Badge, Avatar } from '@/shared/ui';
import ProductCard from "@/features/product/components/ProductCard";

// ----------------------------------------------------------------------
// 1. UI Components (디자인 복구됨)
// ----------------------------------------------------------------------

// 판매자 프로필 카드 (원래 디자인의 hover 효과 및 여백 복구)
const SellerProfileCard = ({ profile, onClick }: { profile: any, onClick: () => void }) => (
  <div 
    onClick={onClick} 
    className="flex items-center gap-3 cursor-pointer hover:bg-bg-base rounded-lg p-2 -m-2 transition-colors"
  >
    <Avatar src={profile?.profile_image} alt={profile?.nickname} size="sm" />
    <div>
      <div className="font-semibold text-text-heading">{profile?.nickname || '알 수 없음'}</div>
      <div className="text-sm text-text-secondary">판매자</div>
    </div>
  </div>
);

// 판매자 물품 리스트
const SellerProductList = ({ products, currentOwnerId, nickname }: { products: any[], currentOwnerId: string, nickname?: string }) => {
  const sellerProducts = products.filter(p => p.owner_id === currentOwnerId).slice(0, 4);
  
  if (sellerProducts.length === 0) return null;

  return (
    <div className="mt-8">
      <h3 className="text-lg font-bold mb-4">{nickname || '판매자'}의 판매 물품</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {sellerProducts.map(p => <ProductCard key={p.id} product={p} />)}
      </div>
    </div>
  );
};

// ----------------------------------------------------------------------
// 2. Main Page Component
// ----------------------------------------------------------------------

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isLoggedIn } = useUser();
  
  // Data Fetching
  const { product, loading: productLoading, error: productError } = useProduct(id!);
  const { profile: sellerProfile } = useUserProfile(product?.owner_id);
  const { products, loading: productsLoading } = useUserProducts(product?.owner_id!); 

  // Local State
  const [isLiked, setIsLiked] = useState(false);
  const [chatLoading, setChatLoading] = useState(false);

  // Handlers
  const handleLikeClick = () => {
    setIsLiked(prev => !prev);
  };

  const handleChatClick = async () => {
    if (!product) return;
    if (!isLoggedIn) return navigate('/auth/login');
    if (String(user?.id) === product.owner_id) return alert('본인의 상품입니다.');

    setChatLoading(true);
    try {
      const roomId = await createOrGetRoom(product.owner_id);
      navigate(`/chat/${roomId}`);
    } catch (err) {
      console.error(err);
      alert('채팅방을 열 수 없습니다.');
    } finally {
      setChatLoading(false);
    }
  };

  if (productLoading || productsLoading) return <Loading />;
  if (productError) return <ErrorMessage message="상품 정보를 불러올 수 없습니다." />;
  if (!product) return <EmptyState message="상품 정보가 없습니다." />;

  return (
    <PageContainer>
      <DetailHeader />

      {/* 섹션 1: 판매자 정보 (mb-4 여백 복구) */}
      <DetailSection className="mb-4">
        <SellerProfileCard 
          profile={sellerProfile} 
          onClick={() => navigate(`/user/${product.owner_id}`)} 
        />
      </DetailSection>

      {/* 섹션 2: 상품 상세 정보 (구분선 및 여백 디자인 복구) */}
      <DetailSection>
        {/* 판매완료 배지 */}
        <div className="flex items-center gap-2 mb-4">
          {product.is_sold && <Badge variant="secondary" className="text-xs">판매완료</Badge>}
        </div>

        {/* 제목 및 가격 */}
        <h2 className="text-2xl font-bold mb-2 text-text-heading">{product.title}</h2>
        <h3 className="text-3xl font-bold mb-6 text-primary">{product.price.toLocaleString()}원</h3>

        {/* 본문 (상단 구분선 border-t 복구) */}
        <div className="mt-6 whitespace-pre-wrap leading-relaxed text-text-body border-t border-border-base pt-6">
          {product.content}
        </div>

        {/* 좋아요 버튼 (상단 구분선 border-t 복구) */}
        <div className="flex gap-4 pt-6 mt-6 border-t border-border-base">
          <Button 
            variant={isLiked ? "primary" : "outline"} 
            size="sm" 
            onClick={handleLikeClick}
          >
            <span className="mr-2">{isLiked ? '♥' : '♡'}</span>
            좋아요 {product.like_count + (isLiked ? 1 : 0)}
          </Button>
        </div>
      </DetailSection>

      {/* 하단 버튼 */}
      <div className="mt-6">
        <Button size="lg" fullWidth onClick={handleChatClick} disabled={chatLoading}>
          {chatLoading ? '채팅방 연결 중...' : '채팅하기'}
        </Button>
      </div>

      {/* 판매자의 다른 상품 */}
      {products && (
        <SellerProductList 
          products={products} 
          currentOwnerId={product.owner_id} 
          nickname={sellerProfile?.nickname || ''} 
        />
      )}
    </PageContainer>
  );
}

export default ProductDetail;