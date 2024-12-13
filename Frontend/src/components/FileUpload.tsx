import React, { useState } from 'react';
import { AuthState, useAuthStore } from '../store/authStore';
import { getTokenLocal } from '../utils/auth';
import { api } from '../utils/api'
import { useModalStore, ModalState } from '../store/modalStore';


const FileUpload: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [response, setResponse] = useState<string>('');
  const [type, setType] = useState<string>('Select The Type of Your Clothing');
  const [loading, setLoading] = useState(false);
  const [errorColor, setErrorColor] = useState<string>('');

  const token = getTokenLocal()||useAuthStore((state: AuthState) => state.token);
  const setModal = useModalStore((state: ModalState) => state.setBool)

  const [isOpenD, setIsOpenD] = useState(false);

  const toggleDropdown = () => {
      setIsOpenD(!isOpenD);
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
    formData.append('type', type)

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
      setModal(false);
    } catch (error: any) {
      console.error(error);
      setErrorColor('red')
      setResponse(error.response?.data?.error || 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-2">
    <div className="flex flex-col items-center space-y-4">
          
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
          

          {isOpenD && (
              <div
                  className="relative right-0 z-10 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 overflow-hidden"
                  role="menu"
              >
              <div className="py-1" role="none">
                      {
                      [
                          { label: "None", onClick: () => setType("Select The Type of Your Clothing") },
                          { label: "Upper", onClick: () => setType("upper") },
                          { label: "Lower", onClick: () => setType("lower") },
                          { label: "Full-Body", onClick: () => setType("full") },
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


      <input
      type="file"
      onChange={handleFileChange}
      className="block text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
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
    </div>
  );
};

export default FileUpload;
