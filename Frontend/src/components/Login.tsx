import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../utils/api'
import { useAuthStore, AuthState } from '../store/authStore';

const Login: React.FC = () => {


  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const setTokenState = useAuthStore((state: AuthState) => state.setToken);

  const navigate = useNavigate();
  const handleKeyDown = (e: React.KeyboardEvent)=>{
    if (e.key == 'Enter')
        handleLogin();
  };

  const handleLogin = async () => {
    try {
      const res = await api.post('/api/v1/user/login', {
        email,
        password,
      });


      setTokenState(res.data.token);
      navigate('/closet'); // Redirect to upload page
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">Login</h2>
        <div className="flex flex-col space-y-4" onKeyUpCapture={handleKeyDown}>
          <input
            type="email"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleLogin}
            
            className="w-full px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition duration-300"
          >
            Login
          </button>
          <button
          onClick={()=>{navigate("/create")}}
          className="w-full px-4 py-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition duration-300"
          >Create</button>
          <p className="text-sm text-center text-red-500">{error ? error : ""}</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
