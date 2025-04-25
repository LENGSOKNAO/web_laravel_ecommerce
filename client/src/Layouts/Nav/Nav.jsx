import axios from "axios";
import React, { useEffect, useState, useCallback, useMemo } from "react";
import { CiHeart, CiSearch, CiShoppingCart } from "react-icons/ci";
import { Link } from "react-router-dom";
import { VscAdd } from "react-icons/vsc";

// Custom debounce hook
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// Navigation data (unchanged from provided code)
const nav = [
  {
    name: "Electronics",
    path: "/",
    list: [
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
    ],
  },
  {
    name: "Fashion & Apparel",
    path: "/",
    list: [
      {
        nav: "Nike",
        path: "/",
        items: [
          { name: "New Arrivals", path: "/" },
          { name: "Sneakers", path: "/" },
          { name: "Apparel", path: "/" },
          { name: "Accessories", path: "/" },
          { name: "Sale", path: "/" },
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
    ],
  },
  {
    name: "Sports & Outdoors",
    path: "/",
    list: [
      {
        nav: "Nike",
        path: "/",
        items: [
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
          { name: "Baskbetall", path: "/" },
          { name: "Running Shoes", path: "/" },
          { name: "Golf", path: "/" },
          { name: "More Sport", path: "/" },
          { name: "Training", path: "/" },
          { name: "All Shop", path: "/" },
        ],
      },
      {
        nav: "Puma",
        path: "/",
        items: [
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
        nav: "NewBalance",
        path: "/",
        items: [
          { name: "New Arrivals", path: "/" },
          { name: "Baskbetall", path: "/" },
          { name: "Running Shoes", path: "/" },
          { name: "Golf", path: "/" },
          { name: "Soccer", path: "/" },
          { name: "Training", path: "/" },
          { name: "All Shop", path: "/" },
        ],
      },
    ],
  },
  {
    name: "Automotive",
    path: "/",
    list: [
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
    ],
  },
  {
    name: "Pets",
    path: "/",
    list: [
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
    ],
  },
  {
    name: "Jewelry & Watches",
    path: "/",
    list: [
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
    ],
  },
];

const user = [
  { name: "Find a Store", path: "/" },
  { name: "Help", path: "/" },
  { name: "Join Us", path: "/" },
  { name: "Sign In", path: "/" },
];

const icons = [
  { icon: <CiHeart />, path: "/wishlist", name: "Wishlist" },
  { icon: <CiShoppingCart />, path: "/cart", name: "Cart" },
];

const Nav = () => {
  const [logo, setLogo] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeNav, setActiveNav] = useState(null);
  const [search, setSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [productsError, setProductsError] = useState(null);
  const [searchHistory, setSearchHistory] = useState([]);

  const API_URL = `${import.meta.env.VITE_API_URL}`;
  const API_KEY = "6m4xzdzaslini9VEaU1JNhyQvMs";
  const STORAGE_URL = import.meta.env.VITE_STORAGE_URL;

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const searchLower = searchTerm.toLowerCase();
      const matchesProduct =
        product.name.toLowerCase().includes(searchLower) ||
        product.brand.toLowerCase().includes(searchLower) ||
        product.category.some((cat) => cat.toLowerCase().includes(searchLower));
      const matchesNav = nav.some((category) => {
        if (category.name.toLowerCase().includes(searchLower)) {
          return category.list.some((brand) =>
            product.brand.toLowerCase().includes(brand.nav.toLowerCase())
          );
        }
        return category.list.some(
          (brand) =>
            brand.nav.toLowerCase().includes(searchLower) &&
            product.brand.toLowerCase().includes(brand.nav.toLowerCase())
        );
      });
      return matchesProduct || matchesNav;
    });
  }, [products, searchTerm]);

  const getSearchSuggestions = useCallback(() => {
    const searchLower = searchTerm.toLowerCase().trim();
    if (!searchLower) return [];

    const suggestions = new Set();

    products.forEach((product) => {
      if (product.name.toLowerCase().includes(searchLower)) {
        suggestions.add(product.name.toLowerCase());
      }

      if (product.brand.toLowerCase().includes(searchLower)) {
        suggestions.add(product.brand.toLowerCase());
      }

      if (Array.isArray(product.category)) {
        product.category.forEach((cat) => {
          if (cat.toLowerCase().includes(searchLower)) {
            suggestions.add(cat.toLowerCase());
          }
        });
      }
    });

    if (searchLower.includes("bball") || searchLower.includes("basketball")) {
      suggestions.push("bball shoes", "kids' bball shoes");
    }

    return [...new Set(suggestions)]
      .sort((a, b) => {
        const aStartsWith = a.startsWith(searchLower);
        const bStartsWith = b.startsWith(searchLower);
        if (aStartsWith && !bStartsWith) return -1;
        if (!aStartsWith && bStartsWith) return 1;
        return a.localeCompare(b);
      })
      .slice(0, 5);
  }, [searchTerm]);

  const suggestions = useMemo(
    () => getSearchSuggestions(),
    [getSearchSuggestions]
  );

  // Highlight matching letters in suggestions
  const highlightMatch = (suggestion, search) => {
    if (!search) return suggestion;
    const searchLower = search.toLowerCase();
    const suggestionLower = suggestion.toLowerCase();
    const startIndex = suggestionLower.indexOf(searchLower);
    if (startIndex === -1) return suggestion;

    const beforeMatch = suggestion.slice(0, startIndex);
    const match = suggestion.slice(startIndex, startIndex + search.length);
    const afterMatch = suggestion.slice(startIndex + search.length);

    return (
      <>
        {beforeMatch}
        <span className="text-[rgb(41,0,0)] ">{match}</span>
        {afterMatch}
      </>
    );
  };

  // Load search history from localStorage
  useEffect(() => {
    const storedHistory = localStorage.getItem("searchHistory");
    if (storedHistory) {
      setSearchHistory(JSON.parse(storedHistory));
    }
  }, []);

  // Save search data to localStorage
  useEffect(() => {
    if (
      debouncedSearchTerm.trim() &&
      debouncedSearchTerm.length >= 2 &&
      filteredProducts.length > 0
    ) {
      const newSearchEntry = {
        term: debouncedSearchTerm,
        productIds: filteredProducts.map((product) => product.id),
        timestamp: new Date().toISOString(),
      };
      const updatedHistory = [
        newSearchEntry,
        ...searchHistory.filter((entry) => entry.term !== debouncedSearchTerm),
      ].slice(0, 10);
      setSearchHistory(updatedHistory);
      localStorage.setItem("searchHistory", JSON.stringify(updatedHistory));
    }
  }, [debouncedSearchTerm, filteredProducts]);

  // Delete all search history
  const handleDeleteHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem("searchHistory");
  };

  // Delete a specific search history entry
  const handleDeleteSearchEntry = (termToDelete) => {
    const updatedHistory = searchHistory.filter(
      (entry) => entry.term !== termToDelete
    );
    setSearchHistory(updatedHistory);
    localStorage.setItem("searchHistory", JSON.stringify(updatedHistory));
  };

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

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      setProductsLoading(true);
      try {
        const response = await axios.get(`${API_URL}/products`, {
          headers: { "X-API-KEY": API_KEY },
        });
        const mappedProducts = response.data.data.map((product) => ({
          id: product.id,
          name: product.name || "Unnamed Product",
          image: product.image
            ? `${STORAGE_URL}/${product.image}`
            : "https://via.placeholder.com/200?text=Product",
          brand: product.brand || "-",
          category: product.category || [],
          price: product.sale_price || 0,
          r_price: product.regular_price || 0,
          discount: product.discount || 0,
          publishedOn: product.created_at
            ? new Date(product.created_at).toLocaleString()
            : "-",
        }));
        setProducts(mappedProducts);
        setProductsError(null);
      } catch (err) {
        setProductsError("Failed to fetch products. Please try again.");
        console.error("Error fetching products:", err);
      } finally {
        setProductsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleImageError = useCallback((e) => {
    console.warn("Image failed to load:", e.target.src);
    e.target.src = "https://via.placeholder.com/100?text=Fallback";
  }, []);

  return (
    <header className="z-50 relative">
      {/* Top nav */}
      <div className="bg-gray-100">
        <ul className="flex justify-end items-center text-xs gap-2 px-5 py-2">
          {user.map((item, index) => (
            <li
              key={item.name}
              className={`relative hover:text-gray-500 px-4 text-[13px] font-semibold ${
                index !== 0
                  ? "before:content-[''] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:h-4 before:w-[1px] before:bg-gray-600"
                  : ""
              }`}
            >
              <Link to={item.path}>{item.name}</Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Main nav */}
      <nav className="flex items-center justify-between px-10 py-5">
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
                  className="w-[100px] h-auto"
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

        {/* Navigation List */}
        <div>
          <ul className="flex gap-7 text-sm bg-white px-5 py-3 rounded-full font-medium">
            {nav.map((item, index) => (
              <li
                onMouseEnter={() => setActiveNav(index)}
                className=""
                key={item.name}
              >
                <Link className="z-50" to={item.path}>
                  {item.name}
                </Link>
                {item.list && activeNav === index && (
                  <div className="absolute top-0 right-0 left-0 w-full z-[-1]">
                    <div className="absolute inset-0 w-screen h-screen bg-[rgba(0,0,0,0.1)] z-[-3]"></div>
                    <div
                      onMouseLeave={() => setActiveNav(null)}
                      data-aos="fade-down"
                      data-aos-easing="linear"
                      data-aos-duration="200"
                      className="max-h-[50vh] overflow-y-auto bg-white py-[150px]"
                    >
                      <div className="flex justify-center w-full">
                        <ul className="flex flex-wrap justify-between px-7 w-[60%] gap-[10px_100px]">
                          {item.list.map((subItem) => (
                            <li key={subItem.nav}>
                              <Link
                                to={subItem.path}
                                className="block text-[15px] font-semibold py-2 hover:text-gray-700"
                              >
                                {subItem.nav}
                              </Link>
                              {subItem.items && (
                                <ul className="text-gray-500">
                                  {subItem.items.map((nestedItem) => (
                                    <li
                                      key={nestedItem.name}
                                      className="hover:text-gray-900 hover:underline"
                                    >
                                      <Link
                                        to={nestedItem.path}
                                        className="block text-[13px] py-1 font-medium"
                                      >
                                        {nestedItem.name}
                                      </Link>
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* Icon Links */}
        <ul className="flex items-center gap-2  text-3xl  ">
          <li>
            <button
              onClick={() => setSearch((s) => !s)}
              aria-label="Toggle search"
              className="flex items-center"
            >
              <CiSearch />
            </button>
          </li>
          {icons.map((item) => (
            <li key={item.name}>
              <Link to={item.path} aria-label={item.name}>
                {item.icon}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Search Panel */}
      {search && (
        <div className="absolute top-0 right-0 left-0 w-full bg-white">
          <div className="absolute inset-0 w-screen h-screen bg-[rgba(0,0,0,0.1)] z-[-3]"></div>
          <div
            data-aos="fade-down"
            data-aos-easing="linear"
            data-aos-duration="200"
            className="bg-white h-[50vh]  "
          >
            <div className="flex justify-between items-center px-10 py-3">
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
                        className="w-[100px] h-auto"
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
              <div className="flex items-center bg-gray-100 hover:bg-[rgb(0,0,0,0.1)] text-lg rounded-4xl">
                <CiSearch className="text-4xl p-1 bg-gray-100 hover:bg-[rgb(0,0,0,0.1)] rounded-4xl" />
                <input
                  aria-label="Search products"
                  className="w-[50vw] border-none outline-none font-semibold text-[14px]"
                  type="text"
                  placeholder="Search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  autoFocus
                />
              </div>
              <div
                onClick={() => {
                  setSearch(false);
                  setSearchTerm("");
                }}
                className="text-lg hover:text-gray-600 font-semibold cursor-pointer"
                role="button"
                tabIndex={0}
                aria-label="Close search"
              >
                Cancel
              </div>
            </div>
            {/* Search Results and Suggestions */}
            <div className="px-10 py-5 max-h-[50vh] overflow-y-auto bg-white">
              {productsLoading ? (
                <p>Loading products...</p>
              ) : productsError ? (
                <p className="text-red-500">{productsError}</p>
              ) : searchTerm.trim() === "" ? (
                <div>
                  {searchHistory.length > 0 && (
                    <div className="flex justify-center">
                      <div className="mb-6 w-1/2">
                        <div className="flex justify-between items-center">
                          <h4 className="text-md text-sm py-2 text-gray-400 font-medium mb-2">
                            Recent Searches
                          </h4>
                          <button
                            onClick={handleDeleteHistory}
                            className="text-sm text-gray-500 hover:text-gray-700"
                            aria-label="Clear search history"
                          >
                            Clear All
                          </button>
                        </div>
                        <ul className="">
                          {searchHistory.map((entry) => (
                            <li
                              key={entry.term}
                              className="flex items-center justify-between px-3 py-1 text-sm"
                            >
                              <span
                                className="cursor-pointer text-2xl hover:text-gray-600"
                                onClick={() => setSearchTerm(entry.term)}
                                role="button"
                                tabIndex={0}
                                aria-label={`Search for ${entry.term}`}
                              >
                                {entry.term}
                              </span>
                              <button
                                onClick={() =>
                                  handleDeleteSearchEntry(entry.term)
                                }
                                className="ml-2 text-2xl text-gray-500 hover:text-gray-400 rounded-2xl cursor-pointer"
                                aria-label={`Delete search term ${entry.term}`}
                              >
                                <VscAdd />
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex">
                  {/* Suggestions Section */}
                  <div className="w-1/7 ">
                    <h4 className="text-[14px] font-[300] py-2 text-gray-400 mb-2">
                      Top Suggestions
                    </h4>
                    {suggestions.length > 0 ? (
                      <ul className="">
                        {suggestions.map((suggestion, index) => (
                          <li
                            key={index}
                            className="text-lg font-[300] text-[rgb(147,147,144)] hover:underline cursor-pointer capitalize"
                            onClick={() => setSearchTerm(suggestion)}
                            role="button"
                            tabIndex={0}
                            aria-label={`Select suggestion ${suggestion}`}
                          >
                            {highlightMatch(suggestion, searchTerm)}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-gray-500">
                        No suggestions found.
                      </p>
                    )}
                  </div>
                  {/* Product Results Section */}
                  <div className="w-full">
                    {filteredProducts.length > 0 ? (
                      <div className="flex flex-wrap gap-5">
                        {filteredProducts.map((product) => (
                          <Link
                            to={`/product/${product.id}`}
                            key={product.id}
                            className="rounded-lg"
                            aria-label={`View ${product.name}`}
                          >
                            <img
                              src={product.image}
                              alt={product.name}
                              className=" w-[270px] h-[300px] object-cover mb-2"
                              onError={handleImageError}
                            />
                            <h3 className="text-xl   font-[500] ">
                              {product.name}
                            </h3>
                            <p className="text-sm py-1 text-gray-500">
                              {product.brand}
                            </p>
                            <p className="text-md flex font-medium">
                              ${product.price}
                              {product.discount > 0 && (
                                <div className="">
                                  <span className="text-red-500 text-xs ml-2">
                                    {product.discount}% off
                                  </span>
                                </div>
                              )}
                              {product.r_price > 0 && (
                                <div className="">
                                  <span className="text-xs ml-2 line-through">
                                    ${product.r_price}
                                  </span>
                                </div>
                              )}
                            </p>
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <p>No products found for "{searchTerm}".</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Nav;
