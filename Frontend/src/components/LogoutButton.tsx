import React from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuthStore, AuthState } from '../store/authStore';
import { clearTokenLocal, getTokenLocal } from '../utils/auth';
import axios from 'axios';



const LogoutButton: React.FC= () => {

  const navigate = useNavigate();
  const clearToken = useAuthStore((state: AuthState) => state.clearToken);
  const token = useAuthStore((state: AuthState) => state.token) || getTokenLocal();


  const handleLogout = () => {
    clearTokenLocal();
    clearToken();
    axios.post(
      import.meta.env.VITE_URL_PREFIX+'/api/v1/user/logout',
      {token : token},
      {
        headers: {
          Authorization: `Bearer ${token}`,

        },
      }
    );
    navigate('/login');
  };

  return (
    <button
      onClick={handleLogout}
      className={`text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium ${(token ? '' : 'hidden')}`}
    >
      Logout
    </button>
  );
};

export default LogoutButton;
