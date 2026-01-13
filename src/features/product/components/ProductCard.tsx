import { Link } from 'react-router-dom';
import { Product } from '@/features/product/hooks/useProducts';
// import '@/styles/product-list.css';

interface ProductCardProps {
  product: Product;
}

function ProductCard({ product }: ProductCardProps) {
  const productDetailUrl = `/products/${product.id}`;

  return (
    <Link to={productDetailUrl} className="flex flex-col text-inherit no-underline transition-transform duration-200 hover:-translate-y-1">
      <div className="relative w-full pt-[100%] rounded-xl overflow-hidden bg-gray-100 mb-3 border border-black/5">
        {product.imageUrl ? (
          <img 
            src={product.imageUrl} 
            alt={product.title} 
            className="absolute top-0 left-0 w-full h-full object-cover transition-transform duration-300"
          />
        ) : (
          <div className="absolute top-0 left-0 w-full h-full bg-gray-200"></div>
        )}
      </div>
      <div className="px-[2px]">
        <h3 className="text-base font-medium mb-1.5 leading-snug text-dark tracking-[-0.02em] break-words line-clamp-2">{product.title}</h3>
        <div className="text-[13px] text-gray-light mb-1 flex items-center">
          <span className="post-location">{product.location}</span>
          <span className="mx-1">·</span>
          <span className="post-time">{new Date(product.createdAt).toLocaleDateString()}</span>
        </div>
        <div className="text-[15px] font-extrabold text-dark mb-1">
          {product.price.toLocaleString()}원
        </div>
        <div className="text-[13px] text-gray-light flex items-center gap-2 mt-1">
          <span className="text-gray-light text-[13px]">
            관심 {product.likeCount}
          </span>
        </div>
      </div>
    </Link>
  );
}

export default ProductCard;
