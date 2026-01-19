import React, { useState, useEffect, useRef } from 'react';
import { Loading, ErrorMessage } from '@/shared/ui';

interface DataListLayoutProps {
  isLoading: boolean;
  error?: any;
  isEmpty: boolean;
  emptyMessage?: string;
  filters?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export function DataListLayout({
  isLoading,
  error,
  isEmpty,
  emptyMessage = '데이터가 없습니다.',
  filters,
  children,
  className = ''
}: DataListLayoutProps) {
  const [isFilterVisible, setIsFilterVisible] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // 스크롤을 내리면 필터 숨김, 올리면 필터 표시
      if (currentScrollY > lastScrollY.current && currentScrollY > 50) {
        setIsFilterVisible(false);
      } else {
        setIsFilterVisible(true);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loading />
      </div>
    );
  }

  if (error) {
    // error 객체에서 메시지 추출 시도
    const msg = typeof error === 'string' ? error : error?.message || '오류가 발생했습니다.';
    return (
      <div className="flex justify-center items-center py-20">
         <ErrorMessage message={msg} />
      </div>
    );
  }

  return (
    <div className={`flex flex-col gap-4 ${className}`}>
      {filters && (
        <div
          className={`sticky top-0 z-10 bg-bg-page/95 backdrop-blur-sm py-2 transition-all duration-300 ${
            isFilterVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full pointer-events-none'
          }`}
        >
          {filters}
        </div>
      )}

      {children}
      {isEmpty && (
        <div className="flex flex-col items-center justify-center py-20 text-text-muted">
           <div className="text-4xl mb-2">📭</div>
           <p>{emptyMessage}</p>
        </div>
      )}
    </div>
  );
}
