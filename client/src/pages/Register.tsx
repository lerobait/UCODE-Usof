import React, { useState } from 'react';
import AuthService from '../API/AuthService';
import Input from '../components/Common/Input';
import Button from '../components/Common/Button';
import AppInfo from '../components/Auth/AppInfo';
import { useFetching } from '../hooks/useFetching';
import { AxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';
import PasswordInput from '../components/Auth/PasswordInput';
import logo from '../../public/images/icons/logo.svg';
import CircularProgress from '@mui/joy/CircularProgress';

const Register: React.FC = () => {
  const [fullName, setFullName] = useState('');
  const [login, setLogin] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const navigate = useNavigate();

  const [fetchRegister, isLoading] = useFetching(async () => {
    try {
      if (validateInputs()) {
        const response = await AuthService.register({
          full_name: fullName,
          login,
          email,
          password,
          password_confirm: passwordConfirm,
        });
        setSuccessMessage(response.data.message);
        setErrorMessage('');
        console.log('Registration successful:', response.data);
      }
    } catch (err) {
      const axiosError = err as AxiosError;

      if (axiosError.response && axiosError.response.status === 400) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(
          axiosError.response.data as string,
          'text/html',
        );
        const errorText =
          doc.querySelector('pre')?.textContent ||
          'Registration failed. Please check your details.';

        if (errorText.includes('login')) {
          setErrorMessage('A user with this login already exists.');
        } else if (errorText.includes('email')) {
          setErrorMessage('A user with this email already exists.');
        } else {
          setErrorMessage('Registration failed. Please check your details.');
        }

        setSuccessMessage('');
      }
    }
  });

  const validateInputs = () => {
    const validationErrors: { [key: string]: string } = {};
    let isValid = true;

    if (!fullName) {
      validationErrors.fullName = 'Please enter your full name.';
      isValid = false;
    }

    if (!login) {
      validationErrors.login = 'Please enter your login.';
      isValid = false;
    }

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      validationErrors.email = 'Please enter a valid email address.';
      isValid = false;
    }

    if (!password || password.length < 6) {
      validationErrors.password =
        'Password must be at least 6 characters long.';
      isValid = false;
    }

    if (password !== passwordConfirm) {
      validationErrors.passwordConfirm = 'Passwords do not match.';
      isValid = false;
    }

    setErrors(validationErrors);
    return isValid;
  };

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await fetchRegister();
  };

  return (
    <div className="flex min-h-screen">
      <AppInfo />
      <div className="w-1/2 flex flex-col items-center justify-center p-8 bg-blue-100">
        <div
          className="flex items-center cursor-pointer mb-6"
          role="button"
          tabIndex={0}
          onClick={() => navigate('/posts')}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              navigate('/posts');
            }
          }}
        >
          <h1 className="text-3xl font-bold mr-2">
            Login to <span className="text-blue-600">CodeUnity</span>
          </h1>
          <img src={logo} alt="CodeUnity Logo" className="w-8 h-8" />
        </div>
        <form
          className="bg-white shadow-md rounded-lg p-8 w-full max-w-md"
          onSubmit={handleRegister}
        >
          <div className="mb-4">
            <label htmlFor="fullName" className="block text-gray-700 mb-2">
              Full Name <span className="text-red-500">*</span>
            </label>
            <Input
              id="fullName"
              type="text"
              placeholder="Enter full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full p-2 border border-gray-600 rounded focus:outline-none focus:ring focus:ring-gray-600"
            />
            {errors.fullName && (
              <p className="text-red-500">{errors.fullName}</p>
            )}
          </div>

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
            {errors.login && <p className="text-red-500">{errors.login}</p>}
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
            {errors.email && <p className="text-red-500">{errors.email}</p>}
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-700 mb-2">
              Password <span className="text-red-500">*</span>
            </label>
            <PasswordInput
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              error={errors.password}
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="passwordConfirm"
              className="block text-gray-700 mb-2"
            >
              Confirm Password <span className="text-red-500">*</span>
            </label>
            <PasswordInput
              id="passwordConfirm"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              placeholder="Confirm password"
              error={errors.passwordConfirm}
            />
          </div>

          {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}
          {successMessage && (
            <p className="text-green-500 mb-4">{successMessage}</p>
          )}
          {isLoading && <CircularProgress size="sm" />}

          <Button
            className="w-full bg-blue-500 text-white font-semibold py-2 rounded hover:bg-blue-600 transition duration-200"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? 'Signing up...' : 'Sign up'}
          </Button>

          <div className="mt-4 text-center">
            <span className="text-gray-700">Already have an account? </span>
            <Button
              className="text-blue-500 cursor-pointer"
              onClick={() => navigate('/login')}
            >
              Log in
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
