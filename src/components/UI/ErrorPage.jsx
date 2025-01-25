
import React from 'react';

const ErrorPage = ({ message }) => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <img
        src="https://cdn.pixabay.com/photo/2018/03/31/06/31/dog-3277414_1280.jpg" 
        alt="Dog"
        className="h-48 w-48 mb-4 rounded-full"
      />
      <h1 className="text-2xl font-semibold text-white">{message}</h1>
    </div>
  );
};

export default ErrorPage;
