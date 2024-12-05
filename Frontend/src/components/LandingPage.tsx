import { useNavigate } from 'react-router-dom';

export default function LandingPage() {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate('/closet');
  };

  return (
    <div id="landing-page" className="flex flex-col  xl:flex-row items-center xl:items-start min-h-screen bg-gray-50">
      {/* Left Section */}
      <div className="xl:w-1/2 p-8 xl:p-16 flex flex-col justify-center items-start space-y-6">
        <h1 className="text-4xl xl:text-5xl font-bold text-gray-800">
          Outfits.ai
        </h1>
        <h5 className="text-xl xl:text-2xl text-gray-600">
          Recommending Outfits and Storing your Wardrobe.
        </h5>
        <p className="text-gray-500 leading-relaxed">
          Get Outfit Recommendations and Manage your Wardrobe on the app. 
          Try our "Try it" feature to get outfit recommendations for your existing clothes 
          and a new clothing item.
        </p>
        <button
          onClick={handleNavigate}
          className="mt-4 justify-center px-10 py-3 bg-blue-500 text-white text-lg font-semibold rounded-lg shadow-md hover:bg-blue-600 transition duration-300"
        >
          Get Started
        </button>
      </div>

      {/* Right Section */}
      <div className="xl:w-1/2 flex justify-center items-center p-8">
        <img
          className="w-full max-w-md xl:max-w-lg object-cover"
          src="/floatimage.svg"
          alt="Floating illustration"
        />
      </div>
    </div>
  );
}
