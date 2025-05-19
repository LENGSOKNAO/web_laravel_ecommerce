import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const user = [
  { name: "Find a Store", path: "/" },
  { name: "Help", path: "/" },
  { name: "Join Us", path: "/" },
  { name: "Sign In", path: "/" },
];

const nav = [
  {
    name: "New",
    path: "/",
    list: [
      {
        nav: "New & Featured",
        path: "/",
        items: [
          { name: "New Arrivals", path: "/" },
          { name: "Best Sellers", path: "/" },
          { name: "Shop All Sale", path: "/" },
        ],
      },
      {
        nav: "Gender",
        path: "/",
        items: [
          { name: "Men's", path: "/" },
          { name: "Women's", path: "/" },
          { name: "Kid's", path: "/" },
        ],
      },
      {
        nav: "Trending",
        path: "/",
      },
    ],
  },
  {
    name: "Men",
    path: "/",
    list: [
      {
        nav: "New & Featured",
        path: "/",
        items: [
          { name: "New Arrivals", path: "/" },
          { name: "Best Sellers", path: "/" },
          { name: "Shop All Sale", path: "/" },
        ],
      },
      {
        nav: "Shoes",
        path: "/",
        items: [
          { name: "Jordan", path: "/" },
          { name: "Lifestyle", path: "/" },
          { name: "Sandals & Slides", path: "/" },
          { name: "Training & Gym", path: "/" },
          { name: "Shoes $100 & Under", path: "/" },
          { name: "Basketball", path: "/" },
          { name: "All Shoes", path: "/" },
        ],
      },
      {
        nav: "Accessories",
        path: "/",
        items: [
          { name: "Socks", path: "/" },
          { name: "Sunglasses", path: "/" },
          { name: "Belts", path: "/" },
          { name: "Hats & Headwear", path: "/" },
          { name: "Bags & Backpacks", path: "/" },
        ],
      },
      {
        nav: "Clothing",
        path: "/",
        items: [
          { name: "Tops & Graphic Tees", path: "/" },
          { name: "Pants", path: "/" },
          { name: "Hoodies & Sweatshirts", path: "/" },
          { name: "Training & Gym", path: "/" },
          { name: "Shoes $100 & Under", path: "/" },
          { name: "Shorts", path: "/" },
          { name: "All Clothing", path: "/" },
        ],
      },
    ],
  },
  {
    name: "Women",
    path: "/",
    list: [
      {
        nav: "New & Featured",
        path: "/",
        items: [
          { name: "New Arrivals", path: "/" },
          { name: "Best Sellers", path: "/" },
          { name: "Shop All Sale", path: "/" },
        ],
      },

      {
        nav: "  Shop by Color",
        path: "/",
        items: [
          { name: "Bold Blues", path: "/" },
          { name: "Neon Edit", path: "/" },
          { name: "Timeless Neutrals", path: "/" },
        ],
      },
      {
        nav: "Shoes",
        path: "/",
        items: [
          { name: "Jordan", path: "/" },
          { name: "Lifestyle", path: "/" },
          { name: "Sandals & Slides", path: "/" },
          { name: "Training & Gym", path: "/" },
          { name: "Shoes $100 & Under", path: "/" },
          { name: "Basketball", path: "/" },
          { name: "All Shoes", path: "/" },
        ],
      },
      {
        nav: "Accessories",
        path: "/",
        items: [
          { name: "Socks", path: "/" },
          { name: "Sunglasses", path: "/" },
          { name: "Belts", path: "/" },
          { name: "Hats & Headwear", path: "/" },
          { name: "Bags & Backpacks", path: "/" },
        ],
      },
      {
        nav: "Clothing",
        path: "/",
        items: [
          { name: "Tops & Graphic Tees", path: "/" },
          { name: "Pants", path: "/" },
          { name: "Hoodies & Sweatshirts", path: "/" },
          { name: "Training & Gym", path: "/" },
          { name: "Shoes $100 & Under", path: "/" },
          { name: "Shorts", path: "/" },
          { name: "All Clothing", path: "/" },
        ],
      },
    ],
  },
  {
    name: "kids",
    path: "/",
    list: [
      {
        nav: "New & Featured",
        path: "/",
        items: [
          { name: "New Arrivals", path: "/" },
          { name: "Best Sellers", path: "/" },
          { name: "Latest Drops", path: "/" },
          { name: "Mothers Day Shop", path: "/" },
          { name: "Summer Shop", path: "/" },
          { name: "Shop All Sale", path: "/" },
        ],
      },
      {
        nav: "Shop by Color",
        path: "/",
        items: [
          { name: "Bold Blues", path: "/" },
          { name: "Neon Edit", path: "/" },
          { name: "Timeless Neutrals", path: "/" },
        ],
      },
      {
        nav: "Shop By Sport",
        path: "/",
        items: [
          { name: "Gymnastics", path: "/" },
          { name: "Basketball", path: "/" },
          { name: "Football", path: "/" },
          { name: "Running", path: "/" },
          { name: "Soccer", path: "/" },
        ],
      },
      {
        nav: "Shoes",
        path: "/",
        items: [
          { name: "Jordan", path: "/" },
          { name: "Lifestyle", path: "/" },
          { name: "Sandals & Slides", path: "/" },
          { name: "Training & Gym", path: "/" },
          { name: "Shoes $100 & Under", path: "/" },
          { name: "Basketball", path: "/" },
          { name: "Retro Running", path: "/" },
          { name: "Running", path: "/" },
          { name: "Soccer", path: "/" },
          { name: "All Shoes", path: "/" },
        ],
      },
      {
        nav: "Clothing",
        path: "/",
        items: [
          { name: "Tops & Graphic Tees", path: "/" },
          { name: "Pants", path: "/" },
          { name: "Hoodies & Sweatshirts", path: "/" },
          { name: "Training & Gym", path: "/" },
          { name: "Shorts", path: "/" },
          { name: "Bras", path: "/" },
          { name: "Jackets & Vests", path: "/" },
          { name: "Pants & Tights", path: "/" },
          { name: "Matching Sets", path: "/" },
          { name: "Skirts & Dresses", path: "/" },
          { name: "Jordan", path: "/" },
          { name: "All Clothing", path: "/" },
        ],
      },
      {
        nav: "Accessories",
        path: "/",
        items: [
          { name: "Socks", path: "/" },
          { name: "Sunglasses", path: "/" },
          { name: "Belts", path: "/" },
          { name: "Hats & Headwear", path: "/" },
          { name: "Bags & Backpacks", path: "/" },
        ],
      },
      {
        nav: "Shop by Age",
        path: "/",
        items: [
          { name: "Teen", path: "/" },
          { name: "Big Kids (7-15 yrs)", path: "/" },
          { name: "Little Kids (3-7 yrs)", path: "/" },
          { name: "Baby & Toddler (0-3 yrs)", path: "/" },
        ],
      },
    ],
  },
];
const Footer = () => {
  const [logo, setLogo] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeNav, setActiveNav] = useState(null);

  // Api
  const API_URL = `${import.meta.env.VITE_API_URL}`;
  const API_KEY = "6m4xzdzaslini9VEaU1JNhyQvMs";
  const STORAGE_URL = import.meta.env.VITE_STORAGE_URL;

  // Fetch logo
  useEffect(() => {
    const fetchLogo = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`${API_URL}/logos`, {
          headers: { "X-API-KEY": API_KEY },
        });
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

  const handleImageError = useCallback((e) => {
    console.warn("Image failed to load:", e.target.src);
    e.target.src = "https://via.placeholder.com/100?text=Fallback";
  }, []);

  return (
    <footer className="py-10">
      <div className="flex justify-center  py-10 ">
        <div className=" w-[80%] flex flex-col items-center">
          {/* Logo Section */}
          <div>
            {isLoading ? (
              <p>Loading logo...</p>
            ) : error ? (
              <p className="text-red-500">{error}</p>
            ) : logo.length > 0 ? (
              logo.map((item) => (
                <Link to="/" key={item.id} aria-label="Home">
                  <img
                    src={item.image}
                    alt="Logo"
                    className=" w-full h-auto"
                    onError={handleImageError}
                  />
                </Link>
              ))
            ) : (
              <Link to="/" aria-label="Home">
                <img
                  src="https://via.placeholder.com/100?text=Placeholder"
                  alt="Placeholder Logo"
                  className="w-[100px] h-auto"
                />
              </Link>
            )}
          </div>
          {/* User  */}
          <div className="py-[20px]">
            <ul className="flex">
              {user.map((item, index) => (
                <li
                  key={item.name}
                  className="hover:text-gray-500 px-4 text-sm font-[500]"
                >
                  <Link to={item.path}>{item.name}</Link>
                </li>
              ))}
            </ul>
          </div>
          {/* Footer nav */}

          {/* Navigation List */}
          <div className="py-3">
            <ul className="flex flex-wrap justify-between gap-[100px] text-sm bg-white font-medium">
              {nav.map((item, index) => (
                <li className="" key={index}>
                  <Link to={item.path} className="text-xl hover:text-gray-600 ">
                    {item.name}
                  </Link>
                  <ul className="text-gray-500">
                    {item.list.map((nestedItem, i) => (
                      <li
                        key={i}
                        className="hover:text-gray-900 hover:underline"
                      >
                        <Link
                          to={nestedItem.path}
                          className="block text-[13px] py-1 font-medium"
                        >
                          {nestedItem.nav}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <div className=" px-5 py-[100px]">
        <p className="border-t-1 border-[rgb(112,112,114)] py-4 text-sm font-[500] text-[rgb(112,112,114)]">© 2025,  All right reserved By Leng soknao And Rith </p>
      </div>
    </footer>
  );
};

export default Footer;
