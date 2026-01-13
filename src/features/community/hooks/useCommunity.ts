import { useState, useEffect } from 'react';
import { LOCATIONS } from '@/features/product/hooks/useProducts';

export interface Comment {
  id: number;
  author: string;
  content: string;
  createdAt: string;
  likeCount: number;
  isLiked: boolean;
}

export interface CommunityPost {
  id: number;
  category: string;
  title: string;
  content: string;
  author: string;
  location: string;
  imageUrl: string | null;
  likeCount: number;
  commentCount: number;
  viewCount: number;
  isLiked: boolean;
  createdAt: string;
  comments: Comment[];
}

const MOCK_COMMUNITY_POSTS: CommunityPost[] = [
  {
    id: 1,
    category: '동네정보',
    title: '역삼동에 새로운 카페가 오픈했어요!',
    content: '역삼역 근처에 예쁜 카페가 생겼네요. 분위기도 좋고 커피도 맛있어요. 주말에 한번 가보세요!',
    author: '카페러버',
    location: '서울 강남구 역삼동',
    imageUrl: 'https://via.placeholder.com/400x300?text=Cafe',
    likeCount: 24,
    commentCount: 8,
    viewCount: 156,
    isLiked: false,
    createdAt: '2024-01-15T10:30:00Z',
    comments: [
      {
        id: 1,
        author: '커피마니아',
        content: '주소 알려주세요!',
        createdAt: '2024-01-15T11:00:00Z',
        likeCount: 3,
        isLiked: false
      },
      {
        id: 2,
        author: '카페러버',
        content: '역삼역 2번 출구에서 5분 거리예요!',
        createdAt: '2024-01-15T11:15:00Z',
        likeCount: 1,
        isLiked: false
      }
    ]
  },
  {
    id: 2,
    category: '동네질문',
    title: '강남구에서 반려동물 병원 추천해주세요',
    content: '강아지를 키우기 시작했는데 좋은 병원을 찾고 있어요. 역삼동이나 선릉동 근처 추천 부탁드려요!',
    author: '강아지맘',
    location: '서울 강남구 역삼동',
    imageUrl: null,
    likeCount: 12,
    commentCount: 15,
    viewCount: 89,
    isLiked: true,
    createdAt: '2024-01-14T14:20:00Z',
    comments: [
      {
        id: 3,
        author: '펫케어전문가',
        content: '선릉역 근처에 있는 XX동물병원 추천해요!',
        createdAt: '2024-01-14T15:00:00Z',
        likeCount: 5,
        isLiked: false
      }
    ]
  },
  {
    id: 3,
    category: '동네맛집',
    title: '역삼동 맛집 공유 - 파스타 맛있는 곳',
    content: '역삼동에 숨겨진 파스타 맛집 발견했어요! 가성비 최고입니다. 특히 크림파스타가 일품이에요.',
    author: '맛집탐험가',
    location: '서울 강남구 역삼동',
    imageUrl: 'https://via.placeholder.com/400x300?text=Pasta',
    likeCount: 45,
    commentCount: 12,
    viewCount: 234,
    isLiked: false,
    createdAt: '2024-01-13T18:45:00Z',
    comments: []
  },
  {
    id: 4,
    category: '동네소식',
    title: '역삼동 공원 리모델링 공지',
    content: '역삼동 공원이 다음 달부터 리모델링에 들어갑니다. 운동하시는 분들은 참고하세요!',
    author: '동네관리자',
    location: '서울 강남구 역삼동',
    imageUrl: null,
    likeCount: 8,
    commentCount: 3,
    viewCount: 67,
    isLiked: false,
    createdAt: '2024-01-12T09:00:00Z',
    comments: []
  },
  {
    id: 5,
    category: '동네질문',
    title: '역삼동 주차장 추천해주세요',
    content: '역삼역 근처에서 주차하기 좋은 곳 알려주세요. 가격도 궁금해요!',
    author: '차주인',
    location: '서울 강남구 역삼동',
    imageUrl: null,
    likeCount: 6,
    commentCount: 9,
    viewCount: 45,
    isLiked: false,
    createdAt: '2024-01-11T16:30:00Z',
    comments: []
  },
  {
    id: 6,
    category: '동네맛집',
    title: '선릉역 근처 치킨 맛집',
    content: '선릉역에서 가까운 치킨집 발견! 양념치킨이 정말 맛있어요. 배달도 빠르고요.',
    author: '치킨러버',
    location: '서울 강남구 선릉동',
    imageUrl: 'https://via.placeholder.com/400x300?text=Chicken',
    likeCount: 32,
    commentCount: 7,
    viewCount: 178,
    isLiked: true,
    createdAt: '2024-01-10T20:15:00Z',
    comments: []
  },
  {
    id: 7,
    category: '동네정보',
    title: '역삼동 도서관 새 책 입고',
    content: '역삼동 도서관에 신간 도서가 많이 들어왔어요. 이번 주말에 한번 가보세요!',
    author: '책벌레',
    location: '서울 강남구 역삼동',
    imageUrl: null,
    likeCount: 15,
    commentCount: 4,
    viewCount: 92,
    isLiked: false,
    createdAt: '2024-01-09T11:20:00Z',
    comments: []
  },
  {
    id: 8,
    category: '동네소식',
    title: '역삼동 마을 축제 안내',
    content: '다음 달 첫째 주 토요일에 역삼동 마을 축제가 열립니다. 많은 참여 부탁드려요!',
    author: '마을회장',
    location: '서울 강남구 역삼동',
    imageUrl: 'https://via.placeholder.com/400x300?text=Festival',
    likeCount: 28,
    commentCount: 11,
    viewCount: 201,
    isLiked: false,
    createdAt: '2024-01-08T13:45:00Z',
    comments: []
  },
  // 반포동 게시글들
  {
    id: 9,
    category: '동네정보',
    title: '반포동 한강공원 야경 추천',
    content: '반포한강공원 야경이 정말 예뻐요! 저녁에 산책하기 좋은 곳입니다.',
    author: '야경러버',
    location: '서울 서초구 반포동',
    imageUrl: 'https://via.placeholder.com/400x300?text=NightView',
    likeCount: 35,
    commentCount: 6,
    viewCount: 189,
    isLiked: false,
    createdAt: '2024-01-16T19:00:00Z',
    comments: []
  },
  {
    id: 10,
    category: '동네질문',
    title: '반포동 헬스장 추천해주세요',
    content: '반포동 근처에 좋은 헬스장 있나요? 가격도 궁금해요!',
    author: '운동하는사람',
    location: '서울 서초구 반포동',
    imageUrl: null,
    likeCount: 8,
    commentCount: 12,
    viewCount: 67,
    isLiked: false,
    createdAt: '2024-01-15T08:30:00Z',
    comments: []
  },
  // 잠실동 게시글들
  {
    id: 11,
    category: '동네맛집',
    title: '잠실 롯데월드 근처 맛집',
    content: '롯데월드 근처에 맛있는 식당 발견했어요! 가족들이랑 가기 좋아요.',
    author: '맛집탐험가',
    location: '서울 송파구 잠실동',
    imageUrl: 'https://via.placeholder.com/400x300?text=Restaurant',
    likeCount: 22,
    commentCount: 9,
    viewCount: 145,
    isLiked: true,
    createdAt: '2024-01-14T12:15:00Z',
    comments: []
  },
  {
    id: 12,
    category: '동네소식',
    title: '잠실동 도서관 프로그램 안내',
    content: '잠실동 도서관에서 이번 달 독서 프로그램이 열립니다. 많은 참여 부탁드려요!',
    author: '도서관관리자',
    location: '서울 송파구 잠실동',
    imageUrl: null,
    likeCount: 15,
    commentCount: 4,
    viewCount: 98,
    isLiked: false,
    createdAt: '2024-01-13T10:00:00Z',
    comments: []
  },
  // 신림동 게시글들
  {
    id: 13,
    category: '동네정보',
    title: '신림동 벚꽃 명소',
    content: '신림동에 벚꽃이 예쁘게 피었어요! 사진 찍기 좋은 곳입니다.',
    author: '사진작가',
    location: '서울 관악구 신림동',
    imageUrl: 'https://via.placeholder.com/400x300?text=CherryBlossom',
    likeCount: 42,
    commentCount: 18,
    viewCount: 256,
    isLiked: false,
    createdAt: '2024-01-17T14:20:00Z',
    comments: []
  },
  {
    id: 14,
    category: '동네질문',
    title: '신림동 카페 추천 부탁드려요',
    content: '신림동에 조용한 카페 있나요? 공부하기 좋은 곳 찾고 있어요.',
    author: '공부하는학생',
    location: '서울 관악구 신림동',
    imageUrl: null,
    likeCount: 11,
    commentCount: 7,
    viewCount: 78,
    isLiked: false,
    createdAt: '2024-01-16T09:45:00Z',
    comments: []
  },
  // 선릉동 게시글들 (추가)
  {
    id: 15,
    category: '동네정보',
    title: '선릉동 공원 산책로 정비 완료',
    content: '선릉동 공원 산책로가 새롭게 정비되었어요. 산책하기 좋아졌습니다!',
    author: '산책러버',
    location: '서울 강남구 선릉동',
    imageUrl: 'https://via.placeholder.com/400x300?text=Park',
    likeCount: 19,
    commentCount: 5,
    viewCount: 112,
    isLiked: false,
    createdAt: '2024-01-15T16:30:00Z',
    comments: []
  },
  // 청담동 게시글들
  {
    id: 16,
    category: '동네맛집',
    title: '청담동 브런치 카페',
    content: '청담동에 예쁜 브런치 카페가 생겼어요! 분위기 최고입니다.',
    author: '브런치러버',
    location: '서울 강남구 청담동',
    imageUrl: 'https://via.placeholder.com/400x300?text=Brunch',
    likeCount: 38,
    commentCount: 14,
    viewCount: 203,
    isLiked: true,
    createdAt: '2024-01-18T11:00:00Z',
    comments: []
  },
  {
    id: 17,
    category: '동네질문',
    title: '청담동 미용실 추천',
    content: '청담동에 좋은 미용실 있나요? 커트 잘하는 곳 추천 부탁드려요!',
    author: '헤어스타일러',
    location: '서울 강남구 청담동',
    imageUrl: null,
    likeCount: 9,
    commentCount: 11,
    viewCount: 89,
    isLiked: false,
    createdAt: '2024-01-17T15:20:00Z',
    comments: []
  },
  // 압구정동 게시글들
  {
    id: 18,
    category: '동네정보',
    title: '압구정동 로데오거리 축제',
    content: '압구정 로데오거리에서 축제가 열려요! 많은 분들 오세요!',
    author: '축제기획자',
    location: '서울 강남구 압구정동',
    imageUrl: 'https://via.placeholder.com/400x300?text=Festival2',
    likeCount: 31,
    commentCount: 8,
    viewCount: 167,
    isLiked: false,
    createdAt: '2024-01-19T10:15:00Z',
    comments: []
  },
  {
    id: 19,
    category: '동네맛집',
    title: '압구정동 파인다이닝 레스토랑',
    content: '압구정동에 새로 오픈한 파인다이닝 레스토랑 가봤어요. 분위기와 맛 모두 최고!',
    author: '미식가',
    location: '서울 강남구 압구정동',
    imageUrl: 'https://via.placeholder.com/400x300?text=FineDining',
    likeCount: 27,
    commentCount: 6,
    viewCount: 134,
    isLiked: false,
    createdAt: '2024-01-18T18:30:00Z',
    comments: []
  }
];

export const COMMUNITY_CATEGORIES = [
  { value: 'all', label: '전체' },
  { value: '동네정보', label: '동네정보' },
  { value: '동네질문', label: '동네질문' },
  { value: '동네맛집', label: '동네맛집' },
  { value: '동네소식', label: '동네소식' }
];

export { LOCATIONS };

export function useCommunity(category?: string, selectedLocation?: string) {
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 500));
        
        let filteredPosts = [...MOCK_COMMUNITY_POSTS];
        
        // 카테고리 필터링
        if (category && category !== 'all') {
          filteredPosts = filteredPosts.filter(post => post.category === category);
        }
        
        // 지역 필터링
        if (selectedLocation && selectedLocation !== 'all') {
          filteredPosts = filteredPosts.filter(post => 
            post.location.includes(selectedLocation)
          );
        }
        
        // 최신순 정렬
        filteredPosts.sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        
        setPosts(filteredPosts);
      } catch (err) {
        setError('게시글 목록을 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [category, selectedLocation]);

  return { posts, loading, error };
}

export function useCommunityPost(id: string | undefined) {
  const [post, setPost] = useState<CommunityPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 500));
        if (!id) throw new Error('Invalid ID');
        const found = MOCK_COMMUNITY_POSTS.find(p => p.id === parseInt(id));
        if (!found) throw new Error('Post not found');
        setPost(found);
      } catch (err) {
        setError('게시글을 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  return { post, loading, error };
}

