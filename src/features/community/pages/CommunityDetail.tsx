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
  if (error) return <div className="p-4 text-center text-red-500">{error}</div>;
  if (!post) return <div className="p-4 text-center">게시글 정보가 없습니다.</div>;

  return (
    <div className="max-w-[720px] mx-auto my-10 px-5">
      <button 
        onClick={() => navigate(-1)} 
        className="mb-5 border-none bg-none cursor-pointer text-xl flex items-center gap-1.5 hover:text-gray-600 transition-colors"
      >
        ← 뒤로가기
      </button>
      
      <section className="bg-white rounded-lg">
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
              style={{ width: '100%', maxHeight: '400px', objectFit: 'cover' }} 
            />
          </div>
        )}
        
        <h2>{post.title}</h2>
        
        <div style={{ 
          display: 'flex', 
          gap: '10px', 
          marginBottom: '20px', 
          color: '#868e96', 
          fontSize: '0.9rem',
          alignItems: 'center'
        }}>
          <span>{post.author}</span>
          <span>·</span>
          <span>{post.location}</span>
          <span>·</span>
          <span>{formatTimeAgo(post.createdAt)}</span>
        </div>

        <hr style={{ margin: '20px 0', border: '0', borderTop: '1px solid #e9ecef' }} />
        
        <div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6', marginBottom: '20px' }}>
          {post.content}
        </div>

        <div style={{ 
          display: 'flex', 
          gap: '20px', 
          paddingTop: '16px', 
          borderTop: '1px solid #e9ecef' 
        }}>
          <button
            onClick={handleLikeClick}
            style={{
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              padding: '8px 12px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: isLiked ? '#ff6f0f' : '#868e96',
              fontSize: '14px',
              fontWeight: 'bold'
            }}
          >
            <span style={{ fontSize: '18px' }}>{isLiked ? '♥' : '♡'}</span>
            <span>좋아요 {likeCount}</span>
          </button>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px', 
            color: '#868e96', 
            fontSize: '14px' 
          }}>
            <span>💬</span>
            <span>댓글 {comments.length}</span>
          </div>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px', 
            color: '#868e96', 
            fontSize: '14px' 
          }}>
            <span>👁️</span>
            <span>조회 {post.viewCount}</span>
          </div>
        </div>
      </section>

      {/* 댓글 섹션 */}
      <section className="card" style={{ marginTop: '20px' }}>
        <h3 style={{ marginBottom: '20px', fontSize: '18px', fontWeight: 'bold' }}>
          댓글 {comments.length}
        </h3>

        {/* 댓글 작성 폼 */}
        <form onSubmit={handleCommentSubmit} style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="댓글을 입력하세요..."
              style={{
                flex: 1,
                padding: '12px',
                border: '1px solid #e9ecef',
                borderRadius: '6px',
                fontSize: '14px'
              }}
            />
            <button
              type="submit"
              disabled={isSubmitting || !newComment.trim()}
              style={{
                padding: '12px 24px',
                backgroundColor: '#ff6f0f',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: 'bold',
                cursor: isSubmitting || !newComment.trim() ? 'not-allowed' : 'pointer',
                opacity: isSubmitting || !newComment.trim() ? 0.5 : 1
              }}
            >
              {isSubmitting ? '등록 중...' : '등록'}
            </button>
          </div>
        </form>

        {/* 댓글 목록 */}
        {comments.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '40px 0', 
            color: '#868e96' 
          }}>
            아직 댓글이 없습니다. 첫 댓글을 남겨보세요!
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {comments.map((comment) => (
              <div 
                key={comment.id}
                style={{
                  padding: '16px',
                  backgroundColor: '#f8f9fa',
                  borderRadius: '8px'
                }}
              >
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'flex-start',
                  marginBottom: '8px'
                }}>
                  <div>
                    <span style={{ 
                      fontWeight: 'bold', 
                      marginRight: '8px',
                      fontSize: '14px'
                    }}>
                      {comment.author}
                    </span>
                    <span style={{ 
                      color: '#868e96', 
                      fontSize: '12px' 
                    }}>
                      {formatTimeAgo(comment.createdAt)}
                    </span>
                  </div>
                </div>
                <div style={{ 
                  fontSize: '14px', 
                  lineHeight: '1.5',
                  color: '#212529'
                }}>
                  {comment.content}
                </div>
                <div style={{ 
                  marginTop: '8px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '12px' 
                }}>
                  <button
                    style={{
                      border: 'none',
                      background: 'none',
                      cursor: 'pointer',
                      padding: '4px 8px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      color: '#868e96',
                      fontSize: '12px'
                    }}
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

