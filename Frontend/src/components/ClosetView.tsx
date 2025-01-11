import { AuthState, useAuthStore } from '../store/authStore';
import { getTokenLocal } from '../utils/auth';
import { useState, useEffect } from 'react';
import { api } from '../utils/api'
import UploadModal from './UploadModal';
import { useModalStore, ModalState } from '../store/modalStore';

interface imageResponse {
    URL:    string,
    Color:  string,
    Style:  string,
    Type:   string,
    ID:     number
}



const ClosetView = () => {
  const [images, setImages] = useState<imageResponse[]>([]);
  const token = getTokenLocal()||useAuthStore((state: AuthState) => state.token);
  const modalBool = useModalStore((state: ModalState) => state.yes);

  useEffect(() => {
    const fetchImageUrls = async () => {
      try {
        const response = await api.get(
            '/api/v1/clothing/get-clothings',
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
        const data = (await response.data);
        setImages(data);

      } catch (error) {
        console.error('Error fetching image URLs:', error);
      }
    };

        fetchImageUrls();
    }, [modalBool]);

  return (
<div className="px-4 max-w-full">
  <div className="flex overflow-x-auto gap-4 max-w-full px-2 scrollbar-hide">
    {images.length ? images.map((item, index) => (
      <div
        key={index}
        className="min-w-[200px] flex-shrink-0 bg-white rounded-lg shadow-md p-4"
      >
        <img
          src={item.url}
          alt={`Clothing ${item.ID}`}
          className="h-32 w-full object-cover rounded-lg mb-2"
        />
        <h2 className="font-semibold">{item.type}</h2>
        <p>Style: {item.Style || "N/A"}</p>
        <p>Color: {item.Color || "N/A"}</p>
      </div>
    )) : "No Clothes Uploaded"}
  </div>
  <UploadModal />
</div>

  );
};

export default ClosetView;