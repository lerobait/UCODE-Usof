import React, { useState } from 'react';
import AuthService from '../API/AuthService';
import Input from '../components/Common/Input';
import Button from '../components/Common/Button';
import PasswordResetModal from '../components/Auth/PasswordResetModal';
import { useFetching } from '../hooks/useFetching';
import useAuthStore from '../hooks/useAuthStore';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
import { AxiosError } from 'axios';
import AppInfo from '../components/Auth/AppInfo';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const [login, setLogin] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loginError, setLoginError] = useState('');

  const setUser = useAuthStore((state) => state.setUser);
  const navigate = useNavigate();

  const [fetchLogin, isLoading, error] = useFetching(async () => {
    try {
      const response = await AuthService.login({ login, email, password });
      console.log('Login successful:', response.data);
      setUser(response.data.user);
    } catch (err) {
      const axiosError = err as AxiosError;

      if (axiosError.response && axiosError.response.status === 401) {
        throw new Error('Invalid credentials. Please try again.');
      } else {
        throw new Error(
          'There was an error signing you in. Please try again later.',
        );
      }
    }
  });

  const validateInputs = () => {
    let isValid = true;

    setEmailError('');
    setPasswordError('');
    setLoginError('');

    if (!login) {
      setLoginError('Please enter your login.');
      isValid = false;
    }

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Please enter a valid email address.');
      isValid = false;
    }

    if (!password || password.length < 6) {
      setPasswordError('Password must be at least 6 characters long.');
      isValid = false;
    }

    return isValid;
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (validateInputs()) {
      await fetchLogin();
    }
  };

  return (
    <div className="flex min-h-screen">
      <AppInfo />
      <div className="w-1/2 flex flex-col items-center justify-center p-8 bg-white">
        <h1 className="text-3xl font-bold mb-6">Login to CodeUnity</h1>
        <form
          className="bg-white shadow-md rounded-lg p-8 w-full max-w-md"
          onSubmit={handleLogin}
        >
          <div className="mb-4">
            <label htmlFor="login" className="block text-gray-700 mb-2">
              Login <span className="text-red-500">*</span>
            </label>
            <Input
              id="login"
              type="text"
              placeholder="Enter login"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-300"
            />
            {loginError && <p className="text-red-500">{loginError}</p>}
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 mb-2">
              Email <span className="text-red-500">*</span>
            </label>
            <Input
              id="email"
              type="text"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-300"
            />
            {emailError && <p className="text-red-500">{emailError}</p>}
          </div>

          <div className="mb-6 relative">
            <div className="relative flex justify-between items-center">
              <label htmlFor="password" className="block text-gray-700 mb-2">
                Password <span className="text-red-500">*</span>
              </label>
              <Button
                className="text-blue-500 cursor-pointer"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsModalOpen(true);
                }}
              >
                Forgot password?
              </Button>
            </div>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-300"
              />
              <Button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-1/2 right-3 transform -translate-y-1/2 text-blue-500 hover:text-blue-700 focus:outline-none"
              >
                {showPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
              </Button>
            </div>
            {passwordError && <p className="text-red-500">{passwordError}</p>}
          </div>

          {error && <p className="text-red-500 mb-4">{error}</p>}
          {isLoading && <p className="text-blue-500 mb-4">Loading...</p>}

          <Button
            className="w-full bg-blue-500 text-white font-semibold py-2 rounded hover:bg-blue-600 transition duration-200"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </Button>

          <div className="mt-4 text-center">
            <span className="text-gray-700">Don&apos;t have an account? </span>
            <Button
              className="text-blue-500 cursor-pointer"
              onClick={() => navigate('/register')}
            >
              Sign up
            </Button>
          </div>
        </form>
        <PasswordResetModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      </div>
    </div>
  );
};

export default Login;
