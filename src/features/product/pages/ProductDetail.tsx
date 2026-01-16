import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useProducts } from "@/features/product/hooks/useProducts";
import { Loading, ErrorMessage, EmptyState } from "@/shared/ui/StatusMessage";
import { PageContainer } from "@/shared/layouts/PageContainer";
import { Button } from "@/shared/ui/Button";
import { DetailHeader } from "@/shared/ui/DetailHeader";
import { DetailSection } from "@/shared/ui/DetailSection";
import Badge from "@/shared/ui/Badge";

function ProductDetail() {
  const { id } = useParams();
  const { products, loading, error } = useProducts();
  const product = products.find(p => p.id === id);

  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

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

  return (
    <PageContainer>
      <DetailHeader />

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
          onClick={() => alert('채팅 기능은 준비중입니다.')}
        >
          채팅하기
        </Button>
      </div>
    </PageContainer>
  );
}

export default ProductDetail;
