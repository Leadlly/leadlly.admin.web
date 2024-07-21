// ToastNotification.tsx
import { ToastContainer } from 'react-toastify';

interface ToastNotificationProps {
  // You can add props if needed
}

const ToastNotification: React.FC<ToastNotificationProps> = () => {
  return (
    <ToastContainer
      position="top-right"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
    />
  );
};

export default ToastNotification;