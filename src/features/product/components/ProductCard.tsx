import { Link } from 'react-router-dom';
import { Product } from '@/features/product/hooks/useProducts';

// 포맷팅 로직을 컴포넌트 밖으로 분리하여 가독성 확보
const formatPrice = (price: number) => price.toLocaleString() + '원';
const formatDate = (date: string) => new Date(date).toLocaleDateString();

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link to={`/products/${product.id}`} className="group flex flex-col no-underline">
      {/* 이미지 영역: aspect-square를 사용하여 비율 유지 코드 단순화 */}
      <div className="relative mb-3 aspect-square w-full overflow-hidden rounded-xl bg-bg-box border border-black/5">
        {product.imageUrl && (
          <img
            src={product.imageUrl}
            alt={product.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        )}
      </div>

      {/* 텍스트 영역 */}
      <div className="px-0.5">
        <h3 className="mb-1.5 line-clamp-2 text-base font-medium leading-snug text-text-heading">
          {product.title}
        </h3>

        <div className="mb-1 flex items-center text-[13px] text-text-secondary">
          <span>{product.location}</span>
          <span className="mx-1">·</span>
          <span>{formatDate(product.createdAt)}</span>
        </div>

        <div className="mb-1 text-[15px] font-extrabold text-text-heading">
          {formatPrice(product.price)}
        </div>

        <div className="text-[13px] text-text-secondary">
          관심 {product.likeCount}
        </div>
      </div>
    </Link>
  );
}
