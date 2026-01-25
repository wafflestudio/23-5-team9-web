import { useState, MouseEvent } from 'react';
import { Link } from 'react-router-dom';
import { Product } from '@/features/product/types';
import {
  Avatar,
  Badge,
  Button,
  Card,
  Group,
  Stack,
  Text,
  Title,
  Box,
  Divider,
} from '@mantine/core';
import { useUserProfile } from '@/features/user/hooks/useUser';
import { useTranslation } from '@/shared/i18n';

interface ProductCardProps {
  product: Product;
  showActions?: boolean;
  onEdit?: (product: Product) => void;
  onDelete?: (product: Product) => void;
}

export default function ProductCard({ product, showActions, onEdit, onDelete }: ProductCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(product.like_count);
  const { profile } = useUserProfile(product.owner_id);
  const t = useTranslation();

  const formatPrice = (price: number) => `${price.toLocaleString()}${t.common.won}`;

  // 이벤트 핸들러
  const stop = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleLike = (e: MouseEvent) => {
    stop(e);
    setIsLiked((prev) => !prev);
    setLikeCount((prev) => prev + (isLiked ? -1 : 1));
  };

  const handleEdit = (e: MouseEvent) => {
    stop(e);
    onEdit?.(product);
  };

  const handleDelete = (e: MouseEvent) => {
    stop(e);
    onDelete?.(product);
  };

  return (
    <Box
      component={Link}
      to={`/products/${product.id}`}
      style={{ textDecoration: 'none', color: 'inherit' }}
    >
      <Card p="sm" withBorder>
        <Stack gap="xs">
          {/* 판매자 프로필 */}
          <Group gap="xs">
            <Avatar
              src={profile?.profile_image ?? undefined}
              alt={profile?.nickname || t.product.seller}
              size="sm"
            />
            <Text size="sm" c="slate.5" truncate>
              {profile?.nickname || t.common.unknown}
            </Text>
          </Group>

          {/* 판매완료 뱃지 */}
          {product.is_sold && (
            <Badge variant="light" color="gray" size="sm">
              {t.product.soldOut}
            </Badge>
          )}

          {/* 제목 */}
          <Title order={5} c="slate.9" lineClamp={2} lh={1.4}>
            {product.title}
          </Title>

          {/* 설명 */}
          <Text size="sm" c="slate.5" lineClamp={2}>
            {product.content}
          </Text>

          {/* 가격 */}
          <Text size="md" fw={800} c="brand.5">
            {formatPrice(product.price)}
          </Text>

          {/* 좋아요 버튼 */}
          <Group gap="xs" mt="auto" pt="xs">
            <Button
              onClick={handleLike}
              variant="subtle"
              color={isLiked ? 'brand' : 'gray'}
              size="xs"
              px="xs"
            >
              <Group gap={4}>
                <Text component="span">{isLiked ? '♥' : '♡'}</Text>
                <Text component="span">{likeCount}</Text>
              </Group>
            </Button>
          </Group>

          {/* 액션 버튼 */}
          {showActions && (
            <>
              <Divider my="xs" />
              <Group gap="sm" grow>
                <Button onClick={handleEdit} variant="light" size="sm">
                  {t.common.edit}
                </Button>
                <Button onClick={handleDelete} variant="subtle" color="red" size="sm">
                  {t.common.delete}
                </Button>
              </Group>
            </>
          )}
        </Stack>
      </Card>
    </Box>
  );
}
