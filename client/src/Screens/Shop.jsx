import React, { useEffect, useState, useMemo, useCallback } from "react";
import Layout from "../Layouts/Layout";
import axios from "axios";
import { Link, useSearchParams } from "react-router-dom";
import { FiChevronDown } from "react-icons/fi";

// Category map with added categories
const categoryMap = {
  // New Section
  "New New & Featured": "new",
  "New New Arrivals": "new_arrivals",
  "New Best Sellers": "best_sellers",
  "New Shop All Sale": "sale",
  "New Gender": "gender",
  "New Men's": "men",
  "New Women's": "women",
  "New Kid's": "kids",
  "New Trending": "trending",

  // Men Section
  "Men New & Featured": "men_new",
  "Men New Arrivals": "men_new_arrivals",
  "Men Best Sellers": "men_best_sellers",
  "Men Latest Drops": "men_latest_drops",
  "Men Summer Shop": "men_summer",
  "Men Shop All Sale": "men_sale",
  "Men Shoes": "men_shoes",
  "Men All Shoes": "men_shoes",
  "Men Basketball": "men_basketball",
  "Men Basketball Shoes": "men_basketball_shoes", // Added
  "Men Lifestyle": "men_lifestyle",
  "Men Jordan": "men_jordan",
  "Men Retro Running": "men_retro_running",
  "Men Running": "men_running",
  "Men Sandals & Slides": "men_sandals_slides",
  "Men Shoes $100 & Under": "men_shoes_100_under",
  "Men Training & Gym": "men_training",
  "Men Clothing": "men_clothing",
  "Men All Clothing": "men_clothing",
  "Men Hoodies & Sweatshirts": "men_hoodies_sweatshirts",
  "Men Jordan": "men_jordan_clothing",
  "Men Jackets & Vests": "men_jackets_vests",
  "Men Matching Sets": "men_matching_sets",
  "Men Pants": "men_pants",
  "Men Shorts": "men_shorts",
  "Men Tops & Graphic Tees": "men_tops_graphic_tees",
  "Men 24.7 Collection": "men_24_7_collection",
  "Men Accessories": "men_accessories",
  "Men Bags & Backpacks": "men_bags_backpacks",
  "Men Hats & Headwear": "men_hats_headwear",
  "Men Socks": "men_socks",
  "Men Sunglasses": "men_sunglasses",
  "Men Belts": "men_belts",

  // Women Section
  "Women New & Featured": "women_new",
  "Women New Arrivals": "women_new_arrivals",
  "Women Best Sellers": "women_best_sellers",
  "Women Latest Drops": "women_latest_drops",
  "Women Nike Style By": "women_nike_style_by",
  "Women Summer Shop": "women_summer",
  "Women Shop All Sale": "women_sale",
  "Women Shop by Color": "women_color",
  "Women Bold Blues": "women_bold_blues",
  "Women Peachy Picks": "women_peachy_picks",
  "Women Purple Pops": "women_purple_picks",
  "Women Neon Edit": "women_neon_edit",
  "Women Timeless Neutrals": "women_timeless_neutrals",
  "Women Shoes": "women_shoes",
  "Women All Shoes": "women_shoes",
  "Women Basketball": "women_basketball",
  "Women Basketball Shoes": "women_basketball_shoes", // Added
  "Women Lifestyle": "women_lifestyle",
  "Women Jordan": "women_jordan",
  "Women Retro Running": "women_retro_running",
  "Women Running": "women_running",
  "Women Sandals & Slides": "women_sandals_slides",
  "Women Shoes $100 & Under": "women_shoes_100_under",
  "Women Training & Gym": "women_training",
  "Women Clothing": "women_clothing",
  "Women All Clothing": "women_clothing",
  "Women Bras": "women_bras",
  "Women Hoodies & Sweatshirts": "women_hoodies_sweatshirts",
  "Women Leggings": "women_leggings",
  "Women Matching Sets": "women_matching_sets",
  "Women Jackets & Vests": "women_jackets_vests",
  "Women Pants": "women_pants",
  "Women Skirts & Dresses": "women_skirts_dresses",
  "Women Shorts": "women_shorts",
  "Women Tops & T-Shirts": "women_tops_tshirts",
  "Women 24.7 Collection": "women_24_7_collection",
  "Women Accessories": "women_accessories",
  "Women Bags & Backpacks": "women_bags_backpacks",
  "Women Hats & Headwear": "women_hats_headwear",
  "Women Socks": "women_socks",
  "Women Sunglasses": "women_sunglasses",
  "Women Belts": "women_belts",

  // Kids Section
  "Kids New & Featured": "kids_new",
  "Kids New Arrivals": "kids_new_arrivals",
  "Kids Best Sellers": "kids_best_sellers",
  "Kids Latest Drops": "kids_latest_drops",
  "Kids Summer Shop": "kids_summer",
  "Kids Shop All Sale": "kids_sale",
  "Kids Shop By Sport": "kids_sport",
  "Kids Gymnastics": "kids_gymnastics",
  "Kids Basketball": "kids_basketball",
  "Kids Football": "kids_football",
  "Kids Running": "kids_running",
  "Kids Soccer": "kids_soccer",
  "Kids Shoes": "kids_shoes",
  "Kids All Shoes": "kids_shoes",
  "Kids Basketball": "kids_basketball",
  "Kids Lifestyle": "kids_lifestyle",
  "Kids Jordan": "kids_jordan",
  "Kids Retro Running": "kids_retro_running",
  "Kids Running": "kids_running",
  "Kids Sandals & Slides": "kids_sandals_slides",
  "Kids Shoes $80 & Under": "kids_shoes_80_under",
  "Kids Soccer": "kids_soccer_shoes",
  "Kids Clothing": "kids_clothing",
  "Kids All Clothing": "kids_clothing",
  "Kids Bras": "kids_bras",
  "Kids Hoodies & Sweatshirts": "kids_hoodies_sweatshirts",
  "Kids Jordan": "kids_jordan_clothing",
  "Kids Matching Sets": "kids_matching_sets",
  "Kids Jackets & Vests": "kids_jackets_vests",
  "Kids Pants & Tights": "kids_pants_tights",
  "Kids Shorts": "kids_shorts",
  "Kids Skirts & Dresses": "kids_skirts_dresses",
  "Kids Tops & T-Shirts": "kids_tops_tshirts",
  "Kids Shop by Age": "kids_age",
  "Kids Teen": "kids_teen",
  "Kids Big Kids (7-15 yrs)": "kids_7_15_years",
  "Kids Little Kids (3-7 yrs)": "kids_3_7_years",
  "Kids Baby & Toddler (0-3 yrs)": "kids_0_3_years",
  "Kids Accessories": "kids_accessories",
  "Kids Bags & Backpacks": "kids_bags_backpacks",
  "Kids Hats & Headwear": "kids_hats_headwear",
  "Kids Socks": "kids_socks",
  "Kids Sunglasses": "kids_sunglasses",
  "Kids Belts": "kids_belts",

  // Sport Section
  "Sport Basketball": "sport_basketball",
  "Sport Basketball Shoes": "sport_basketball_shoes",
  "Sport Basketball Apparel": "sport_basketball_apparel",
  "Sport Basketball Equipment": "sport_basketball_equipment",
  "Sport Basketball Kobe": "sport_kobe",
  "Sport Basketball Jordan": "sport_jordan",
  "Sport Basketball NBA Gear": "sport_nba_gear",
  "Sport Basketball WNBA Gear": "sport_wnba_gear",
  "Sport Basketball NCAA Gear": "sport_ncaa_gear",
  "Sport Training": "sport_training",
  "Sport Training Shoes": "sport_training_shoes",
  "Sport Training Socks": "sport_training_socks",
  "Sport Training Apparel": "sport_training_apparel",
  "Sport Training Equipment": "sport_training_equipment",
  "Sport Running": "sport_running",
  "Sport Running Road": "sport_road",
  "Sport Running Race": "sport_race",
  "Sport Running Trail": "sport_trail",
  "Sport Running Track & Field": "sport_track_field",
  "Sport Running Apparel": "sport_running_apparel",
  "Sport Running Equipment": "sport_running_equipment",
  "Sport Running Stride & Swift Collection": "sport_stride_swift_collection",
  "Sport Running Running Shoe Finder": "sport_running_shoe_finder",
  "Sport Golf": "sport_golf",
  "Sport Golf Championship Gear": "sport_championship_gear",
  "Sport Golf Shoes": "sport_golf_shoes",
  "Sport Golf Apparel": "sport_golf_apparel",
  "Sport Golf Equipment": "sport_golf_equipment",
  "Sport Soccer": "sport_soccer",
  "Sport Soccer Cleats": "sport_cleats",
  "Sport Soccer Indoor Footwear": "sport_indoor_footwear",
  "Sport Soccer Apparel": "sport_soccer_apparel",
  "Sport Soccer Equipment": "sport_soccer_equipment",
  "Sport Soccer National Team Gear": "sport_national_team_gear",
  "Sport Soccer Club Team Gear": "sport_club_team_gear",
  "Sport Soccer NWSL Gear": "sport_nwsl_gear",
  "Sport More Sports": "sport_more",
  "Sport Baseball": "sport_baseball",
  "Sport Cheer": "sport_cheer",
  "Sport Fan Gear": "sport_fan_gear",
  "Sport Football": "sport_football",
  "Sport Gymnastics": "sport_gymnastics",
  "Sport Lacrosse": "sport_lacrosse",
  "Sport Pickleball": "sport_pickleball",
  "Sport Skateboarding": "sport_skateboarding",
  "Sport Softball": "sport_softball",
  "Sport Swimming": "sport_swimming",
  "Sport Tennis": "sport_tennis",
  "Sport Volleyball": "sport_volleyball",
  "Sport Wrestling": "sport_wrestling",
  "Sport Shoes": "sport_shoes", // Added
};

// Custom debounce function
function debounce(func, wait) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

// Generate category combinations based on API categories and categoryMap
const generateCategoryCombinations = (categories) => {
  if (!Array.isArray(categories) || categories.length === 0) {
    return ["uncategorized"];
  }

  const combos = new Set();
  const normalizedCategories = categories
    .filter((cat) => typeof cat === "string")
    .map((cat) => cat.toLowerCase());

  // Map API categories to categoryMap values
  const mappedCategories = normalizedCategories.map((cat) => {
    // Handle synonyms or slight variations
    if (cat === "man") return "men";
    if (cat === "woman") return "women";
    if (cat === "kid") return "kids";
    return cat;
  });

  // Single categories
  mappedCategories.forEach((cat) => {
    const mappedCat = Object.keys(categoryMap).find(
      (key) => categoryMap[key] === cat
    );
    if (mappedCat) {
      combos.add(categoryMap[mappedCat]);
    }
  });

  // Two-part combinations (e.g., men_shoes, women_shoes, sport_shoes)
  for (let i = 0; i < mappedCategories.length; i++) {
    for (let j = 0; j < mappedCategories.length; j++) {
      if (i !== j) {
        // Try both orders (e.g., men_shoes and shoes_men)
        const combo1 = `${mappedCategories[i]}_${mappedCategories[j]}`;
        const combo2 = `${mappedCategories[j]}_${mappedCategories[i]}`;
        const mappedCombo1 = Object.keys(categoryMap).find(
          (key) => categoryMap[key] === combo1
        );
        const mappedCombo2 = Object.keys(categoryMap).find(
          (key) => categoryMap[key] === combo2
        );
        if (mappedCombo1) {
          combos.add(categoryMap[mappedCombo1]);
        }
        if (mappedCombo2) {
          combos.add(categoryMap[mappedCombo2]);
        }
      }
    }
  }

  // Three-part combinations for sport-related categories
  const genderPrefixes = ["men", "women", "kids"];
  const sportPrefixes = ["sport"];
  const sports = ["basketball", "running", "soccer", "golf"];
  const productTypes = ["shoes", "clothing", "apparel"];

  genderPrefixes.forEach((gender) => {
    if (mappedCategories.includes(gender)) {
      sports.forEach((sport) => {
        if (mappedCategories.includes(sport)) {
          productTypes.forEach((type) => {
            if (mappedCategories.includes(type)) {
              const combo = `${gender}_${sport}_${type}`;
              const mappedCombo = Object.keys(categoryMap).find(
                (key) => categoryMap[key] === combo
              );
              if (mappedCombo) {
                combos.add(categoryMap[mappedCombo]);
              }
            }
          });
        }
      });
    }
  });

  sportPrefixes.forEach((sportPrefix) => {
    if (mappedCategories.includes(sportPrefix)) {
      sports.forEach((sport) => {
        if (mappedCategories.includes(sport)) {
          productTypes.forEach((type) => {
            if (mappedCategories.includes(type)) {
              const combo = `${sportPrefix}_${sport}_${type}`;
              const mappedCombo = Object.keys(categoryMap).find(
                (key) => categoryMap[key] === combo
              );
              if (mappedCombo) {
                combos.add(categoryMap[mappedCombo]);
              }
            }
          });
        }
      });
    }
  });

  return combos.size > 0 ? Array.from(combos) : ["uncategorized"];
};

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState(() => {
    const savedFilters = localStorage.getItem("shopFilters");
    const initialFilters = savedFilters
      ? JSON.parse(savedFilters)
      : {
          category: [],
          brand: [],
          color: [],
          size: [],
          priceRange: { min: "", max: "" },
          search: "",
        };
    const categoryFromUrl = searchParams.get("category");
    if (categoryFromUrl) {
      initialFilters.category = [categoryFromUrl.toLowerCase()];
    }
    return initialFilters;
  });
  const [hoveredProduct, setHoveredProduct] = useState(null);
  const [mainImages, setMainImages] = useState({});
  const [hoveredVariantId, setHoveredVariantId] = useState(null);
  const [openFilter, setOpenFilter] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFiltering, setIsFiltering] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOption, setSortOption] = useState("name-asc");
  const productsPerPage = 9;
  const [debugMode] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL;
  const API_KEY = "6m4xzdzaslini9VEaU1JNhyQvMs";
  const STORAGE_URL = import.meta.env.VITE_STORAGE_URL;

  // Reverse categoryMap for display names
  const reverseCategoryMap = useMemo(() => {
    const reverse = {};
    Object.entries(categoryMap).forEach(([key, value]) => {
      reverse[value] = key;
    });
    return reverse;
  }, []);

  // Filter list with categories from categoryMap
  const [filterList, setFilterList] = useState([
    {
      name: "Gender",
      type: "checkbox",
      filterType: "category",
      options: [
        { id: "men", name: "Men" },
        { id: "women", name: "Women" },
        { id: "boys", name: "Boys" },
        { id: "girls", name: "Girls" },
        { id: "unisex", name: "Unisex" },
      ],
    },
    {
      name: "Kids",
      type: "checkbox",
      filterType: "category",
      options: [
        { id: "boy", name: "Boys" },
        { id: "girl", name: "Girls" },
      ],
    },
    {
      name: "Kids Age",
      type: "checkbox",
      filterType: "category",
      options: [
        { id: "0_3_years", name: "Baby & Toddler (0-3 yrs)" },
        { id: "3_7_years", name: "Little Kids (3-7 yrs)" },
        { id: "7_15_years", name: "Big Kids (7-15 yrs)" },
        { id: "teen", name: "Teen" },
      ],
    },
    {
      name: "Brand",
      type: "checkbox",
      filterType: "brand",
      options: [
        { id: "nike", name: "Nike" },
        { id: "adidas", name: "Adidas" },
        { id: "puma", name: "Puma" },
        { id: "under_armour", name: "Under Armour" },
        { id: "anta", name: "Anta" },
        { id: "newbalance", name: "NewBalance" },
        { id: "salomon", name: "Salomon" },
      ],
    },
    {
      name: "Price Range",
      type: "range",
      filterType: "priceRange",
      options: [
        { label: "Min Price", key: "min" },
        { label: "Max Price", key: "max" },
      ],
    },
    {
      name: "Color",
      type: "checkbox",
      filterType: "color",
      options: [],
    },
    {
      name: "Size",
      type: "checkbox",
      filterType: "size",
      options: [],
    },
    {
      name: "Category",
      type: "checkbox",
      filterType: "category",
      options: Object.entries(categoryMap).map(([name, id]) => ({
        id,
        name,
      })),
    },
  ]);

  // Sync filters with URL
  useEffect(() => {
    const categoryFromUrl = searchParams.get("category");
    setFilters((prev) => ({
      ...prev,
      category: categoryFromUrl ? [categoryFromUrl.toLowerCase()] : [],
    }));
  }, [searchParams]);

  // Fetch products
  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    try {
      if (!API_URL) {
        throw new Error("VITE_API_URL is not defined in .env");
      }
      const response = await axios.get(`${API_URL}/products`, {
        headers: { "X-API-KEY": API_KEY },
      });

      const fetchedProducts = Array.isArray(response.data.data)
        ? response.data.data
        : Array.isArray(response.data)
        ? response.data
        : Array.isArray(response)
        ? response
        : [];

      if (debugMode) {
        console.log("Fetched products:", fetchedProducts);
      }

      // Normalize product data
      const normalizedProducts = fetchedProducts.map((product) => {
        const normalizedCategory = generateCategoryCombinations(
          product.category
        );

        let normalizedColor = product.color || [];
        if (typeof product.color === "string") {
          normalizedColor = [product.color.toLowerCase()];
        } else if (Array.isArray(product.color)) {
          normalizedColor = product.color
            .filter((color) => typeof color === "string")
            .map((color) => color.toLowerCase());
        }

        let normalizedSize = product.size || [];
        if (product.size === null) {
          normalizedSize = [];
        } else if (typeof product.size === "string") {
          try {
            normalizedSize = JSON.parse(product.size);
            if (!Array.isArray(normalizedSize)) {
              normalizedSize = product.size
                .split(",")
                .map((size) => size.trim().toLowerCase())
                .filter((size) => size);
            }
          } catch (e) {
            normalizedSize = product.size
              .split(",")
              .map((size) => size.trim().toLowerCase())
              .filter((size) => size);
          }
        } else if (Array.isArray(product.size)) {
          normalizedSize = product.size
            .filter(
              (size) => typeof size === "string" || typeof size === "number"
            )
            .map((size) => size.toString().toLowerCase());
        }

        const image = product.image
          ? product.image.startsWith("http")
            ? product.image
            : `${STORAGE_URL}/${product.image}`
          : "https://via.placeholder.com/300?text=Fallback";

        return {
          ...product,
          category: normalizedCategory,
          color: normalizedColor,
          size: normalizedSize,
          image,
        };
      });

      // Generate dynamic filter options
      const colors = [
        ...new Set(
          normalizedProducts
            .flatMap((p) => p.color)
            .filter((color) => typeof color === "string")
        ),
      ].map((color) => ({
        id: color,
        name: color.charAt(0).toUpperCase() + color.slice(1),
      }));

      const sizes = [
        ...new Set(
          normalizedProducts
            .flatMap((p) => p.size)
            .filter((size) => typeof size === "string")
        ),
      ].map((size) => ({
        id: size,
        name: size.toUpperCase(),
      }));

      setFilterList((prev) =>
        prev.map((filter) =>
          filter.name === "Color"
            ? { ...filter, options: colors }
            : filter.name === "Size"
            ? { ...filter, options: sizes }
            : filter
        )
      );

      setProducts(normalizedProducts);
      setError(null);

      const initialMainImages = {};
      normalizedProducts.forEach((product) => {
        const name = product.name ? product.name.toLowerCase() : "unnamed";
        if (!initialMainImages[name]) {
          initialMainImages[name] = product.image;
        }
      });
      setMainImages(initialMainImages);
    } catch (error) {
      console.error("Error fetching products:", error);
      setError(`Failed to fetch products: ${error.message}`);
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  }, [debugMode, API_URL, API_KEY, STORAGE_URL]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Save filters to localStorage and update URL
  useEffect(() => {
    localStorage.setItem("shopFilters", JSON.stringify(filters));
    if (filters.category.length > 0) {
      setSearchParams({ category: filters.category[0] });
    } else {
      setSearchParams({});
    }
  }, [filters, setSearchParams]);

  const debouncedSetFilters = useCallback(
    debounce((newFilters) => {
      setFilters(newFilters);
    }, 300),
    []
  );

  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => {
      if (filterType === "priceRange") {
        const newPriceRange = { ...prev.priceRange, ...value };
        if (
          newPriceRange.min &&
          newPriceRange.max &&
          parseFloat(newPriceRange.min) > parseFloat(newPriceRange.max)
        ) {
          console.warn("Invalid price range: min > max");
          return prev;
        }
        const updatedFilters = { ...prev, priceRange: newPriceRange };
        debouncedSetFilters(updatedFilters);
        return updatedFilters;
      } else if (filterType === "search") {
        const updatedFilters = { ...prev, search: value };
        debouncedSetFilters(updatedFilters);
        return updatedFilters;
      } else {
        const currentValues = prev[filterType] || [];
        const newValues = currentValues.includes(value)
          ? currentValues.filter((v) => v !== value)
          : [...currentValues, value];
        const updatedFilters = { ...prev, [filterType]: newValues };
        debouncedSetFilters(updatedFilters);
        return updatedFilters;
      }
    });
    setCurrentPage(1);
  };

  const clearFilters = () => {
    if (debugMode) {
      console.log("Clearing all filters");
    }
    setFilters({
      category: [],
      brand: [],
      color: [],
      size: [],
      priceRange: { min: "", max: "" },
      search: "",
    });
    setCurrentPage(1);
    setSearchParams({});
  };

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
    setCurrentPage(1);
  };

  const getCategoryDisplayName = (categoryId) => {
    return reverseCategoryMap[categoryId] || categoryId;
  };

  const filteredProducts = useMemo(() => {
    setIsFiltering(true);
    if (debugMode) {
      console.log("Filtering products with:", filters);
    }
    let filtered = [...products];

    filtered = filtered.filter((product) => {
      let matches = true;
      const exclusionReasons = [];

      if (filters.category.length) {
        const matchesCategory = Array.isArray(product.category)
          ? filters.category.every((cat) => product.category.includes(cat))
          : false;
        matches = matches && matchesCategory;
        if (!matchesCategory) {
          exclusionReasons.push(
            `category: product.category=${JSON.stringify(
              product.category
            )}, filters.category=${JSON.stringify(filters.category)}`
          );
        }
      }

      if (filters.brand.length) {
        const matchesBrand =
          product.brand && filters.brand.includes(product.brand.toLowerCase());
        matches = matches && matchesBrand;
        if (!matchesBrand) {
          exclusionReasons.push(
            `brand: product.brand=${
              product.brand
            }, filters.brand=${JSON.stringify(filters.brand)}`
          );
        }
      }

      if (filters.color.length) {
        const matchesColor = Array.isArray(product.color)
          ? filters.color.some((color) => product.color.includes(color))
          : product.color && filters.color.includes(product.color);
        matches = matches && matchesColor;
        if (!matchesColor) {
          exclusionReasons.push(
            `color: product.color=${JSON.stringify(
              product.color
            )}, filters.color=${JSON.stringify(filters.color)}`
          );
        }
      }

      if (filters.size.length) {
        const matchesSize = Array.isArray(product.size)
          ? filters.size.some((size) => product.size.includes(size))
          : false;
        matches = matches && matchesSize;
        if (!matchesSize) {
          exclusionReasons.push(
            `size: product.size=${JSON.stringify(
              product.size
            )}, filters.size=${JSON.stringify(filters.size)}`
          );
        }
      }

      if (filters.priceRange.min || filters.priceRange.max) {
        const price = parseFloat(product.sale_price) || 0;
        const min = parseFloat(filters.priceRange.min) || 0;
        const max = parseFloat(filters.priceRange.max) || Infinity;
        const matchesPrice = price >= min && price <= max;
        matches = matches && matchesPrice;
        if (!matchesPrice) {
          exclusionReasons.push(
            `price: price=${price}, min=${min}, max=${max}`
          );
        }
      }

      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesSearch = product.name?.toLowerCase().includes(searchLower);
        matches = matches && matchesSearch;
        if (!matchesSearch) {
          exclusionReasons.push(
            `search: product.name=${product.name}, search=${filters.search}`
          );
        }
      }

      if (!matches && debugMode) {
        console.log(
          `Product ${product.name || "Unnamed"} excluded:`,
          exclusionReasons.join("; ")
        );
      }

      return matches;
    });

    const validCategories = filterList
      .filter((f) => f.filterType === "category")
      .flatMap((f) => f.options.map((o) => o.id));
    if (
      filters.category.length &&
      !filters.category.every((cat) => validCategories.includes(cat))
    ) {
      if (debugMode) {
        console.log(
          `Invalid category: ${filters.category}, valid categories: ${validCategories}`
        );
      }
      filtered = [];
    }

    filtered.sort((a, b) => {
      if (sortOption === "name-asc") {
        return (a.name || "").localeCompare(b.name || "");
      } else if (sortOption === "name-desc") {
        return (b.name || "").localeCompare(a.name || "");
      } else if (sortOption === "price-asc") {
        return (
          (parseFloat(a.sale_price) || 0) - (parseFloat(b.sale_price) || 0)
        );
      } else if (sortOption === "price-desc") {
        return (
          (parseFloat(b.sale_price) || 0) - (parseFloat(a.sale_price) || 0)
        );
      }
      return 0;
    });

    if (debugMode) {
      console.log("Filtered and sorted products:", filtered);
    }
    setIsFiltering(false);
    return filtered;
  }, [products, filters, sortOption, debugMode, filterList]);

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * productsPerPage;
    const end = start + productsPerPage;
    return filteredProducts.slice(start, end);
  }, [filteredProducts, currentPage]);

  const groupedProducts = useMemo(() => {
    const grouped = paginatedProducts.reduce((acc, product) => {
      const name = product.name ? product.name.toLowerCase() : "unnamed";
      if (!acc[name]) {
        acc[name] = [];
      }
      acc[name].push(product);
      return acc;
    }, {});
    if (debugMode) {
      console.log("Grouped products:", grouped);
    }
    return grouped;
  }, [paginatedProducts, debugMode]);

  const handleImageHover = (groupName, image, variantId) => {
    setMainImages((prev) => ({ ...prev, [groupName]: image }));
    setHoveredVariantId(variantId);
  };

  return (
    <Layout>
      <div className="flex h-screen overflow-hidden">
        <div className="w-[300px] px-8 overflow-y-auto">
          {isLoading && (
            <div className="text-gray-500 py-2">Loading products...</div>
          )}
          {error && (
            <div className="bg-red-100 text-red-700 p-4 rounded mb-4">
              <p>{error}</p>
              <button
                onClick={fetchProducts}
                className="mt-2 text-sm underline"
                aria-label="Retry fetching products"
              >
                Retry
              </button>
            </div>
          )}

          <button
            onClick={clearFilters}
            className="py-10 text-sm hover:underline"
            aria-label="Clear all filters"
          >
            Clear All Filters
          </button>

          {filterList.map((filter, index) => (
            <div key={index} className="border-b border-[#707072]">
              <div
                className="text-[16px] font-[400] py-5 flex justify-between items-center cursor-pointer"
                onClick={() =>
                  setOpenFilter(openFilter === index ? null : index)
                }
                role="button"
                aria-expanded={openFilter === index}
                aria-label={`Toggle ${filter.name} filter`}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    setOpenFilter(openFilter === index ? null : index);
                  }
                }}
              >
                {filter.name}
                <FiChevronDown
                  className={`text-2xl transition-transform ${
                    openFilter === index ? "rotate-180" : ""
                  }`}
                  aria-hidden="true"
                />
              </div>
              {openFilter === index && (
                <div className="py-2">
                  {filter.type === "checkbox" && filter.options?.length > 0 ? (
                    <ul>
                      {filter.options.map((option, subIndex) => (
                        <li key={subIndex} className="py-1 flex items-center">
                          <input
                            type="checkbox"
                            checked={
                              filters[filter.filterType]?.includes(option.id) ||
                              false
                            }
                            onChange={() =>
                              handleFilterChange(filter.filterType, option.id)
                            }
                            className="mr-2"
                            id={`${filter.name}-${option.id}`}
                            aria-label={`Filter by ${filter.name.toLowerCase()} ${
                              option.name
                            }`}
                          />
                          <label htmlFor={`${filter.name}-${option.id}`}>
                            {option.name}
                          </label>
                        </li>
                      ))}
                    </ul>
                  ) : filter.type === "range" ? (
                    <div className="flex flex-col gap-2">
                      <input
                        type="number"
                        placeholder="Min Price"
                        value={filters.priceRange.min}
                        onChange={(e) =>
                          handleFilterChange("priceRange", {
                            min: e.target.value,
                          })
                        }
                        className="border p-2 rounded"
                        aria-label="Minimum price filter"
                        min="0"
                      />
                      <input
                        type="number"
                        placeholder="Max Price"
                        value={filters.priceRange.max}
                        onChange={(e) =>
                          handleFilterChange("priceRange", {
                            max: e.target.value,
                          })
                        }
                        className="border p-2 rounded"
                        aria-label="Maximum price filter"
                        min="0"
                      />
                      {filters.priceRange.min &&
                        filters.priceRange.max &&
                        parseFloat(filters.priceRange.min) >
                          parseFloat(filters.priceRange.max) && (
                          <p className="text-red-500 text-sm">
                            Minimum price cannot exceed maximum price.
                          </p>
                        )}
                    </div>
                  ) : (
                    <p className="text-gray-400">No options available</p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="flex-1 p-5 overflow-y-auto">
          <div className="mb-4 flex justify-end">
            <label htmlFor="sort" className="mr-2">
              Sort By:
            </label>
            <select
              id="sort"
              value={sortOption}
              onChange={handleSortChange}
              className="outline-none text-gray-500"
              aria-label="Sort products"
            >
              <option value="name-asc">Name (A-Z)</option>
              <option value="name-desc">Name (Z-A)</option>
              <option value="price-asc">Price (Low to High)</option>
              <option value="price-desc">Price (High to Low)</option>
            </select>
          </div>
          {isFiltering ? (
            <div className="text-gray-500">Filtering products...</div>
          ) : filteredProducts.length === 0 && !isLoading && !error ? (
            <div className="text-gray-500">
              {filters.category.length
                ? `No products found for category "${filters.category
                    .map(getCategoryDisplayName)
                    .join(", ")}".`
                : "No products available."}
            </div>
          ) : (
            <>
              <div className="grid xl:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-3">
                {Object.entries(groupedProducts).map(
                  ([groupName, group], i) => (
                    <div className="relative py-5" key={i}>
                      <div
                        className="relative"
                        onMouseEnter={() => setHoveredProduct(groupName)}
                        onMouseLeave={() => {
                          setHoveredProduct(null);
                          setHoveredVariantId(null);
                        }}
                      >
                        <Link to={`/${hoveredVariantId || group[0].id}`}>
                          <img
                            className="w-[507.98px] h-[507.98px] object-cover"
                            src={
                              mainImages[groupName] ||
                              group[0].image ||
                              "https://via.placeholder.com/300?text=Fallback"
                            }
                            alt={
                              groupName
                                ? `${groupName} product image`
                                : "Product Image"
                            }
                            onError={(e) => {
                              e.target.src =
                                "https://via.placeholder.com/300?text=Fallback";
                            }}
                          />
                          {hoveredProduct === groupName && group.length > 1 && (
                            <div className="absolute bottom-0 py-3 w-full bg-white flex gap-1">
                              {group.map((variant) => (
                                <Link
                                  key={variant.id}
                                  to={`/${variant.id}`}
                                  className="mb-2 hover:bg-gray-100"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <img
                                    className="w-10 h-10 object-cover rounded hover:opacity-75 cursor-pointer"
                                    src={
                                      variant.image ||
                                      "https://via.placeholder.com/300?text=Fallback"
                                    }
                                    alt={`${variant.name || "Unnamed"} variant`}
                                    onMouseEnter={() =>
                                      handleImageHover(
                                        groupName,
                                        variant.image,
                                        variant.id
                                      )
                                    }
                                    onError={(e) => {
                                      e.target.src =
                                        "https://via.placeholder.com/300?text=Fallback";
                                    }}
                                  />
                                </Link>
                              ))}
                            </div>
                          )}
                          <div className="py-4">
                            <h3 className="font-[500]">{groupName}</h3>
                            <h3 className="font-[500] text-[rgb(136,136,137)]">
                              {filters.category.length
                                ? filters.category
                                    .map(getCategoryDisplayName)
                                    .join(", ")
                                : getCategoryDisplayName(
                                    group[0].category?.[0] || "uncategorized"
                                  )}
                            </h3>
                          </div>
                        </Link>
                      </div>
                      <p className="font-[500] absolute bottom-0">
                        ${group[0].sale_price || "N/A"}
                      </p>
                    </div>
                  )
                )}
              </div>

              {totalPages > 1 && (
                <div className="flex justify-center mt-4 gap-2">
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                    className="px-4 py-2 border rounded disabled:opacity-50"
                    aria-label="Previous page"
                  >
                    Previous
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-4 py-2 border rounded ${
                          currentPage === page ? "bg-gray-200" : ""
                        }`}
                        aria-label={`Page ${page}`}
                      >
                        {page}
                      </button>
                    )
                  )}
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 border rounded disabled:opacity-50"
                    aria-label="Next page"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Shop;