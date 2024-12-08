import React, { useState } from 'react';
import axios from 'axios';
import { AuthState, useAuthStore } from '../store/authStore';
import { getTokenLocal } from '../utils/auth';

const api = axios.create({
  baseURL: import.meta.env.VITE_URL_PREFIX || "http://localhost:8000",
});

const FileUpload: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [response, setResponse] = useState<string>('');
  const [type, setType] = useState<string>('Select The Type of Your Clothing');
  const [loading, setLoading] = useState(false);
  const [errorColor, setErrorColor] = useState<string>('');

  const token = getTokenLocal()||useAuthStore((state: AuthState) => state.token);


  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
      setIsOpen(!isOpen);
  }


  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      alert('Please select a file');
      return;
    }
    if (type == 'Select The Type of Your Clothing'){
      alert('Please select a clothing type');
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await api.post(
        '/api/v1/clothing/add-clothing',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      setResponse(res.statusText);
      setErrorColor('green');
    } catch (error: any) {
      console.error(error);
      setErrorColor('red')
      setResponse(error.response?.data?.error || 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">

        <div className="relative inline-block text-left">

            <div>
                <button
                    onClick={toggleDropdown}
                    className="inline-flex justify-center w-full rounded-md 
                    border border-gray-300 shadow-sm px-4 py-2 bg-white 
                    text-sm font-medium text-gray-700 hover:bg-gray-50 
                    focus:outline-none"
                >
                    {type}
                    <svg
                        className="ml-2 -mr-1 h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        aria-hidden="true"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M19 9l-7 7-7-7"
                        />
                    </svg>
                </button>
            </div>

            {isOpen && (
                <div
                    className="origin-top-right absolute right-0 mt-2 w-56 
                    rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5
                    focus:outline-none"
                    role="menu"
                >
                  <div className="py-1" role="none">
                        {
                          [
                            { label: "None", onClick: () => setType("Select The Type of Your Clothing") },
                            { label: "Upper-clothes", onClick: () => setType("Upper-clothes") },
                            { label: "Pants", onClick: () => setType("Pants") },
                            { label: "Hat", onClick: () => setType("Hat") },
                            { label: "Skirt", onClick: () => setType("Skirt") },
                            { label: "Dress", onClick: () => setType("Dress") },
                            { label: "Belt", onClick: () => setType("Belt") },
                            { label: "Shoes", onClick: () => setType("Shoes") },
                            { label: "Scarf", onClick: () => setType("Scarf") },
                          ].map((item, index) => (
                            <a
                              key={index}
                              className="block px-4 py-2 text-sm text-gray-700 
                              hover:bg-gray-100"
                              role="menuitem"
                              onClick={()=>{
                                item.onClick();
                                toggleDropdown();
                              }}
                            >
                              {item.label}
                            </a>
                          ))
                        }
                      </div>
                </div>
            )}
        </div>

      <input
        type="file"
        onChange={handleFileChange}
        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
      />
      <button
        onClick={handleUpload}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        disabled={loading}
      >
        {loading ? 'Uploading...' : 'Upload Clothing'}
      </button>
      {response && <p className={`text-${errorColor}-500`}>{response}</p>}
    </div>
  );
};

export default FileUpload;
