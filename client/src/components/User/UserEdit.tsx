import React, { useState, useEffect } from 'react';
import { FormControl, FormHelperText, Switch } from '@mui/joy';
import useAuthStore from '../../hooks/useAuthStore';
import UserService from '../../API/UserService';

interface UserEditProps {
  userId: number;
  currentRole: string;
  onRoleUpdate?: (newRole: string) => void;
}

const UserEdit: React.FC<UserEditProps> = ({
  userId,
  currentRole,
  onRoleUpdate,
}) => {
  const { user } = useAuthStore();
  const [role, setRole] = useState<string>(currentRole);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setRole(currentRole);
  }, [currentRole]);

  const fetchUserRole = async () => {
    setLoading(true);
    try {
      const userData = await UserService.getUserByAdmin(userId);
      setRole(userData.role);
    } catch {
      setError('Failed to fetch user role. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchUserRole();
    }
  }, [userId]);

  const handleRoleChange = async () => {
    const newRole = role === 'admin' ? 'user' : 'admin';
    setLoading(true);
    setError(null);

    try {
      await UserService.updateUserRole(userId, newRole);
      setRole(newRole);
      if (onRoleUpdate) onRoleUpdate(newRole);
    } catch {
      setError('Failed to update role. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!user || user.role !== 'admin' || user.id === userId) return null;

  return (
    <div className="flex items-center">
      <FormControl
        orientation="horizontal"
        sx={{
          width: 'auto',
          justifyContent: 'flex-start',
          alignItems: 'center',
        }}
      >
        <Switch
          checked={role === 'admin'}
          onChange={handleRoleChange}
          disabled={loading}
          color="primary"
        />
        <FormHelperText
          sx={{
            marginLeft: '8px',
            color: role === 'admin' ? 'green' : 'red',
            fontWeight: 'bold',
          }}
        >
          {role === 'admin' ? 'Admin' : 'User'}
        </FormHelperText>
      </FormControl>
      {error && <p className="text-red-500 text-sm ml-2">{error}</p>}
    </div>
  );
};

export default UserEdit;
