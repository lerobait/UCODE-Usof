import React, { useState } from 'react';
import Modal from '../Modal/Modal';
import Button from '../Common/Button';
import Input from '../Common/Input';
import UserService from '../../API/UserService';
import { AxiosError } from 'axios';
import { FaEdit } from 'react-icons/fa';

interface User {
  login: string;
  full_name: string;
}

interface UserInfoChangeProps {
  currentUser: User;
  onSave: (login: string, fullName: string) => void;
  error?: string;
}

const UserInfoChange: React.FC<UserInfoChangeProps> = ({
  currentUser,
  onSave,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [login, setLogin] = useState(currentUser.login);
  const [fullName, setFullName] = useState(currentUser.full_name);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setErrorMessage('');
  };

  const handleSave = async () => {
    if (!login || !fullName) {
      setErrorMessage('Both fields are required.');
      return;
    }

    try {
      await UserService.updateCurrentUser({ login, full_name: fullName });
      onSave(login, fullName);
      handleCloseModal();
    } catch (err) {
      if (
        err instanceof AxiosError &&
        err.response &&
        err.response.status === 400
      ) {
        setErrorMessage('Error updating user information ');
      } else {
        setErrorMessage(
          'This login is already taken. Please choose another one.',
        );
      }
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setState: React.Dispatch<React.SetStateAction<string>>,
  ) => {
    const { value } = e.target;
    if (value.length <= 30) {
      setState(value);
    }
  };

  return (
    <>
      <Button onClick={handleOpenModal} className="flex items-center">
        <FaEdit className="mr-2" /> Change Info
      </Button>

      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <div className="relative flex flex-col items-center p-6 pb-0 pr-0">
          <h2 className="text-xl font-semibold absolute left-0 top-0">
            Change User Info
          </h2>

          <div className="w-full mt-8">
            <label
              htmlFor="login"
              className="block text-sm font-medium text-gray-700"
            >
              Login
            </label>
            <Input
              id="login"
              value={login}
              onChange={(e) => handleInputChange(e, setLogin)}
              className="border border-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-600 w-full mt-2"
            />
            <p className="text-sm text-gray-500 mt-1">
              {login.length}/30 characters
            </p>
          </div>

          <div className="w-full mt-4">
            <label
              htmlFor="fullName"
              className="block text-sm font-medium text-gray-700"
            >
              Full Name
            </label>
            <Input
              id="fullName"
              value={fullName}
              onChange={(e) => handleInputChange(e, setFullName)}
              className="border border-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-600 w-full mt-2"
            />
            <p className="text-sm text-gray-500 mt-1">
              {fullName.length}/30 characters
            </p>
          </div>

          {errorMessage && (
            <div className="text-red-500 mt-2">{errorMessage}</div>
          )}

          <div className="mt-8 w-full flex justify-end">
            <Button
              onClick={handleCloseModal}
              className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Save
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default UserInfoChange;
