import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  CiAlignBottom,
  CiBookmarkCheck,
  CiChat2,
  CiCircleInfo,
  CiDroplet,
  CiHome,
  CiImageOn,
  CiSettings,
  CiSliderHorizontal,
  CiUser,
  CiLogout, // Added for logout icon
} from "react-icons/ci";
import { FaChevronDown, FaChevronUp } from "react-icons/fa"; // For submenu toggle arrows

const NavAdmin = () => {
  const [openSubmenu, setOpenSubmenu] = useState(null);
  const navigate = useNavigate(); // Added for navigation

  const toggleSubmenu = (index) => {
    setOpenSubmenu(openSubmenu === index ? null : index);
  };

  const handleLogout = () => {
    localStorage.removeItem("token"); // Clear token from localStorage
    navigate("/login"); // Redirect to login page
  };

  const logo = [
    { logo: "https://coderthemes.com/boron/layouts/assets/images/logo.png" },
  ];

  const menuItems = [
    {
      section: "GENERAL",
      items: [
        { name: "Dashboard", icon: <CiHome />, path: "/dashboard" },
        {
          name: "Logo",
          icon: <CiDroplet />,
          submenu: [
            { name: "List", path: "/logo/list" },
            { name: "Create", path: "/logo/create" },
          ],
        },
        {
          name: "Sliders",
          icon: <CiSliderHorizontal />,
          submenu: [
            { name: "List", path: "/slider/list" },
            { name: "Create", path: "/slider/create" },
          ],
        },
        {
          name: "Banners",
          icon: <CiImageOn />,
          submenu: [
            { name: "List", path: "/banner/list" },
            { name: "Create", path: "/banner/create" },
          ],
        },
        {
          name: "Products",
          icon: <CiAlignBottom />,
          submenu: [
            { name: "List", path: "/product/list" },
            { name: "Create", path: "/product/create" },
          ],
        },
        { name: "Orders", icon: <CiBookmarkCheck />, path: "/order" },
        { name: "Email", icon: <CiChat2 />, path: "/email" },
        { name: "Customers", icon: <CiCircleInfo />, path: "/customer" },
        { name: "Setting", icon: <CiSettings />, path: "/setting" },
      ],
    },
    {
      section: "USERS",
      items: [
        { name: "Profile", icon: <CiUser />, path: "/user" },
        { name: "Logout", icon: <CiLogout />, action: handleLogout }, // Added logout item
      ],
    },
  ];

  return (
    <header className="bg-[#1a2236] text-gray-400 w-[320px] h-screen sticky top-0">
      <div className="flex flex-col h-full">
        {/* Logo Section */}
        <div className="p-4 flex items-center gap-2 border-b border-gray-700">
          <img src={logo[0].logo} alt="Logo" className="h-8 w-auto" />
        </div>

        {/* Navigation List */}
        <nav className="flex-1 overflow-y-auto">
          {menuItems.map((section, sectionIndex) => (
            <div key={sectionIndex} className="mt-4">
              {/* Section Header */}
              <h2 className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                {section.section}
              </h2>
              <ul className="space-y-1">
                {section.items.map((item, itemIndex) => {
                  const index = `${sectionIndex}-${itemIndex}`;
                  const isOpen = openSubmenu === index;

                  return (
                    <li key={itemIndex}>
                      {/* Main Menu Item */}
                      {item.submenu ? (
                        <div
                          onClick={() => toggleSubmenu(index)}
                          className={`flex items-center justify-between px-4 py-2 text-sm cursor-pointer transition-all duration-200 ${
                            isOpen
                              ? "bg-orange-500 text-white"
                              : "hover:bg-gray-700 hover:text-white"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-lg">{item.icon}</span>
                            <span>{item.name}</span>
                          </div>
                          {isOpen ? (
                            <FaChevronUp className="text-xs" />
                          ) : (
                            <FaChevronDown className="text-xs" />
                          )}
                        </div>
                      ) : (
                        item.action ? (
                          <button
                            onClick={item.action}
                            className="flex items-center gap-3 px-4 py-2 text-sm transition-all duration-200 hover:bg-gray-700 hover:text-white w-full text-left"
                          >
                            <span className="text-lg">{item.icon}</span>
                            <span>{item.name}</span>
                          </button>
                        ) : (
                          <Link
                            to={item.path}
                            className="flex items-center gap-3 px-4 py-2 text-sm transition-all duration-200 hover:bg-gray-700 hover:text-white"
                          >
                            <span className="text-lg">{item.icon}</span>
                            <span>{item.name}</span>
                          </Link>
                        )
                      )}

                      {/* Submenu */}
                      {item.submenu && isOpen && (
                        <ul className="pl-8 space-y-1">
                          {item.submenu.map((subItem, subIndex) => (
                            <li key={subIndex}>
                              <Link
                                to={subItem.path}
                                className="block px-4 py-1 text-sm text-gray-300 transition-all duration-200 hover:bg-gray-600 hover:text-white"
                              >
                                {subItem.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>
      </div>
    </header>
  );
};

export default NavAdmin;