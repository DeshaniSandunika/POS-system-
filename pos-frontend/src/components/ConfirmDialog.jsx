import React, { useState, useEffect } from 'react';

export const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  description,
  children,
  confirmText = 'Delete',
  cancelText = 'Cancel',
  destructive = true,
}) => {
  const [open, setOpen] = useState(false);

  // Handle controlled or uncontrolled mode
  const isControlled = isOpen !== undefined;
  const dialogOpen = isControlled ? isOpen : open;
  
  const handleOpenChange = (newOpen) => {
    if (isControlled) {
      if (!newOpen && onClose) {
        onClose();
      }
    } else {
      setOpen(newOpen);
    }
  };

  const handleConfirm = async () => {
    if (onConfirm) {
      await onConfirm();
    }
    handleOpenChange(false);
  };

  const handleCancel = () => {
    handleOpenChange(false);
  };

  if (!dialogOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={handleCancel}
    >
      <div
        className="w-full max-w-sm rounded-lg bg-white p-6 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-semibold text-gray-900 mb-2">{title}</h2>
        <p className="text-sm text-gray-600 mb-6">
          {message || description}
        </p>
        <div className="flex justify-end gap-2">
          <button
            onClick={handleCancel}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
          >
            {cancelText}
          </button>
          <button
            onClick={handleConfirm}
            className={`px-4 py-2 text-white rounded transition-colors ${
              destructive
                ? 'bg-red-500 hover:bg-red-600'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};
