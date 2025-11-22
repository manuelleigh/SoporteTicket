import React from 'react';
import { useAppContext } from '../context/AppContext';

function Notifications() {
  const { notifications } = useAppContext();

  return (
    <div className="position-fixed bottom-0 end-0 p-3" style={{ zIndex: 9999 }}>
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`toast show mb-2 bg-${notification.type} text-white`}
          role="alert"
          aria-live="assertive"
          aria-atomic="true"
        >
          <div className="toast-body">
            {notification.message}
          </div>
        </div>
      ))}
    </div>
  );
}

export default Notifications;
