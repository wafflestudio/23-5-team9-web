import { Link } from 'react-router-dom';
import { Product } from '@/features/product/hooks/useProducts';
import '@/styles/product-list.css';

interface ProductCardProps {
  product: Product;
}

function ProductCard({ product }: ProductCardProps) {
  const productDetailUrl = `/products/${product.id}`;

  return (
    <Link to={productDetailUrl} className="post-list-item">
      <div className="post-image-wrapper">
        {product.imageUrl ? (
          <img 
            src={product.imageUrl} 
            alt={product.title} 
            className="post-image"
          />
        ) : (
          <div className="post-image-placeholder"></div>
        )}
      </div>
      <div className="post-content">
        <h3 className="post-title">{product.title}</h3>
        <div className="post-info">
          <span className="post-location">{product.location}</span>
          <span className="post-dot">·</span>
          <span className="post-time">{new Date(product.createdAt).toLocaleDateString()}</span>
        </div>
        <div className="post-price">
          {product.price.toLocaleString()}원
        </div>
        <div className="post-footer">
          <span className="post-likes">
            관심 {product.likeCount}
          </span>
        </div>
      </div>
    </Link>
  );
}

export default ProductCard;
