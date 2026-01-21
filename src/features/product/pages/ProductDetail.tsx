import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useProduct, useUserProducts, useDeleteProduct, useUpdateProduct } from "@/features/product/hooks/useProducts";
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
  const { products } = useUserProducts(product?.owner_id!);
  const deleteProduct = useDeleteProduct();
  const updateProduct = useUpdateProduct();

  // Local State
  const [isLiked, setIsLiked] = useState(false);
  const [chatLoading, setChatLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    title: '',
    price: '',
    content: '',
    is_sold: false,
  });

  // Initialize edit form when product loads
  useEffect(() => {
    if (product) {
      setEditForm({
        title: product.title,
        price: String(product.price),
        content: product.content,
        is_sold: product.is_sold,
      });
    }
  }, [product]);

  // Check if current user is the owner
  const isOwner = product && String(user?.id) === product.owner_id;

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

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    if (product) {
      setEditForm({
        title: product.title,
        price: String(product.price),
        content: product.content,
        is_sold: product.is_sold,
      });
    }
    setIsEditing(false);
  };

  const handleSaveEdit = async () => {
    if (!product) return;

    if (!editForm.title.trim() || !editForm.content.trim() || !editForm.price) {
      alert('모든 필드를 입력해주세요.');
      return;
    }

    try {
      await updateProduct.mutateAsync({
        id: product.id,
        data: {
          title: editForm.title.trim(),
          content: editForm.content.trim(),
          price: Number(editForm.price),
          category_id: product.category_id,
          is_sold: editForm.is_sold,
        },
      });
      alert('상품이 수정되었습니다.');
      setIsEditing(false);
    } catch {
      alert('상품 수정에 실패했습니다.');
    }
  };

  const handleDeleteClick = async () => {
    if (!product) return;
    if (!confirm('정말로 이 상품을 삭제하시겠습니까?')) return;
    try {
      await deleteProduct.mutateAsync(product.id);
      alert('상품이 삭제되었습니다.');
      navigate('/products');
    } catch {
      alert('상품 삭제에 실패했습니다.');
    }
  };

  const handleFormChange = (field: string, value: string | boolean) => {
    setEditForm(prev => ({ ...prev, [field]: value }));
  };

  if (productLoading) return <Loading />;
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
        {isEditing ? (
          <>
            <input
              type="text"
              value={editForm.title}
              onChange={(e) => handleFormChange('title', e.target.value)}
              placeholder="상품 제목"
              className="w-full text-2xl font-bold text-text-heading bg-transparent border-b border-dashed border-border-medium focus:border-primary outline-none pb-1 mb-2"
            />
            <div className="flex items-baseline gap-1 mb-6">
              <input
                type="number"
                value={editForm.price}
                onChange={(e) => handleFormChange('price', e.target.value)}
                placeholder="가격"
                min="0"
                className="text-3xl font-bold text-primary bg-transparent border-b border-dashed border-border-medium focus:border-primary outline-none pb-1 w-40"
              />
              <span className="text-3xl font-bold text-primary">원</span>
            </div>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-bold mb-2 text-text-heading">{product.title}</h2>
            <h3 className="text-3xl font-bold mb-6 text-primary">{product.price.toLocaleString()}원</h3>
          </>
        )}

        {/* 본문 (상단 구분선 border-t 복구) */}
        <div className="mt-6 border-t border-border-base pt-6">
          {isEditing ? (
            <textarea
              value={editForm.content}
              onChange={(e) => handleFormChange('content', e.target.value)}
              rows={6}
              className="w-full bg-transparent text-text-body leading-relaxed outline-none border-b border-dashed border-border-medium focus:border-primary resize-none"
              placeholder="상품 설명을 입력하세요"
            />
          ) : (
            <div className="whitespace-pre-wrap leading-relaxed text-text-body">
              {product.content}
            </div>
          )}
        </div>

        {/* 좋아요 버튼 + 수정/삭제 버튼 (상단 구분선 border-t 복구) */}
        <div className="flex items-center justify-between pt-6 mt-6 border-t border-border-base">
          <Button
            variant={isLiked ? "primary" : "outline"}
            size="sm"
            onClick={handleLikeClick}
          >
            <span className="mr-2">{isLiked ? '♥' : '♡'}</span>
            좋아요 {product.like_count + (isLiked ? 1 : 0)}
          </Button>

          {isOwner && (
            <div className="flex gap-2">
              {isEditing ? (
                <>
                  <label className="flex items-center gap-2 cursor-pointer mr-2">
                    <input
                      type="checkbox"
                      checked={editForm.is_sold}
                      onChange={(e) => handleFormChange('is_sold', e.target.checked)}
                      className="w-4 h-4 accent-primary"
                    />
                    <span className="text-sm text-text-secondary">판매완료</span>
                  </label>
                  <Button size="sm" variant="secondary" onClick={handleCancelEdit}>
                    취소
                  </Button>
                  <Button size="sm" onClick={handleSaveEdit} disabled={updateProduct.isPending}>
                    {updateProduct.isPending ? '저장 중...' : '저장'}
                  </Button>
                </>
              ) : (
                <>
                  <Button size="sm" variant="secondary" onClick={handleEditClick}>
                    수정
                  </Button>
                  <Button size="sm" variant="ghost" onClick={handleDeleteClick} disabled={deleteProduct.isPending}>
                    삭제
                  </Button>
                </>
              )}
            </div>
          )}
        </div>
      </DetailSection>

      {/* 하단 버튼 - 비로그인/다른 사용자용 채팅 버튼 */}
      {!isOwner && (
        <div className="mt-6">
          <Button size="lg" fullWidth onClick={handleChatClick} disabled={chatLoading}>
            {chatLoading ? '채팅방 연결 중...' : '채팅하기'}
          </Button>
        </div>
      )}

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
