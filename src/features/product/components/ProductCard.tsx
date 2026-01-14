import { Link } from 'react-router-dom';
import { Product } from '@/features/product/hooks/useProducts';
import { Card, CardImage, CardContent, CardTitle, CardMeta } from '@/shared/ui/Card';

const formatPrice = (price: number) => price.toLocaleString() + '원';
const formatDate = (date: string) => new Date(date).toLocaleDateString();

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link to={`/products/${product.id}`} className="group no-underline">
      <Card>
        <CardImage src={product.imageUrl} alt={product.title} aspectRatio="square" />
        <CardContent>
          <CardTitle>{product.title}</CardTitle>
          <CardMeta className="mb-1 flex items-center">
            <span>{product.location}</span>
            <span className="mx-1">·</span>
            <span>{formatDate(product.createdAt)}</span>
          </CardMeta>
          <div className="mb-1 text-[15px] font-extrabold text-text-heading">
            {formatPrice(product.price)}
          </div>
          <CardMeta>관심 {product.likeCount}</CardMeta>
        </CardContent>
      </Card>
    </Link>
  );
}
