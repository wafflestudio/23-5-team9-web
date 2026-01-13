import { useState } from 'react';

interface PasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  wrapperClassName?: string;
  toggleButtonClassName?: string;
}

const PasswordInput = ({ 
  label, 
  wrapperClassName = "", 
  className, 
  toggleButtonClassName = "absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-[13px] font-bold cursor-pointer hover:text-gray-700",
  ...props 
}: PasswordInputProps) => {
  const [show, setShow] = useState(false);

  // Default styling if no className is provided
  const defaultClassName = "w-full border border-gray-300 rounded-md p-3 outline-none focus:border-primary transition-colors pr-[50px]";
  
  const finalInputClassName = className || defaultClassName;

  return (
    <div className="w-full">
      {label && <label className="block font-bold mb-2 text-sm text-gray-700">{label}</label>}
      <div className={`relative ${wrapperClassName}`}>
        <input 
          className={finalInputClassName} 
          type={show ? "text" : "password"} 
          autoComplete="off"
          {...props} 
        />
        <button 
          type="button" 
          onClick={() => setShow(!show)} 
          className={toggleButtonClassName}
          tabIndex={-1} 
        >
          {show ? '숨기기' : '보기'}
        </button>
      </div>
    </div>
  );
};
export default PasswordInput;
