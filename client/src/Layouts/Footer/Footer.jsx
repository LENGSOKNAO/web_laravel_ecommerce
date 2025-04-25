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
    nav: "Apple",
    path: "/",
    items: [
      { name: "New Arrivals", path: "/" },
      { name: "iPhone", path: "/" },
      { name: "iPad", path: "/" },
      { name: "Watch", path: "/" },
      { name: "AirPods", path: "/" },
      { name: "TV & Home", path: "/" },
      { name: "All Shop", path: "/" },
    ],
  },
  {
    nav: "Samsung",
    path: "/",
    items: [
      { name: "New Arrivals", path: "/" },
      { name: "Galaxy Phones", path: "/" },
      { name: "Galaxy Tablets", path: "/" },
      { name: "Galaxy Watch", path: "/" },
      { name: "Galaxy Buds", path: "/" },
      { name: "TV & Audio", path: "/" },
      { name: "All Shop", path: "/" },
    ],
  },
  {
    nav: "Xiaomi",
    path: "/",
    items: [
      { name: "New Arrivals", path: "/" },
      { name: "Mi Phones", path: "/" },
      { name: "Redmi Phones", path: "/" },
      { name: "Smartwatches", path: "/" },
      { name: "Earbuds", path: "/" },
      { name: "Tablets", path: "/" },
      { name: "All Shop", path: "/" },
    ],
  },
  {
    nav: "Oppo",
    path: "/",
    items: [
      { name: "New Arrivals", path: "/" },
      { name: "Find Series", path: "/" },
      { name: "Reno Series", path: "/" },
      { name: "Smartwatches", path: "/" },
      { name: "Earbuds", path: "/" },
      { name: "Tablets", path: "/" },
      { name: "All Shop", path: "/" },
    ],
  },
  {
    nav: "OnePlus",
    path: "/",
    items: [
      { name: "New Arrivals", path: "/" },
      { name: "Number Series", path: "/" },
      { name: "Nord Series", path: "/" },
      { name: "Smartwatches", path: "/" },
      { name: "Earbuds", path: "/" },
      { name: "Tablets", path: "/" },
      { name: "All Shop", path: "/" },
    ],
  },
  {
    nav: "Nike",
    path: "/",
    items: [
      { name: "New Arrivals", path: "/" },
      { name: "Sneakers", path: "/" },
      { name: "Apparel", path: "/" },
      { name: "Accessories", path: "/" },
      { name: "Sale", path: "/" },
      { name: "New Arrivals", path: "/" },
      { name: "Baskbetall", path: "/" },
      { name: "Running Shoes", path: "/" },
      { name: "Golf", path: "/" },
      { name: "Training", path: "/" },
      { name: "All Shop", path: "/" },
    ],
  },
  {
    nav: "Adidas",
    path: "/",
    items: [
      { name: "New Arrivals", path: "/" },
      { name: "Sneakers", path: "/" },
      { name: "Apparel", path: "/" },
      { name: "Originals", path: "/" },
      { name: "Accessories", path: "/" },
      { name: "Sale", path: "/" },
      { name: "New Arrivals", path: "/" },
      { name: "Baskbetall", path: "/" },
      { name: "Running Shoes", path: "/" },
      { name: "Golf", path: "/" },
      { name: "More Sport", path: "/" },
      { name: "Training", path: "/" },
      { name: "All Shop", path: "/" },
    ],
  },
  {
    nav: "NewBalance",
    path: "/",
    items: [
      { name: "New Arrivals", path: "/" },
      { name: "Lifestyle Shoes", path: "/" },
      { name: "Apparel", path: "/" },
      { name: "Accessories", path: "/" },
      { name: "Sale", path: "/" },
      { name: "New Arrivals", path: "/" },
      { name: "Basketball Shoes", path: "/" },
      { name: "Apparel", path: "/" },
      { name: "Sportswear", path: "/" },
      { name: "Accessories", path: "/" },
      { name: "Sale", path: "/" },
      { name: "All Shop", path: "/" },
    ],
  },
  {
    nav: "Puma",
    path: "/",
    items: [
      { name: "New Arrivals", path: "/" },
      { name: "Sneakers", path: "/" },
      { name: "Apparel", path: "/" },
      { name: "Sportswear", path: "/" },
      { name: "Accessories", path: "/" },
      { name: "Sale", path: "/" },
      { name: "New Arrivals", path: "/" },
      { name: "Baskbetall", path: "/" },
      { name: "Running Shoes", path: "/" },
      { name: "Golf", path: "/" },
      { name: "Motorsport", path: "/" },
      { name: "More Sport", path: "/" },
      { name: "Training", path: "/" },
      { name: "All Shop", path: "/" },
    ],
  },
  {
    nav: "Qiaodan",
    path: "/",
    items: [
      { name: "New Arrivals", path: "/" },
      { name: "Basketball Shoes", path: "/" },
      { name: "Apparel", path: "/" },
      { name: "Sportswear", path: "/" },
      { name: "Accessories", path: "/" },
      { name: "Sale", path: "/" },
      { name: "All Shop", path: "/" },
    ],
  },
  {
    nav: "Tesla",
    path: "/",
    items: [
      { name: "New Arrivals", path: "/" },
      { name: "Electric Vehicles", path: "/" },
      { name: "Charging Solutions", path: "/" },
      { name: "Accessories", path: "/" },
      { name: "Apparel", path: "/" },
      { name: "Sale", path: "/" },
      { name: "All Shop", path: "/" },
    ],
  },
  {
    nav: "BMW",
    path: "/",
    items: [
      { name: "New Arrivals", path: "/" },
      { name: "Vehicles", path: "/" },
      { name: "Performance Parts", path: "/" },
      { name: "Accessories", path: "/" },
      { name: "Apparel", path: "/" },
      { name: "Sale", path: "/" },
      { name: "All Shop", path: "/" },
    ],
  },
  {
    nav: "Mercedes-Benz",
    path: "/",
    items: [
      { name: "New Arrivals", path: "/" },
      { name: "Vehicles", path: "/" },
      { name: "Luxury Accessories", path: "/" },
      { name: "Parts", path: "/" },
      { name: "Apparel", path: "/" },
      { name: "Sale", path: "/" },
      { name: "All Shop", path: "/" },
    ],
  },
  {
    nav: "Toyota",
    path: "/",
    items: [
      { name: "New Arrivals", path: "/" },
      { name: "Vehicles", path: "/" },
      { name: "Hybrid Models", path: "/" },
      { name: "Accessories", path: "/" },
      { name: "Apparel", path: "/" },
      { name: "Sale", path: "/" },
      { name: "All Shop", path: "/" },
    ],
  },
  {
    nav: "Ford",
    path: "/",
    items: [
      { name: "New Arrivals", path: "/" },
      { name: "Trucks", path: "/" },
      { name: "Performance Parts", path: "/" },
      { name: "Accessories", path: "/" },
      { name: "Apparel", path: "/" },
      { name: "Sale", path: "/" },
      { name: "All Shop", path: "/" },
    ],
  },

  {
    nav: "PetSmart",
    path: "/",
    items: [
      { name: "New Arrivals", path: "/" },
      { name: "Pet Food", path: "/" },
      { name: "Toys", path: "/" },
      { name: "Grooming", path: "/" },
      { name: "Accessories", path: "/" },
      { name: "Sale", path: "/" },
      { name: "All Shop", path: "/" },
    ],
  },
  {
    nav: "Petco",
    path: "/",
    items: [
      { name: "New Arrivals", path: "/" },
      { name: "Pet Food", path: "/" },
      { name: "Toys", path: "/" },
      { name: "Health & Wellness", path: "/" },
      { name: "Accessories", path: "/" },
      { name: "Sale", path: "/" },
      { name: "All Shop", path: "/" },
    ],
  },
  {
    nav: "Chewy",
    path: "/",
    items: [
      { name: "New Arrivals", path: "/" },
      { name: "Pet Food", path: "/" },
      { name: "Toys", path: "/" },
      { name: "Pharmacy", path: "/" },
      { name: "Accessories", path: "/" },
      { name: "Sale", path: "/" },
      { name: "All Shop", path: "/" },
    ],
  },
  {
    nav: "Ruffwear",
    path: "/",
    items: [
      { name: "New Arrivals", path: "/" },
      { name: "Dog Gear", path: "/" },
      { name: "Harnesses", path: "/" },
      { name: "Leashes", path: "/" },
      { name: "Accessories", path: "/" },
      { name: "Sale", path: "/" },
      { name: "All Shop", path: "/" },
    ],
  },
  {
    nav: "Kurgo",
    path: "/",
    items: [
      { name: "New Arrivals", path: "/" },
      { name: "Travel Gear", path: "/" },
      { name: "Harnesses", path: "/" },
      { name: "Toys", path: "/" },
      { name: "Accessories", path: "/" },
      { name: "Sale", path: "/" },
      { name: "All Shop", path: "/" },
    ],
  },

  {
    nav: "Rolex",
    path: "/",
    items: [
      { name: "New Arrivals", path: "/" },
      { name: "Watches", path: "/" },
      { name: "Jewelry", path: "/" },
      { name: "Luxury Collections", path: "/" },
      { name: "Accessories", path: "/" },
      { name: "Sale", path: "/" },
      { name: "All Shop", path: "/" },
    ],
  },
  {
    nav: "Cartier",
    path: "/",
    items: [
      { name: "New Arrivals", path: "/" },
      { name: "Watches", path: "/" },
      { name: "Jewelry", path: "/" },
      { name: "Love Collection", path: "/" },
      { name: "Accessories", path: "/" },
      { name: "Sale", path: "/" },
      { name: "All Shop", path: "/" },
    ],
  },
  {
    nav: "Tiffany & Co.",
    path: "/",
    items: [
      { name: "New Arrivals", path: "/" },
      { name: "Jewelry", path: "/" },
      { name: "Watches", path: "/" },
      { name: "Engagement", path: "/" },
      { name: "Accessories", path: "/" },
      { name: "Sale", path: "/" },
      { name: "All Shop", path: "/" },
    ],
  },
  {
    nav: "Patek Philippe",
    path: "/",
    items: [
      { name: "New Arrivals", path: "/" },
      { name: "Watches", path: "/" },
      { name: "Complications", path: "/" },
      { name: "Jewelry", path: "/" },
      { name: "Accessories", path: "/" },
      { name: "Sale", path: "/" },
      { name: "All Shop", path: "/" },
    ],
  },
  {
    nav: "Pandora",
    path: "/",
    items: [
      { name: "New Arrivals", path: "/" },
      { name: "Charms", path: "/" },
      { name: "Jewelry", path: "/" },
      { name: "Bracelets", path: "/" },
      { name: "Accessories", path: "/" },
      { name: "Sale", path: "/" },
      { name: "All Shop", path: "/" },
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
    <footer className="flex justify-center   ">
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
                  className=" w-[120px] h-auto"
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
        <div className="py-[30px]" >
          <ul className="flex   ">
            {user.map((item, index) => (
              <li
                key={item.name}
                className="hover:text-gray-500 px-4 text-md font-[500]"
              >
                <Link to={item.path}>{item.name}</Link>
              </li>
            ))}
          </ul>
        </div>
        {/* Footer nav */}

        {/* Navigation List */}
        <div className="py-[50px]">
          <ul className="flex flex-wrap justify-between gap-[50px] text-sm bg-white font-medium">
            {nav.map((item, index) => (
              <li className="" key={index}>
                <Link to={item.path} className="text-xl hover:text-gray-600 " >{item.nav}</Link>

                <ul className="text-gray-500">
                  {item.items.map((nestedItem, i) => (
                    <li key={i} className="hover:text-gray-900 hover:underline">
                      <Link
                        to={nestedItem.path}
                        className="block text-[13px] py-1 font-medium"
                      >
                        {nestedItem.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
