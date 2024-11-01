import React, { useState } from 'react';
import AuthService from '../API/AuthService';
import PasswordInput from '../components/Auth/PasswordInput';
import Button from '../components/Common/Button';
import { useNavigate, useParams } from 'react-router-dom';
import { useFetching } from '../hooks/useFetching';
import { AxiosError } from 'axios';

const NewPass: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const validateInputs = () => {
    let isValid = true;
    setErrorMessage('');

    if (!newPassword || newPassword.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      isValid = false;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      isValid = false;
    }

    return isValid;
  };

  const [fetching, isLoading] = useFetching(async () => {
    if (token) {
      await AuthService.resetPassword({
        new_password: newPassword,
        confirm_password: confirmPassword,
        token,
      });
    } else {
      throw new Error('Invalid token. Please try again.');
    }
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (validateInputs()) {
      try {
        await fetching();
        setSuccessMessage(
          'Password has been reset successfully! You can now log in.',
        );
        setTimeout(() => navigate('/login'), 3000);
      } catch (err) {
        const axiosError = err as AxiosError;

        if (axiosError.response && axiosError.response.status === 400) {
          const parser = new DOMParser();
          const doc = parser.parseFromString(
            axiosError.response.data as string,
            'text/html',
          );
          const errorText = doc.querySelector('pre')?.textContent;

          if (errorText && errorText.includes('Invalid password reset token')) {
            setErrorMessage(
              'The password reset link is invalid or expired. Please return to the login page and request a new link.',
            );
          } else {
            setErrorMessage(
              'There was an error resetting your password. Please try again.',
            );
          }
        } else {
          setErrorMessage(
            'There was an error resetting your password. Please try again.',
          );
        }
      }
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6">Reset Password</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="newPassword" className="block text-gray-700 mb-2">
              New Password <span className="text-red-500">*</span>
            </label>
            <PasswordInput
              id="newPassword"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="confirmPassword"
              className="block text-gray-700 mb-2"
            >
              Confirm Password <span className="text-red-500">*</span>
            </label>
            <PasswordInput
              id="confirmPassword"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}
          {successMessage && (
            <p className="text-green-500 mb-4">{successMessage}</p>
          )}
          <Button
            className="w-full bg-blue-500 text-white font-semibold py-2 rounded hover:bg-blue-600 transition duration-200"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? 'Resetting...' : 'Reset Password'}
          </Button>
        </form>
        <Button
          className="w-full mt-4 bg-gray-300 text-gray-700 font-semibold py-2 rounded hover:bg-gray-400 transition duration-200"
          onClick={() => navigate('/login')}
        >
          Back to Login
        </Button>
      </div>
    </div>
  );
};

export default NewPass;
