import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CommunityPost } from '../hooks/useCommunity';

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
    <Link to={postDetailUrl} className="flex flex-col text-inherit transition-transform duration-200 hover:-translate-y-1">
      <div className="relative w-full pt-[100%] rounded-xl overflow-hidden bg-bg-box mb-3 border border-black/5">
        {post.imageUrl ? (
          <img
            src={post.imageUrl}
            alt={post.title}
            className="absolute top-0 left-0 w-full h-full object-cover transition-transform duration-300"
          />
        ) : (
          <div className="absolute top-0 left-0 w-full h-full bg-bg-box flex items-center justify-center text-text-muted">
             {/* Placeholder content if needed */}
          </div>
        )}
      </div>
      <div className="px-0.5">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs text-primary bg-[#fff4e6] px-2 py-0.5 rounded font-bold">
            {post.category}
          </span>
        </div>
        <h3 className="text-base font-medium mb-1.5 leading-normal text-text-heading tracking-tighter truncate line-clamp-2 break-keep">
            {post.title}
        </h3>
        <div className="text-[13px] text-text-secondary mb-1 flex items-center">
          <span className="text-text-secondary">{post.location}</span>
          <span className="mx-1">·</span>
          <span className="text-text-secondary">{formatTimeAgo(post.createdAt)}</span>
        </div>
        <div className="mt-auto pt-2.5 flex gap-3 items-center">
          <button
            onClick={handleLikeClick}
            className={`border-none bg-none cursor-pointer p-1 flex items-center gap-1 text-[13px] ${isLiked ? 'text-primary' : 'text-text-muted'}`}
          >
            <span>{isLiked ? '♥' : '♡'}</span>
            <span>{likeCount}</span>
          </button>
          <span className="text-text-muted text-[13px]">
            💬 {post.commentCount}
          </span>
          <span className="text-text-muted text-[13px]">
            👁️ {post.viewCount}
          </span>
        </div>
      </div>
    </Link>
  );
}

export default CommunityCard;

