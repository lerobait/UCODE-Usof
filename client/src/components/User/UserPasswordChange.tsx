import React, { useState } from 'react';
import PasswordInput from '../Auth/PasswordInput';
import UserService from '../../API/UserService';
import Button from '../Common/Button';

interface UserPasswordChangeProps {
  onPasswordChanged?: () => void;
}

const UserPasswordChange: React.FC<UserPasswordChangeProps> = ({
  onPasswordChanged,
}) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChangePassword = async () => {
    setError(null);
    setSuccessMessage(null);

    if (!currentPassword || !newPassword || !passwordConfirmation) {
      setError('All fields are required');
      return;
    }

    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters long');
      return;
    }

    if (newPassword !== passwordConfirmation) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      await UserService.updateMyPassword({
        currentPassword,
        newPassword,
        passwordConfirmation,
      });
      setSuccessMessage('Password changed successfully');
      if (onPasswordChanged) onPasswordChanged();
    } catch (err) {
      if (
        err instanceof Error &&
        (err as { response?: { data?: { message?: string } } }).response?.data
          ?.message
      ) {
        setError(
          (err as unknown as { response: { data: { message: string } } })
            .response.data.message,
        );
      } else {
        setError('Provide correct current password');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-3 bg-blue-100 shadow-lg rounded-lg">
      <div className="mb-4">
        <label htmlFor="currentPassword" className="block font-semibold mb-1">
          Current Password
        </label>
        <PasswordInput
          id="currentPassword"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          placeholder="Enter your current password"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="newPassword" className="block font-semibold mb-1">
          New Password
        </label>
        <PasswordInput
          id="newPassword"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="Enter your new password"
        />
      </div>

      <div className="mb-4">
        <label
          htmlFor="passwordConfirmation"
          className="block font-semibold mb-1"
        >
          Password Confirm
        </label>
        <PasswordInput
          id="passwordConfirmation"
          value={passwordConfirmation}
          onChange={(e) => setPasswordConfirmation(e.target.value)}
          placeholder="Confirm your new password"
        />
      </div>

      {error && <p className="text-red-500 mb-2">{error}</p>}
      {successMessage && (
        <p className="text-green-500 mb-2">{successMessage}</p>
      )}

      <Button
        onClick={handleChangePassword}
        className={`px-4 py-2 font-bold text-blue-500 border border-blue-500 rounded-full hover:border-2 hover:border-blue-600 ${
          loading ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        disabled={loading}
      >
        {loading ? 'Processing...' : 'Change Password'}
      </Button>
    </div>
  );
};

export default UserPasswordChange;
