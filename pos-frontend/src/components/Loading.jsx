import React from 'react';
import { Loader } from 'lucide-react';

export const Loading = ({ message = 'Loading...' }) => {
  return (
    <div className="flex flex-col items-center justify-center py-8">
      <Loader className="h-8 w-8 animate-spin text-blue-600 mb-2" />
      <p className="text-gray-600">{message}</p>
    </div>
  );
};
