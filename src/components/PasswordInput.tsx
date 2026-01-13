import { useState } from 'react';

interface PasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  wrapperClassName?: string;
}

const PasswordInput = ({ label, wrapperClassName = "", className = "form-input password-input", ...props }: PasswordInputProps) => {
  const [show, setShow] = useState(false);
  return (
    <div>
      {label && <label className="form-label">{label}</label>}
      <div className={`password-input-wrapper ${wrapperClassName}`}>
        <input className={className} type={show ? "text" : "password"} {...props} />
        <button type="button" onClick={() => setShow(!show)} className="password-toggle-button">
          {show ? '숨기기' : '보기'}
        </button>
      </div>
    </div>
  );
};
export default PasswordInput;
