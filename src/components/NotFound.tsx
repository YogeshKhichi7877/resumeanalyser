import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="h-screen flex flex-col items-center justify-center bg-white text-center p-4">
      <h1 className="text-9xl font-black text-purple-600 mb-4">404</h1>
      <h2 className="text-3xl font-bold uppercase mb-8">Page Not Found</h2>
      <p className="mb-8 font-medium">Even the AI couldn't find this page.</p>
      <Link to="/" className="px-8 py-4 bg-black text-white font-bold uppercase shadow-[4px_4px_0px_0px_rgba(128,0,128,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all">
        Go Home
      </Link>
    </div>
  );
};
export default NotFound;