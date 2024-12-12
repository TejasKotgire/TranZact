import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const navigate = useNavigate();
  return (
    <div className="w-full h-screen bg-white flex flex-col">
      <nav className="w-full px-20 py-6 flex justify-between items-center border-b border-gray-200">
        <div className="text-2xl font-bold text-gray-600">TranZact</div>
      </nav>

      <div className="flex-grow flex items-center justify-center">
        <div className="text-center max-w-2xl">
          <h1 className="text-5xl font-bold text-gray-600 mb-6">
            Simplify Your <span className="text-gray-700">Payments</span>
          </h1>
          <p className="text-xl text-gray-600 mb-10">
            TranZact makes digital transactions seamless, secure, and straightforward.
          </p>
          <div className="flex justify-center space-x-4">
            <button
            onClick={()=> navigate('/signup')}
              className="px-8 py-3 bg-gray-700 text-white rounded-md hover:bg-gray-800 transition-colors text-lg"
            >
              Signup
            </button>
            <button
            onClick={()=> navigate('/signin')}
              className="px-8 py-3 border border-gray-600 text-gray-600 rounded-md hover:bg-blue-50 transition-colors text-lg"
            >
              Signin
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;