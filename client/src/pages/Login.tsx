import React, { useState } from 'react';
import AuthService from '../API/AuthService';
import Input from '../components/Common/Input';
import Button from '../components/Common/Button';
import PasswordResetModal from '../components/Auth/PasswordResetModal';
import { useFetching } from '../hooks/useFetching';
import useAuthStore from '../hooks/useAuthStore';
import { AxiosError } from 'axios';
import AppInfo from '../components/Auth/AppInfo';
import { useNavigate } from 'react-router-dom';
import PasswordInput from '../components/Auth/PasswordInput';
import logo from '../../public/images/icons/logo.svg';
import CircularProgress from '@mui/joy/CircularProgress';

const Login: React.FC = () => {
  const [login, setLogin] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loginError, setLoginError] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const { setUser } = useAuthStore();
  const navigate = useNavigate();

  const [fetchLogin, isLoading, error] = useFetching(async () => {
    try {
      const response = await AuthService.login({ login, email, password });
      setUser({
        ...response.data.user,
        token: response.data.token,
        role: response.data.user.role,
      });
      setErrorMessage('');
      navigate('/posts');
    } catch (err) {
      const axiosError = err as AxiosError;

      if (axiosError.response && axiosError.response.status === 401) {
        setErrorMessage('Invalid credentials. Please try again.');
      } else if (axiosError.response && axiosError.response.status === 403) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(
          axiosError.response.data as string,
          'text/html',
        );
        const errorText = doc.querySelector('pre')?.textContent;

        if (errorText && errorText.includes('Please verify your email')) {
          setErrorMessage('Please verify your email before logging in.');
        } else {
          setErrorMessage(
            'There was an error signing you in. Please try again later.',
          );
        }
      } else {
        setErrorMessage(
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
    <div className="flex flex-col md:flex-row min-h-screen overflow-y-auto">
      <AppInfo />
      <div className="w-full md:w-1/2 flex flex-col items-center justify-center min-h-screen bg-blue-100 p-4">
        <div
          className="flex items-center cursor-pointer mb-6 text-center"
          role="button"
          tabIndex={0}
          onClick={() => navigate('/posts')}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              navigate('/posts');
            }
          }}
        >
          <h1 className="text-2xl md:text-3xl font-bold mr-2 truncate">
            Login to <span className="text-blue-600">CodeUnity</span>
          </h1>
          <img src={logo} alt="CodeUnity Logo" className="w-6 h-6 md:w-8 md:h-8" />
        </div>
        <form
          className="bg-white shadow-md rounded-lg p-6 md:p-8 w-full max-w-xs sm:max-w-sm md:max-w-md"
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
              className="w-full p-2 border border-gray-600 rounded focus:outline-none focus:ring focus:ring-gray-600"
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
              className="w-full p-2 border border-gray-600 rounded focus:outline-none focus:ring focus:ring-gray-600"
            />
            {emailError && <p className="text-red-500">{emailError}</p>}
          </div>
  
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <label htmlFor="password" className="block text-gray-700">
                Password <span className="text-red-500">*</span>
              </label>
              <Button
                className="text-blue-500 cursor-pointer text-sm"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsModalOpen(true);
                }}
              >
                Forgot password?
              </Button>
            </div>
            <PasswordInput
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              error={passwordError}
            />
          </div>
  
          {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}
          {isLoading && <CircularProgress size="sm" />}
  
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
