import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Notifications.css';


const Notifications = ({ userId }) => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    axios.get(`http://localhost:3001/notifications/${userId}`)
      .then(response => setNotifications(response.data))
      .catch(error => console.log(error));
  }, [userId]);

  const markAsRead = async (notificationId) => {
    try {
      await axios.patch(`http://localhost:3001/notifications/${notificationId}`, { read: true });
      setNotifications(notifications.map(notification =>
        notification._id === notificationId ? { ...notification, read: true } : notification
      ));
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="notifications-container">
      <h3>Your Notifications</h3>
      <ul>
        {notifications.map(notification => (
          <li
            key={notification._id}
            className={`notification ${notification.read ? 'read' : 'unread'}`}
            onClick={() => markAsRead(notification._id)}
          >
            {notification.message}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Notifications;
