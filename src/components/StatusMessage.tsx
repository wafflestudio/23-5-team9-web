export const Loading = () => <div className="loading">로딩 중...</div>;

export const ErrorMessage = ({ message }: { message: string }) => <div className="error">{message}</div>;

export const EmptyState = ({ message }: { message: string }) => (
  <div className="no-results">{message}</div>
);
