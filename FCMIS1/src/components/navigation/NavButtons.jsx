import { Link, useNavigate } from "react-router-dom";
import { FaBars, FaRegUser, FaPlus, FaBell } from "react-icons/fa";
import axios from "axios";
import { useState, useEffect, useRef } from "react";
import Notifications from "../../Pages/notification";

const btnStyles = `hover:text-red text-white transition-colors duration-300 focus`;

function NavButtons({ onToggleNav }) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadNotifications, setUnreadNotifications] = useState(false);
  const navigate = useNavigate();
  const notificationRef = useRef(null);

  const handleLogout = () => {
    axios.get('http://localhost:3000/mem/logout')
      .then(response => {
        if (response.data.Status) {
          localStorage.removeItem('token'); // Clear the token from localStorage
          navigate('/memberlogin');
        }
      })
      .catch(err => console.log(err));
  };

  useEffect(() => {
    const fetchNotifications = () => {
      const token = localStorage.getItem("token");

      axios.get('http://localhost:3000/mem/notifications', {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(result => {
        if (result.data.Status) {
          setNotifications(result.data.Notifications);
          // Check if there are any unread notifications
          const hasUnread = result.data.Notifications.some(n => !n.read);
          setUnreadNotifications(hasUnread);
        } else {
          alert(result.data.Error);
        }
      })
      .catch(err => console.log(err));
    };

    fetchNotifications();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [notificationRef]);

  const handleNotificationClick = () => {
    setShowNotifications(!showNotifications);
    if (!showNotifications) {
      setUnreadNotifications(false); // Mark notifications as read
      // Optionally, send a request to the server to mark notifications as read
      const token = localStorage.getItem("token");
      axios.post(
        'http://localhost:3000/mem/markNotificationsRead',
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      ).catch(err => console.log(err));
    }
  };

  return (
    <div className="flex items-center justify-between gap-7">
      <button className={`3xl:hidden ${btnStyles}`} onClick={onToggleNav}>
        <FaBars className="h-6 w-6" />
      </button>
      <Link to="/member/about" className={btnStyles}>
        <FaRegUser className="h-6 w-6" />
      </Link>
      <div className="relative">
        <button
          className={`relative ${btnStyles}`}
          onClick={handleNotificationClick}
        >
          <FaBell className="h-6 w-6 mt-2" />
          {unreadNotifications && (
            <span className="absolute top-0 right-0 inline-flex items-center justify-center w-2 h-2 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full"></span>
          )}
        </button>
        {showNotifications && (
          <div
            ref={notificationRef}
            className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg z-20"
          >
            <Notifications notifications={notifications} />
          </div>
        )}
      </div>
      <div className="focus hidden rounded-sm border-2 border-solid border-gray-350 p-1.5 lg:block">
        <button onClick={handleLogout}
          className="mr-2 flex items-center justify-between gap-2 text-sm font-bold uppercase text-white outline-none"
        >
          <FaPlus className="h-8 w-8 rounded-sm bg-red p-2 text-white transition-transform duration-1000 hover:rotate-[360deg]" />
          Logout
        </button>
      </div>
    </div>
  );
}

export default NavButtons;
