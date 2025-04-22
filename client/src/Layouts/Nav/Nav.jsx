import axios from "axios";
import React, { useEffect, useState } from "react";
import { CiHeart, CiSearch, CiShoppingCart } from "react-icons/ci";
import { Link } from "react-router-dom";

const icons = [
  { icon: <CiSearch /> },
  { icon: <CiHeart /> },
  { icon: <CiShoppingCart /> },
];

const nav = [
  { name: "New", path: "/" },
  { name: "Electronics", path: "/" },
  { name: "Fashion & Apparel", path: "/" },
  { name: "Sports & Outdoors", path: "/" },
  { name: "Automotive", path: "/" },
  { name: "Pets", path: "/" },
  { name: "Jewelry & Watches", path: "/" },
];

const user = [
  { name: "Find a Store", path: "/" },
  { name: "Help", path: "/" },
  { name: "Join Us", path: "/" },
  { name: "Sing in", path: "/" },
];

const Nav = () => {
  const [logo, setLogo] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_URL = `${import.meta.env.VITE_API_URL}/logos`;
  const API_KEY = "6m4xzdzaslini9VEaU1JNhyQvMs";
  const STORAGE_URL = import.meta.env.VITE_STORAGE_URL;

  useEffect(() => {
    const fetchLogo = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(API_URL, {
          headers: { "X-API-KEY": API_KEY },
        });
        console.log("Nav API Response:", response.data);
        const mappedLogos = response.data.logos.map((logo) => ({
          id: logo.id,
          image: logo.image
            ? logo.image.startsWith("http")
              ? logo.image
              : `${STORAGE_URL}/${logo.image}`
            : "https://via.placeholder.com/100?text=Fallback",
        }));
        setLogo(mappedLogos);
        setError(null);
      } catch (error) {
        console.error("Failed to fetch logos:", error);
        setError("Failed to load logos");
        setLogo([
          {
            id: "1",
            image: "https://via.placeholder.com/100?text=Fallback",
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLogo();
  }, []);

  const handleImageError = (e) => {
    console.warn("Nav Image failed to load:", e.target.src);
    e.target.src = "https://via.placeholder.com/100?text=Fallback";
  };

  return (
    <header>
      <div className="">
        <ul>
            
        </ul>
      </div>

      <nav className="flex items-center justify-between px-10 py-5">
        {/* Logo Section */}
        <div>
          {isLoading ? (
            <p>Loading logo...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : logo.length > 0 ? (
            logo.map((e) => (
              <Link to="/" key={e.id}>
                <img
                  src={e.image}
                  alt="Logo"
                  className="w-[100px] h-auto"
                  onError={handleImageError}
                />
              </Link>
            ))
          ) : (
            <Link to="/">
              <img
                src="https://via.placeholder.com/100?text=Placeholder"
                alt="Placeholder Logo"
                className="w-[100px] h-auto"
              />
            </Link>
          )}
        </div>
        {/* nav lsit */}
        <div className="">
          <ul className="flex gap-5 font-[500]">
            {nav.map((e, i) => (
              <li key={i}>
                <Link> {e.name} </Link>
              </li>
            ))}
          </ul>
        </div>
        {/* Icon Links */}
        <ul className="flex items-center gap-6">
          {icons.map((item, index) => (
            <li key={index}>
              <Link to="/">{item.icon}</Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
};

export default Nav;
