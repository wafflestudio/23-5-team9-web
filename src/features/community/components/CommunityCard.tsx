import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CommunityPost } from '../hooks/useCommunity';
import { Button } from '@/shared/ui/Button';
import { Card, CardImage, CardContent, CardTitle, CardMeta } from '@/shared/ui/Card';
import Badge from '@/shared/ui/Badge';
import { Stat, StatGroup } from '@/shared/ui/Stat';

interface CommunityCardProps {
  post: CommunityPost;
}

function CommunityCard({ post }: CommunityCardProps) {
  const [isLiked, setIsLiked] = useState(post.isLiked);
  const [likeCount, setLikeCount] = useState(post.likeCount);
  const postDetailUrl = `/community/${post.id}`;

  const handleLikeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setIsLiked(!isLiked);
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
  };

  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const postDate = new Date(dateString);
    const diffInSeconds = Math.floor((now.getTime() - postDate.getTime()) / 1000);

    if (diffInSeconds < 60) return '방금 전';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}분 전`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}시간 전`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}일 전`;
    return postDate.toLocaleDateString('ko-KR');
  };

  return (
    <Link to={postDetailUrl} className="group text-inherit no-underline">
      <Card>
        <CardImage src={post.imageUrl} alt={post.title} aspectRatio="square" />
        <CardContent>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="primary" className="text-xs">
              {post.category}
            </Badge>
          </div>
          <CardTitle className="tracking-tighter break-keep">
            {post.title}
          </CardTitle>
          <CardMeta className="mb-1 flex items-center">
            <span>{post.location}</span>
            <span className="mx-1">·</span>
            <span>{formatTimeAgo(post.createdAt)}</span>
          </CardMeta>
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
            <Stat icon="💬" label="댓글" value={post.commentCount} />
            <Stat icon="👁️" label="조회" value={post.viewCount} />
          </StatGroup>
        </CardContent>
      </Card>
    </Link>
  );
}

export default CommunityCard;
