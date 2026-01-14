import PasswordInput from '@/shared/ui/PasswordInput';

const PasswordTab = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('비밀번호가 변경되었습니다.');
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <PasswordInput label="현재 비밀번호" />
      <PasswordInput label="새 비밀번호" />
      <PasswordInput label="새 비밀번호 확인" />
      <button type="submit" className="w-full mt-2.5 h-12 bg-primary text-text-inverse font-bold rounded-md hover:bg-primary-hover transition-colors">비밀번호 변경</button>
    </form>
  );
};
export default PasswordTab;
