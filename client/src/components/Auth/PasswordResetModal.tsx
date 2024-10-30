import React, { useState } from 'react';
import Modal from '../Modal/Modal';
import Button from '../Common/Button';
import Input from '../Common/Input';
import PostAuth from '../../API/AuthService';
import { useFetching } from '../../hooks/useFetching';

interface PasswordResetModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PasswordResetModal: React.FC<PasswordResetModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const [sendResetRequest, isLoading] = useFetching(async (email: string) => {
    await PostAuth.forgotPassword({ email });
  });

  const validateInputs = () => {
    let isValid = true;

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Please enter a valid email address.');
      isValid = false;
    } else {
      setEmailError('');
    }

    return isValid;
  };

  const handleSubmit = async () => {
    if (validateInputs()) {
      try {
        await sendResetRequest(email);
        setSuccessMessage('Reset link sent! Please check your email.');
        setEmail('');
        setErrorMessage('');
      } catch (err: unknown) {
        if (
          err instanceof Error &&
          (err as { response?: { status?: number } }).response?.status === 400
        ) {
          setErrorMessage(
            'Please check your email for the password reset link.',
          );
        } else if (
          err instanceof Error &&
          (err as { response?: { status?: number } }).response?.status === 404
        ) {
          setErrorMessage(
            'No account found with that email address. Please check and try again.',
          );
        } else {
          setErrorMessage('Failed to send reset link. Please try again later.');
        }
        setSuccessMessage('');
      }
    }
  };

  const handleClose = () => {
    setEmail('');
    setEmailError('');
    setSuccessMessage('');
    setErrorMessage('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <h2 className="text-xl font-semibold mb-4">Reset Password</h2>
      <p className="text-sm mb-4">
        Please enter your email to receive a password reset link.
      </p>
      <Input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded mb-2 focus:outline-none focus:ring focus:ring-blue-300"
      />
      {emailError && <p className="text-red-500 text-sm mb-2">{emailError}</p>}
      {successMessage && (
        <p className="text-green-500 text-sm mb-2">{successMessage}</p>
      )}
      {errorMessage && (
        <p className="text-red-500 text-sm mb-2">{errorMessage}</p>
      )}
      <div className="flex justify-end space-x-2">
        <Button
          className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300"
          onClick={handleClose}
        >
          Cancel
        </Button>
        <Button
          className={`bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          onClick={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? 'Sending...' : 'Submit'}
        </Button>
      </div>
    </Modal>
  );
};

export default PasswordResetModal;
