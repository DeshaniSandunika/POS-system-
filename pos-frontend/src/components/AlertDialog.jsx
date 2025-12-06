import React, { createContext, useContext, useState } from 'react';

const AlertDialogContext = createContext(undefined);

const useAlertDialog = () => {
  const context = useContext(AlertDialogContext);
  if (!context) {
    throw new Error('useAlertDialog must be used within AlertDialog');
  }
  return context;
};

export const AlertDialog = ({ children }) => {
  const [open, setOpen] = useState(false);

  return (
    <AlertDialogContext.Provider value={{ open, setOpen }}>
      {children}
    </AlertDialogContext.Provider>
  );
};

export const AlertDialogTrigger = ({ asChild, children }) => {
  const { setOpen } = useAlertDialog();

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      onClick: (e) => {
        setOpen(true);
        if (children.props.onClick) {
          children.props.onClick(e);
        }
      },
    });
  }

  return (
    <button onClick={() => setOpen(true)}>
      {children}
    </button>
  );
};

export const AlertDialogContent = ({ children }) => {
  const { open, setOpen } = useAlertDialog();

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={() => setOpen(false)}
    >
      <div
        className="w-full max-w-sm rounded-lg bg-white p-6 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
};

export const AlertDialogHeader = ({ children }) => (
  <div className="mb-4">{children}</div>
);

export const AlertDialogTitle = ({ children }) => (
  <h2 className="text-lg font-semibold text-gray-900">{children}</h2>
);

export const AlertDialogDescription = ({ children }) => (
  <p className="text-sm text-gray-600 mt-1">{children}</p>
);

export const AlertDialogAction = ({ children, onClick, ...props }) => {
  const { setOpen } = useAlertDialog();

  return (
    <button
      onClick={(e) => {
        if (onClick) onClick(e);
        setOpen(false);
      }}
      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      {...props}
    >
      {children}
    </button>
  );
};

export const AlertDialogCancel = ({ children, onClick, ...props }) => {
  const { setOpen } = useAlertDialog();

  return (
    <button
      onClick={(e) => {
        if (onClick) onClick(e);
        setOpen(false);
      }}
      className="px-4 py-2 bg-gray-200 text-gray-900 rounded hover:bg-gray-300"
      {...props}
    >
      {children}
    </button>
  );
};
