import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { CiShoppingCart, CiSun, CiBellOn } from "react-icons/ci";
import { FaComment, FaCalendarAlt, FaFire, FaEllipsisH } from "react-icons/fa";

const FooterAdmin = () => {
  const [activeDropdown, setActiveDropdown] = useState(null); // Track which dropdown is open: 'notifications', 'cart', or null
  const [openMenuId, setOpenMenuId] = useState(null);
  const headerRef = useRef(null);

  // Notification data (4 notifications)
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      name: "Jessie Samson",
      action: "Mentioned you in a comment.",
      timeAgo: "10m",
      timestamp: "10:41 AM August 7, 2021",
      image: "https://randomuser.me/api/portraits/men/1.jpg",
      actionType: "comment",
      status: "online",
      read: false,
    },
    {
      id: 2,
      name: "Jana Foster",
      action: "Created an event.",
      timeAgo: "20m",
      timestamp: "10:20 AM August 7, 2021",
      image: null,
      actionType: "event",
      status: "online",
      read: false,
    },
    {
      id: 3,
      name: "Jessie Samson",
      action: "Liked your comment.",
      timeAgo: "1h",
      timestamp: "9:30 AM August 7, 2021",
      image: "https://randomuser.me/api/portraits/women/2.jpg",
      actionType: "like",
      status: "online",
      read: false,
    },
    {
      id: 4,
      name: "Kiera Anderson",
      action: "Mentioned you in a comment.",
      timeAgo: "",
      timestamp: "9:11 AM August 7, 2021",
      image: "https://randomuser.me/api/portraits/women/3.jpg",
      actionType: "comment",
      status: "online",
      read: false,
    },
  ]);

  // Sample cart data with product images
  const [cartItems] = useState([
    {
      id: 1,
      name: "Product A",
      quantity: 2,
      price: 29.99,
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
    },
    {
      id: 2,
      name: "Product B",
      quantity: 1,
      price: 49.99,
      image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
    },
    {
      id: 3,
      name: "Product C",
      quantity: 3,
      price: 19.99,
      image: "https://images.unsplash.com/photo-1503602642458-232111445657?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
    },
  ]);

  const handleBellClick = (e) => {
    e.stopPropagation();
    setActiveDropdown(activeDropdown === "notifications" ? null : "notifications");
    setOpenMenuId(null);
  };

  const handleShoppingCartClick = (e) => {
    e.stopPropagation();
    setActiveDropdown(activeDropdown === "cart" ? null : "cart");
    setOpenMenuId(null);
  };

  const handleHeaderClick = () => {
    setActiveDropdown(null);
    setOpenMenuId(null);
  };

  const handleMarkAllAsRead = (e) => {
    e.stopPropagation();
    setNotifications(notifications.map((notif) => ({ ...notif, read: true })));
    setOpenMenuId(null);
  };

  const handleNotificationHistory = (e) => {
    e.stopPropagation();
    console.log("Notification history clicked!");
  };

  const handleEllipsisClick = (id, e) => {
    e.stopPropagation();
    setOpenMenuId(openMenuId === id ? null : id);
  };

  const handleMarkAsUnread = (id, e) => {
    e.stopPropagation();
    setNotifications(
      notifications.map((notif) =>
        notif.id === id ? { ...notif, read: false } : notif
      )
    );
    setOpenMenuId(null);
  };

  const handleRemoveNotification = (id, e) => {
    e.stopPropagation();
    setNotifications(notifications.filter((notif) => notif.id !== id));
    setOpenMenuId(null);
  };

  const getActionIcon = (actionType) => {
    switch (actionType) {
      case "comment":
        return <FaComment className="text-gray-500 text-sm" />;
      case "event":
        return <FaCalendarAlt className="text-gray-500 text-sm" />;
      case "like":
        return <FaFire className="text-gray-500 text-sm" />;
      default:
        return null;
    }
  };

  // Close dropdowns when clicking outside the header
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (headerRef.current && !headerRef.current.contains(event.target)) {
        setActiveDropdown(null);
        setOpenMenuId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header
      ref={headerRef}
      className="bg-white w-full shadow-md h-16 flex items-center justify-between my-[2px] px-6 sticky top-0 z-10"
      onClick={handleHeaderClick}
    >
      {/* Left Section */}
      <div className="flex justify-end items-center gap-4"></div>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        {/* Shopping Cart Icon with Dropdown */}
        <div className="relative">
          <button
            className="relative text-gray-600 hover:text-gray-800"
            onClick={handleShoppingCartClick}
          >
            <CiShoppingCart className="text-2xl" />
            <span className="absolute -top-1 -right-1 bg-teal-500 text-white text-xs font-semibold rounded-full w-5 h-5 flex items-center justify-center">
              {cartItems.length}
            </span>
          </button>

          {/* Shopping Cart Dropdown */}
          {activeDropdown === "cart" && (
            <div className="absolute right-0 mt-2 w-80 bg-gray-100 rounded-xl shadow-2xl z-20">
              <div className="py-3">
                {/* Header */}
                <div className="px-4 py-2 flex justify-between items-center bg-teal-500 text-white rounded-t-xl">
                  <span className="text-sm font-semibold">
                    Shopping Cart
                  </span>
                  <span className="text-xs">
                    {cartItems.length} items
                  </span>
                </div>

                {/* Cart Items List with Scroll */}
                <div className="max-h-64 overflow-y-auto px-3 py-2">
                  {cartItems.length > 0 ? (
                    cartItems.map((item) => (
                      <div
                        key={item.id}
                        className="mb-2 p-3 bg-white rounded-lg shadow-sm flex items-center gap-3 hover:scale-[1.02] transition-transform duration-200"
                      >
                        {/* Product Image */}
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 rounded-lg object-cover border border-gray-200"
                        />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-800 truncate">{item.name}</p>
                          <p className="text-xs text-gray-600">
                            Qty: {item.quantity} | ${item.price.toFixed(2)} each
                          </p>
                        </div>
                        <p className="text-sm font-semibold text-teal-600">
                          ${(item.quantity * item.price).toFixed(2)}
                        </p>
                      </div>
                    ))
                  ) : (
                    <div className="px-4 py-3 text-sm text-gray-500">
                      Your cart is empty
                    </div>
                  )}
                </div>

                {/* Cart Footer */}
                <div className="px-4 py-2 text-center bg-teal-500 text-white rounded-b-xl">
                  <button className="text-sm hover:underline">
                    View Cart
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Theme Toggle Icon (No Dropdown) */}
        <button className="text-gray-600 hover:text-gray-800">
          <CiSun className="text-2xl" />
        </button>

        {/* Notification Icon with Badge */}
        <div className="relative">
          <button
            className="relative text-gray-600 hover:text-gray-800"
            onClick={handleBellClick}
          >
            <CiBellOn className="text-2xl" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-semibold rounded-full w-5 h-5 flex items-center justify-center">
              {notifications.filter((notif) => !notif.read).length}
            </span>
          </button>

          {/* Notification Dropdown with New Style */}
          {activeDropdown === "notifications" && (
            <div className="absolute right-0 mt-2 w-80 bg-gray-100 rounded-xl shadow-2xl z-20">
              <div className="py-3">
                {/* Header */}
                <div className="px-4 py-2 flex justify-between items-center bg-red-500 text-white rounded-t-xl">
                  <span className="text-sm font-semibold">
                    Notifications
                  </span>
                  <button
                    onClick={handleMarkAllAsRead}
                    className="text-xs hover:underline"
                  >
                    Mark all as read
                  </button>
                </div>

                {/* Notification List with Scroll */}
                <div className="max-h-64 overflow-y-auto px-3 py-2">
                  {notifications.length > 0 ? (
                    notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className="mb-2 p-3 bg-white rounded-lg shadow-sm flex items-start gap-3 hover:scale-[1.02] transition-transform duration-200 relative"
                      >
                        {/* Avatar or Initial */}
                        <div className="relative">
                          {notification.image ? (
                            <img
                              src={notification.image}
                              alt={`${notification.name} avatar`}
                              className="w-12 h-12 rounded-full object-cover border border-gray-200"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-lg font-semibold text-blue-600">
                              {notification.name.charAt(0)}
                            </div>
                          )}
                          {/* Status Dot */}
                          {notification.status === "online" && (
                            <span className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></span>
                          )}
                          {/* Unread Indicator */}
                          {!notification.read && (
                            <span className="absolute top-0 left-0 w-3 h-3 bg-red-500 rounded-full"></span>
                          )}
                        </div>

                        {/* Notification Content */}
                        <div className="flex-1">
                          <div className="flex items-center gap-1">
                            {getActionIcon(notification.actionType)}
                            <span className="text-sm font-medium text-gray-800">
                              {notification.name}
                            </span>
                            <span className="text-sm text-gray-600">
                              {notification.action}
                            </span>
                            {openMenuId !== notification.id &&
                              notification.timeAgo && (
                                <span className="text-xs text-gray-500">
                                  {notification.timeAgo}
                                </span>
                              )}
                            <button
                              className="ml-auto text-gray-500 hover:text-gray-700"
                              onClick={(e) =>
                                handleEllipsisClick(notification.id, e)
                              }
                            >
                              <FaEllipsisH className="text-sm" />
                            </button>
                          </div>
                          <div className="flex items-center gap-1 mt-1">
                            <span className="text-xs text-gray-500">🕒</span>
                            <span className="text-xs text-gray-500">
                              {notification.timestamp}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="px-4 py-3 text-sm text-gray-500">
                      No new notifications
                    </div>
                  )}
                </div>

                {/* Notification History Link */}
                <div className="px-4 py-2 text-center bg-red-500 text-white rounded-b-xl">
                  <button
                    onClick={handleNotificationHistory}
                    className="text-sm hover:underline"
                  >
                    Notification history
                  </button>
                </div>
              </div>

              {/* Ellipsis Dropdown Menu (Outside the main scrollable area to prevent overlap) */}
              {openMenuId && (
                <div className="absolute right-4 top-8 w-40 bg-white rounded-md shadow-lg z-30">
                  <button
                    onClick={(e) => handleMarkAsUnread(openMenuId, e)}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Mark as unread
                  </button>
                  <button
                    onClick={(e) => handleRemoveNotification(openMenuId, e)}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* User Profile */}
        <div className="flex items-center gap-2">
          <img
            src="https://randomuser.me/api/portraits/women/44.jpg"
            alt="User Avatar"
            className="w-10 h-10 rounded-full object-cover"
          />
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-gray-800">
              Richard Marshall
            </span>
            <span className="text-xs text-gray-500">Founder</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default FooterAdmin;