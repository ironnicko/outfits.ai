import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';


const CreateAccount: React.FC = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const handleKeyDown = (e: React.KeyboardEvent)=>{
    if (e.key == 'Enter')
        handleCreateAccount();
  };

  const handleCreateAccount = async () => {
    try {
      await axios.post(import.meta.env.VITE_URL_PREFIX+'/api/v1/user', {
        email,
        password,
        username
      });

      navigate('/login'); // Redirect to upload page
    } catch (err: any) {
      console.error(err.response.data);
      setError(err.response?.data?.message || 'Create Account failed');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">Create Account</h2>
        <div className="flex flex-col space-y-4" onKeyUpCapture={handleKeyDown}>
          <input
            type="email"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="username"
            placeholder="Username"
            onChange={(e) => setUsername(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleCreateAccount}
            
            className="w-full px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition duration-300"
          >
            Create
          </button>
          <p className="text-sm text-center text-red-500">{error ? error : ""}</p>
        </div>
      </div>
    </div>
  );
};

export default CreateAccount;
