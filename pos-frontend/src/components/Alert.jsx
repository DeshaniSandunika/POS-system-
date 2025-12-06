import React from 'react';
import { AlertCircle, CheckCircle } from 'lucide-react';

export const Alert = ({ type = 'info', title, message }) => {
  const bgColor = {
    success: 'bg-green-50',
    error: 'bg-red-50',
    warning: 'bg-yellow-50',
    info: 'bg-blue-50',
  };

  const borderColor = {
    success: 'border-green-200',
    error: 'border-red-200',
    warning: 'border-yellow-200',
    info: 'border-blue-200',
  };

  const textColor = {
    success: 'text-green-800',
    error: 'text-red-800',
    warning: 'text-yellow-800',
    info: 'text-blue-800',
  };

  const Icon = type === 'success' ? CheckCircle : AlertCircle;

  return (
    <div className={`${bgColor[type]} border ${borderColor[type]} rounded-lg p-4 flex gap-3`}>
      <Icon className={`${textColor[type]} h-5 w-5 flex-shrink-0`} />
      <div>
        {title && <h3 className={`font-semibold ${textColor[type]}`}>{title}</h3>}
        <p className={textColor[type]}>{message}</p>
      </div>
    </div>
  );
};
