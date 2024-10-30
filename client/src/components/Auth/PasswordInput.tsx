import React, { useState } from 'react';
import Input from '../Common/Input';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';

interface PasswordInputProps {
  id: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  error?: string;
}

const PasswordInput: React.FC<PasswordInputProps> = ({
  id,
  value,
  onChange,
  placeholder = '',
  error = '',
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative mb-4">
      <Input
        id={id}
        type={showPassword ? 'text' : 'password'}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-300"
      />
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute top-1/2 right-3 transform -translate-y-1/2 text-blue-500 hover:text-blue-700 focus:outline-none"
      >
        {showPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
      </button>
      {error && <p className="text-red-500 mt-1">{error}</p>}
    </div>
  );
};

export default PasswordInput;
