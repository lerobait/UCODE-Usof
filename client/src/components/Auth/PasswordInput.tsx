import React, { useState } from 'react';
import Input from '../Common/Input';
import Button from '../Common/Button';
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
    <div className="mb-4">
      <div className="relative flex items-center max-w-md w-full">
        <Input
          id={id}
          type={showPassword ? 'text' : 'password'}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="w-full p-2 border border-gray-600 rounded focus:outline-none focus:ring focus:ring-gray-600"
        />
        <Button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-2 p-2 text-blue-500 hover:text-blue-700 focus:outline-none"
          style={{ top: '50%', transform: 'translateY(-50%)' }}
        >
          {showPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
        </Button>
      </div>
      {error && <p className="text-red-500 mt-1">{error}</p>}
    </div>
  );
};

export default PasswordInput;
