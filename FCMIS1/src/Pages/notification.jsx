import React from 'react';

const Notifications = ({ notifications }) => {
  return (
    <div className="py-2">
      {notifications.length === 0 ? (
        <div className="text-center p-4">No notifications</div>
      ) : (
        notifications.map((notification, index) => (
          <div key={index} className="px-4 py-2 border-b border-gray-200">
            <p className="text-sm text-gray-700">{notification.message}</p>
            <p className="text-xs text-gray-500">{new Date(notification.date).toLocaleString()}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default Notifications;
