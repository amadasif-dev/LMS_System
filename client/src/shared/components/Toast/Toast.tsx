import toast from 'react-hot-toast';

export const Toast = {
  success: (message: string) => toast.success(message, { duration: 4000 }),
  error: (message: string) => toast.error(message, { duration: 4000 }),
  loading: (message: string) => toast.loading(message),
  dismiss: toast.dismiss,
  promise: toast.promise,
};

export { Toaster } from 'react-hot-toast';
