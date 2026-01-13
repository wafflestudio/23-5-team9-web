import React from 'react';
import { Loading, ErrorMessage } from '@/shared/ui/StatusMessage';

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
        <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm py-2">
          {filters}
        </div>
      )}
      
      {isEmpty ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
           <div className="text-4xl mb-2">📭</div>
           <p>{emptyMessage}</p>
        </div>
      ) : (
        children
      )}
    </div>
  );
}
