import React, { useState } from 'react';
import Modal from '../Modal/Modal';
import InputFileUpload from '../Common/InputFileUpload';
import UserService from '../../API/UserService';
import Button from '../Common/Button';
import { MdAddAPhoto } from 'react-icons/md';

interface UserAvatarChangeProps {
  currentAvatar: string;
  onAvatarUpdated: (newAvatarUrl: string) => void;
}

const UserAvatarChange: React.FC<UserAvatarChangeProps> = ({
  currentAvatar,
  onAvatarUpdated,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newAvatar, setNewAvatar] = useState<File | null>(null);
  const [error, setError] = useState<string>('');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];
      setNewAvatar(file);

      const preview = URL.createObjectURL(file);
      setPreviewUrl(preview);
    }
  };

  const handleAvatarSubmit = async () => {
    if (!newAvatar) {
      setError('Please select an avatar image');
      return;
    }

    const formData = new FormData();
    formData.append('avatar', newAvatar);

    try {
      await UserService.changeAvatar(formData);
      const updatedUser = await UserService.getCurrentUser();
      onAvatarUpdated(updatedUser.profile_picture);
      handleCancel();
    } catch {
      setError('Error updating avatar');
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setNewAvatar(null);
    setPreviewUrl(null);
    setError('');
  };

  return (
    <div className="relative inline-block">
      <img
        src={previewUrl || currentAvatar}
        alt="Avatar"
        className="w-24 h-24 rounded-full object-cover mb-4"
      />
      <Button
        onClick={() => setIsModalOpen(true)}
        className="absolute bottom-0 right-0 bg-blue-500 text-white rounded-full p-2 shadow-lg"
      >
        <MdAddAPhoto className="w-5 h-5" />
      </Button>

      <Modal isOpen={isModalOpen} onClose={handleCancel}>
        <div className="relative flex flex-col items-center p-6 pb-0 pr-0 pl-0">
          <h2 className="text-xl font-semibold absolute left-0 top-0">
            Change Avatar
          </h2>
          {error && <div className="text-red-500 mb-4">{error}</div>}

          <img
            src={
              previewUrl ||
              currentAvatar ||
              '/images/avatars/default-avatar.png'
            }
            alt="Preview Avatar"
            className="w-24 h-24 rounded-full object-cover mb-4"
          />

          <InputFileUpload onChange={handleAvatarChange} />

          <div className="mt-8 w-full flex justify-end">
            <Button
              onClick={handleCancel}
              className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
            >
              Cancel
            </Button>
            <Button
              onClick={handleAvatarSubmit}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Save
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default UserAvatarChange;
