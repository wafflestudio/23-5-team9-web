import { useParams } from "react-router-dom";
import { useProduct } from "@/features/product/hooks/useProducts";
import { Loading, ErrorMessage, EmptyState } from "@/shared/ui/StatusMessage";
import { PageContainer } from "@/shared/layouts/PageContainer";
import { Button } from "@/shared/ui/Button";
import { DetailHeader } from "@/shared/ui/DetailHeader";
import { DetailSection } from "@/shared/ui/DetailSection";
import { DetailImage } from "@/shared/ui/DetailImage";

function ProductDetail() {
  const { id } = useParams();
  const { product, loading, error } = useProduct(id);

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} />;
  if (!product) return <EmptyState message="상품 정보가 없습니다." />;

  return (
    <PageContainer>
      <DetailHeader />

      <DetailSection>
        {product.imageUrl && (
          <DetailImage src={product.imageUrl} alt={product.title} />
        )}

        <h2 className="text-2xl font-bold mb-2">{product.title}</h2>
        <p className="text-sm text-text-secondary mb-4">{product.category}</p>
        <h3 className="text-3xl font-bold mb-6 text-text-heading">{product.price.toLocaleString()}원</h3>

        <div className="flex gap-2 text-text-secondary text-sm pb-6 border-b border-border-base">
          <span>{product.location}</span>
          <span>·</span>
          <span>{new Date(product.createdAt).toLocaleDateString()}</span>
          <span>·</span>
          <span>관심 {product.likeCount}</span>
        </div>

        <div className="mt-6 whitespace-pre-wrap leading-relaxed text-text-body">
          {product.content}
        </div>
      </DetailSection>

      <div className="mt-6 flex gap-3">
        <Button variant="outline" size="lg" className="gap-2">
          <span className="text-red-500">♥</span> {product.likeCount}
        </Button>
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