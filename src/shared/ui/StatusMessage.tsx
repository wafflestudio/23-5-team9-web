export const Loading = () => (
  <div className="flex flex-col items-center justify-center py-10 w-full">
    <div className="w-8 h-8 border-4 border-gray-200 border-t-orange-500 rounded-full animate-spin mb-3"></div>
    <div className="text-gray-500 text-sm font-medium">로딩 중...</div>
  </div>
);

export const ErrorMessage = ({ message }: { message: string }) => <div className="error">{message}</div>;

export const EmptyState = ({ message }: { message: string }) => (
  <div className="no-results">{message}</div>
);
