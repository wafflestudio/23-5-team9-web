import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Product } from '@/features/product/api/productApi';
import { Card, CardContent, CardTitle } from '@/shared/ui/Card';
import Badge from '@/shared/ui/Badge';
import { Button } from '@/shared/ui/Button';
import { StatGroup } from '@/shared/ui/Stat';

const formatPrice = (price: number) => price.toLocaleString() + '원';

export default function ProductCard({ product }: { product: Product }) {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(product.likeCount);

  const handleLikeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setIsLiked(!isLiked);
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
  };

  return (
    <Link to={`/products/${product.id}`} className="group text-inherit no-underline">
      <Card>
        <CardContent>
          <div className="flex items-center gap-2 mb-2">
            {product.isSold && (
              <Badge variant="secondary" className="text-xs">
                판매완료
              </Badge>
            )}
          </div>
          <CardTitle className="tracking-tighter break-keep">
            {product.title}
          </CardTitle>
          <div className="mb-1 text-[15px] font-extrabold text-text-heading">
            {formatPrice(product.price)}
          </div>
          <p className="text-sm text-text-muted line-clamp-2 mb-2">
            {product.content}
          </p>
          <StatGroup className="mt-auto pt-2.5">
            <Button
              onClick={handleLikeClick}
              variant="ghost"
              size="sm"
              className={`p-1 flex items-center gap-1 text-[13px] ${isLiked ? 'text-primary' : 'text-text-muted'}`}
            >
              <span>{isLiked ? '♥' : '♡'}</span>
              <span>{likeCount}</span>
            </Button>
          </StatGroup>
        </CardContent>
      </Card>
    </Link>
  );
}
