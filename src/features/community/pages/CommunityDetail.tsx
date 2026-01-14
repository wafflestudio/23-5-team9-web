import React, { useState } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import { useCommunityPost, Comment } from "@/features/community/hooks/useCommunity";
import { Loading } from "@/shared/ui/StatusMessage";

function CommunityDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { post, loading, error } = useCommunityPost(id);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  React.useEffect(() => {
    if (post) {
      setIsLiked(post.isLiked);
      setLikeCount(post.likeCount);
      setComments(post.comments);
    }
  }, [post]);

  const handleLikeClick = () => {
    setIsLiked(!isLiked);
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setIsSubmitting(true);
    // Mock: 댓글 추가 시뮬레이션
    await new Promise(resolve => setTimeout(resolve, 300));

    const comment: Comment = {
      id: Date.now(),
      author: '나',
      content: newComment,
      createdAt: new Date().toISOString(),
      likeCount: 0,
      isLiked: false
    };

    setComments([...comments, comment]);
    setNewComment('');
    setIsSubmitting(false);
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

  if (loading) return <Loading />;
  if (error) return <div className="p-4 text-center text-status-error">{error}</div>;
  if (!post) return <div className="p-4 text-center">게시글 정보가 없습니다.</div>;

  return (
    <div className="max-w-[720px] mx-auto my-10 px-5">
      <button
        onClick={() => navigate(-1)}
        className="mb-5 border-none bg-transparent cursor-pointer text-xl flex items-center gap-1.5 hover:text-text-secondary transition-colors"
      >
        ← 뒤로가기
      </button>

      <section className="bg-bg-page rounded-lg">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xs text-primary bg-[#fff4e6] px-3 py-1 rounded font-bold">
            {post.category}
          </span>
        </div>

        {post.imageUrl && (
          <div className="mb-5 rounded-lg overflow-hidden">
            <img
              src={post.imageUrl}
              alt={post.title}
              className="w-full max-h-[400px] object-cover"
            />
          </div>
        )}

        <h2>{post.title}</h2>

        <div className="flex gap-2.5 mb-5 text-text-secondary text-sm items-center">
          <span>{post.author}</span>
          <span>·</span>
          <span>{post.location}</span>
          <span>·</span>
          <span>{formatTimeAgo(post.createdAt)}</span>
        </div>

        <hr className="my-5 border-0 border-t border-border-base" />

        <div className="whitespace-pre-wrap leading-relaxed mb-5">
          {post.content}
        </div>

        <div className="flex gap-5 pt-4 border-t border-border-base">
          <button
            onClick={handleLikeClick}
            className={`border-none bg-transparent cursor-pointer p-2 px-3 flex items-center gap-2 text-sm font-bold ${
              isLiked ? 'text-primary' : 'text-text-secondary'
            }`}
          >
            <span className="text-lg">{isLiked ? '♥' : '♡'}</span>
            <span>좋아요 {likeCount}</span>
          </button>
          <div className="flex items-center gap-2 text-text-secondary text-sm">
            <span>💬</span>
            <span>댓글 {comments.length}</span>
          </div>
          <div className="flex items-center gap-2 text-text-secondary text-sm">
            <span>👁️</span>
            <span>조회 {post.viewCount}</span>
          </div>
        </div>
      </section>

      {/* 댓글 섹션 */}
      <section className="mt-5">
        <h3 className="mb-5 text-lg font-bold">
          댓글 {comments.length}
        </h3>

        {/* 댓글 작성 폼 */}
        <form onSubmit={handleCommentSubmit} className="mb-6">
          <div className="flex gap-2">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="댓글을 입력하세요..."
              className="flex-1 p-3 border border-border-base rounded-md text-sm"
            />
            <button
              type="submit"
              disabled={isSubmitting || !newComment.trim()}
              className="px-6 py-3 bg-primary text-text-inverse border-none rounded-md text-sm font-bold cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? '등록 중...' : '등록'}
            </button>
          </div>
        </form>

        {/* 댓글 목록 */}
        {comments.length === 0 ? (
          <div className="text-center py-10 text-text-secondary">
            아직 댓글이 없습니다. 첫 댓글을 남겨보세요!
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {comments.map((comment) => (
              <div
                key={comment.id}
                className="p-4 bg-bg-box-alt rounded-lg"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <span className="font-bold mr-2 text-sm">
                      {comment.author}
                    </span>
                    <span className="text-text-secondary text-xs">
                      {formatTimeAgo(comment.createdAt)}
                    </span>
                  </div>
                </div>
                <div className="text-sm leading-normal text-text-primary">
                  {comment.content}
                </div>
                <div className="mt-2 flex items-center gap-3">
                  <button
                    className="border-none bg-transparent cursor-pointer p-1 px-2 flex items-center gap-1 text-text-secondary text-xs"
                  >
                    <span>♡</span>
                    <span>{comment.likeCount}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default CommunityDetail;
