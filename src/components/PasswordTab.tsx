import PasswordInput from './PasswordInput';

const PasswordTab = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('비밀번호가 변경되었습니다.');
  };

  return (
    <form onSubmit={handleSubmit} className="password-form">
      <PasswordInput label="현재 비밀번호" />
      <PasswordInput label="새 비밀번호" />
      <PasswordInput label="새 비밀번호 확인" />
      <button type="submit" className="button submit-button">비밀번호 변경</button>
    </form>
  );
};
export default PasswordTab;
