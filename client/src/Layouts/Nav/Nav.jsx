import axios from "axios";
import React, {
  useEffect,
  useState,
  useCallback,
  useMemo,
  useContext,
} from "react";
import { CiHeart, CiSearch, CiShoppingCart } from "react-icons/ci";
import { Link } from "react-router-dom";
import { VscAdd } from "react-icons/vsc";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import { HiMiniBars3, HiXMark } from "react-icons/hi2";
import { BsChevronRight, BsChevronLeft } from "react-icons/bs";
import { CartContext } from "../../Contexts/CartContext";
import { PiBagSimpleThin } from "react-icons/pi";
import { WishlistContext } from "../../Contexts/WishlistContext";

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

// Category mapping with section-specific shoe categories
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
};

// Navigation data with updated paths
const nav = [
  {
    name: "New",
    path: "/shop?category=new",
    list: [
      {
        nav: "New & Featured",
        path: "/shop?category=new",
        items: [
          { name: "New Arrivals", path: "/shop?category=new_arrivals" },
          { name: "Best Sellers", path: "/shop?category=best_sellers" },
          { name: "Shop All Sale", path: "/shop?category=sale" },
        ],
      },
      {
        nav: "Gender",
        path: "/shop?category=gender",
        items: [
          { name: "Men's", path: "/shop?category=men" },
          { name: "Women's", path: "/shop?category=women" },
          { name: "Kid's", path: "/shop?category=kids" },
        ],
      },
      {
        nav: "Trending",
        path: "/shop?category=trending",
      },
    ],
  },
  {
    name: "Men",
    path: "/shop?category=men",
    list: [
      {
        nav: "New & Featured",
        path: "/shop?category=men_new",
        items: [
          { name: "New Arrivals", path: "/shop?category=men_new_arrivals" },
          { name: "Best Sellers", path: "/shop?category=men_best_sellers" },
          { name: "Latest Drops", path: "/shop?category=men_latest_drops" },
          { name: "Summer Shop", path: "/shop?category=men_summer" },
          { name: "Shop All Sale", path: "/shop?category=men_sale" },
        ],
      },
      {
        nav: "Shoes",
        path: "/shop?category=men_shoes",
        items: [
          { name: "All Shoes", path: "/shop?category=men_shoes" },
          { name: "Basketball", path: "/shop?category=men_basketball" },
          { name: "Lifestyle", path: "/shop?category=men_lifestyle" },
          { name: "Jordan", path: "/shop?category=men_jordan" },
          { name: "Retro Running", path: "/shop?category=men_retro_running" },
          { name: "Running", path: "/shop?category=men_running" },
          {
            name: "Sandals & Slides",
            path: "/shop?category=men_sandals_slides",
          },
          {
            name: "Shoes $100 & Under",
            path: "/shop?category=men_shoes_100_under",
          },
          { name: "Training & Gym", path: "/shop?category=men_training" },
        ],
      },
      {
        nav: "Clothing",
        path: "/shop?category=men_clothing",
        items: [
          { name: "All Clothing", path: "/shop?category=men_clothing" },
          {
            name: "Hoodies & Sweatshirts",
            path: "/shop?category=men_hoodies_sweatshirts",
          },
          { name: "Jordan", path: "/shop?category=men_jordan_clothing" },
          { name: "Jackets & Vests", path: "/shop?category=men_jackets_vests" },
          { name: "Matching Sets", path: "/shop?category=men_matching_sets" },
          { name: "Pants", path: "/shop?category=men_pants" },
          { name: "Shorts", path: "/shop?category=men_shorts" },
          {
            name: "Tops & Graphic Tees",
            path: "/shop?category=men_tops_graphic_tees",
          },
          {
            name: "24.7 Collection",
            path: "/shop?category=men_24_7_collection",
          },
        ],
      },
      {
        nav: "Accessories",
        path: "/shop?category=men_accessories",
        items: [
          {
            name: "Bags & Backpacks",
            path: "/shop?category=men_bags_backpacks",
          },
          { name: "Hats & Headwear", path: "/shop?category=men_hats_headwear" },
          { name: "Socks", path: "/shop?category=men_socks" },
          { name: "Sunglasses", path: "/shop?category=men_sunglasses" },
          { name: "Belts", path: "/shop?category=men_belts" },
        ],
      },
    ],
  },
  {
    name: "Women",
    path: "/shop?category=women",
    list: [
      {
        nav: "New & Featured",
        path: "/shop?category=women_new",
        items: [
          { name: "New Arrivals", path: "/shop?category=women_new_arrivals" },
          { name: "Best Sellers", path: "/shop?category=women_best_sellers" },
          { name: "Latest Drops", path: "/shop?category=women_latest_drops" },
          { name: "Nike Style By", path: "/shop?category=women_nike_style_by" },
          { name: "Summer Shop", path: "/shop?category=women_summer" },
          { name: "Shop All Sale", path: "/shop?category=women_sale" },
        ],
      },
      {
        nav: "Shop by Color",
        path: "/shop?category=women_color",
        items: [
          { name: "Bold Blues", path: "/shop?category=women_bold_blues" },
          { name: "Peachy Picks", path: "/shop?category=women_peachy_picks" },
          { name: "Purple Pops", path: "/shop?category=women_purple_picks" },
          { name: "Neon Edit", path: "/shop?category=women_neon_edit" },
          {
            name: "Timeless Neutrals",
            path: "/shop?category=women_timeless_neutrals",
          },
        ],
      },
      {
        nav: "Shoes",
        path: "/shop?category=women_shoes",
        items: [
          { name: "All Shoes", path: "/shop?category=women_shoes" },
          { name: "Basketball", path: "/shop?category=women_basketball" },
          { name: "Lifestyle", path: "/shop?category=women_lifestyle" },
          { name: "Jordan", path: "/shop?category=women_jordan" },
          { name: "Retro Running", path: "/shop?category=women_retro_running" },
          { name: "Running", path: "/shop?category=women_running" },
          {
            name: "Sandals & Slides",
            path: "/shop?category=women_sandals_slides",
          },
          {
            name: "Shoes $100 & Under",
            path: "/shop?category=women_shoes_100_under",
          },
          { name: "Training & Gym", path: "/shop?category=women_training" },
        ],
      },
      {
        nav: "Clothing",
        path: "/shop?category=women_clothing",
        items: [
          { name: "All Clothing", path: "/shop?category=women_clothing" },
          { name: "Bras", path: "/shop?category=women_bras" },
          {
            name: "Hoodies & Sweatshirts",
            path: "/shop?category=women_hoodies_sweatshirts",
          },
          { name: "Leggings", path: "/shop?category=women_leggings" },
          { name: "Matching Sets", path: "/shop?category=women_matching_sets" },
          {
            name: "Jackets & Vests",
            path: "/shop?category=women_jackets_vests",
          },
          { name: "Pants", path: "/shop?category=women_pants" },
          {
            name: "Skirts & Dresses",
            path: "/shop?category=women_skirts_dresses",
          },
          { name: "Shorts", path: "/shop?category=women_shorts" },
          {
            name: "Tops & T-Shirts",
            path: "/shop?category=women_tops_tshirts",
          },
          {
            name: "24.7 Collection",
            path: "/shop?category=women_24_7_collection",
          },
        ],
      },
      {
        nav: "Accessories",
        path: "/shop?category=women_accessories",
        items: [
          {
            name: "Bags & Backpacks",
            path: "/shop?category=women_bags_backpacks",
          },
          {
            name: "Hats & Headwear",
            path: "/shop?category=women_hats_headwear",
          },
          { name: "Socks", path: "/shop?category=women_socks" },
          { name: "Sunglasses", path: "/shop?category=women_sunglasses" },
          { name: "Belts", path: "/shop?category=women_belts" },
        ],
      },
    ],
  },
  {
    name: "Kids",
    path: "/shop?category=kids",
    list: [
      {
        nav: "New & Featured",
        path: "/shop?category=kids_new",
        items: [
          { name: "New Arrivals", path: "/shop?category=kids_new_arrivals" },
          { name: "Best Sellers", path: "/shop?category=kids_best_sellers" },
          { name: "Latest Drops", path: "/shop?category=kids_latest_drops" },
          { name: "Summer Shop", path: "/shop?category=kids_summer" },
          { name: "Shop All Sale", path: "/shop?category=kids_sale" },
        ],
      },
      {
        nav: "Shop By Sport",
        path: "/shop?category=kids_sport",
        items: [
          { name: "Gymnastics", path: "/shop?category=kids_gymnastics" },
          { name: "Basketball", path: "/shop?category=kids_basketball" },
          { name: "Football", path: "/shop?category=kids_football" },
          { name: "Running", path: "/shop?category=kids_running" },
          { name: "Soccer", path: "/shop?category=kids_soccer" },
        ],
      },
      {
        nav: "Shoes",
        path: "/shop?category=kids_shoes",
        items: [
          { name: "All Shoes", path: "/shop?category=kids_shoes" },
          { name: "Basketball", path: "/shop?category=kids_basketball" },
          { name: "Lifestyle", path: "/shop?category=kids_lifestyle" },
          { name: "Jordan", path: "/shop?category=kids_jordan" },
          { name: "Retro Running", path: "/shop?category=kids_retro_running" },
          { name: "Running", path: "/shop?category=kids_running" },
          {
            name: "Sandals & Slides",
            path: "/shop?category=kids_sandals_slides",
          },
          {
            name: "Shoes $80 & Under",
            path: "/shop?category=kids_shoes_80_under",
          },
          { name: "Soccer", path: "/shop?category=kids_soccer_shoes" },
        ],
      },
      {
        nav: "Clothing",
        path: "/shop?category=kids_clothing",
        items: [
          { name: "All Clothing", path: "/shop?category=kids_clothing" },
          { name: "Bras", path: "/shop?category=kids_bras" },
          {
            name: "Hoodies & Sweatshirts",
            path: "/shop?category=kids_hoodies_sweatshirts",
          },
          { name: "Jordan", path: "/shop?category=kids_jordan_clothing" },
          { name: "Matching Sets", path: "/shop?category=kids_matching_sets" },
          {
            name: "Jackets & Vests",
            path: "/shop?category=kids_jackets_vests",
          },
          { name: "Pants & Tights", path: "/shop?category=kids_pants_tights" },
          { name: "Shorts", path: "/shop?category=kids_shorts" },
          {
            name: "Skirts & Dresses",
            path: "/shop?category=kids_skirts_dresses",
          },
          { name: "Tops & T-Shirts", path: "/shop?category=kids_tops_tshirts" },
        ],
      },
      {
        nav: "Shop by Age",
        path: "/shop?category=kids_age",
        items: [
          { name: "Teen", path: "/shop?category=kids_teen" },
          {
            name: "Big Kids (7-15 yrs)",
            path: "/shop?category=kids_7_15_years",
          },
          {
            name: "Little Kids (3-7 yrs)",
            path: "/shop?category=kids_3_7_years",
          },
          {
            name: "Baby & Toddler (0-3 yrs)",
            path: "/shop?category=kids_0_3_years",
          },
        ],
      },
      {
        nav: "Accessories",
        path: "/shop?category=kids_accessories",
        items: [
          {
            name: "Bags & Backpacks",
            path: "/shop?category=kids_bags_backpacks",
          },
          {
            name: "Hats & Headwear",
            path: "/shop?category=kids_hats_headwear",
          },
          { name: "Socks", path: "/shop?category=kids_socks" },
          { name: "Sunglasses", path: "/shop?category=kids_sunglasses" },
          { name: "Belts", path: "/shop?category=kids_belts" },
        ],
      },
    ],
  },
  {
    name: "Sport",
    path: "/shop?category=sport",
    list: [
      {
        nav: "Basketball",
        path: "/shop?category=sport_basketball",
        items: [
          { name: "Shoes", path: "/shop?category=sport_basketball_shoes" },
          { name: "Apparel", path: "/shop?category=sport_basketball_apparel" },
          {
            name: "Equipment",
            path: "/shop?category=sport_basketball_equipment",
          },
          { name: "Kobe", path: "/shop?category=sport_kobe" },
          { name: "Jordan", path: "/shop?category=sport_jordan" },
          { name: "NBA Gear", path: "/shop?category=sport_nba_gear" },
          { name: "WNBA Gear", path: "/shop?category=sport_wnba_gear" },
          { name: "NCAA Gear", path: "/shop?category=sport_ncaa_gear" },
        ],
      },
      {
        nav: "Training",
        path: "/shop?category=sport_training",
        items: [
          { name: "Shoes", path: "/shop?category=sport_training_shoes" },
          { name: "Socks", path: "/shop?category=sport_training_socks" },
          { name: "Apparel", path: "/shop?category=sport_training_apparel" },
          {
            name: "Equipment",
            path: "/shop?category=sport_training_equipment",
          },
        ],
      },
      {
        nav: "Running",
        path: "/shop?category=sport_running",
        items: [
          { name: "Road", path: "/shop?category=sport_road" },
          { name: "Race", path: "/shop?category=sport_race" },
          { name: "Trail", path: "/shop?category=sport_trail" },
          { name: "Track & Field", path: "/shop?category=sport_track_field" },
          { name: "Apparel", path: "/shop?category=sport_running_apparel" },
          { name: "Equipment", path: "/shop?category=sport_running_equipment" },
          {
            name: "Stride & Swift Collection",
            path: "/shop?category=sport_stride_swift_collection",
          },
          {
            name: "Running Shoe Finder",
            path: "/shop?category=sport_running_shoe_finder",
          },
        ],
      },
      {
        nav: "Golf",
        path: "/shop?category=sport_golf",
        items: [
          {
            name: "Championship Gear",
            path: "/shop?category=sport_championship_gear",
          },
          { name: "Shoes", path: "/shop?category=sport_golf_shoes" },
          { name: "Apparel", path: "/shop?category=sport_golf_apparel" },
          { name: "Equipment", path: "/shop?category=sport_golf_equipment" },
        ],
      },
      {
        nav: "Soccer",
        path: "/shop?category=sport_soccer",
        items: [
          { name: "Cleats", path: "/shop?category=sport_cleats" },
          {
            name: "Indoor Footwear",
            path: "/shop?category=sport_indoor_footwear",
          },
          { name: "Apparel", path: "/shop?category=sport_soccer_apparel" },
          { name: "Equipment", path: "/shop?category=sport_soccer_equipment" },
          {
            name: "National Team Gear",
            path: "/shop?category=sport_national_team_gear",
          },
          {
            name: "Club Team Gear",
            path: "/shop?category=sport_club_team_gear",
          },
          { name: "NWSL Gear", path: "/shop?category=sport_nwsl_gear" },
        ],
      },
      {
        nav: "More Sports",
        path: "/shop?category=sport_more",
        items: [
          { name: "Baseball", path: "/shop?category=sport_baseball" },
          { name: "Cheer", path: "/shop?category=sport_cheer" },
          { name: "Fan Gear", path: "/shop?category=sport_fan_gear" },
          { name: "Football", path: "/shop?category=sport_football" },
          { name: "Gymnastics", path: "/shop?category=sport_gymnastics" },
          { name: "Lacrosse", path: "/shop?category=sport_lacrosse" },
          { name: "Pickleball", path: "/shop?category=sport_pickleball" },
          { name: "Skateboarding", path: "/shop?category=sport_skateboarding" },
          { name: "Softball", path: "/shop?category=sport_softball" },
          { name: "Swimming", path: "/shop?category=sport_swimming" },
          { name: "Tennis", path: "/shop?category=sport_tennis" },
          { name: "Volleyball", path: "/shop?category=sport_volleyball" },
          { name: "Wrestling", path: "/shop?category=sport_wrestling" },
        ],
      },
    ],
  },
];

const user = [
  { name: "Find a Orders", path: "/order-history" },
  { name: "Help", path: "/" },
];

const icons = [
  { icon: <CiHeart />, path: "/wishlist", name: "Wishlist" },
  { icon: <PiBagSimpleThin />, path: "/cart", name: "Cart" },
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
  const [navbar, setNavbar] = useState(false);
  const [smallNav, setSmallNav] = useState(false);
  const [d, setD] = useState(false);
  const [selectedCategoryIndex, setSelectedCategoryIndex] = useState(null);
  const [selectedBrandIndex, setSelectedBrandIndex] = useState(null);
  const { getCartCount } = useContext(CartContext);
  const { getWishlistCount } = useContext(WishlistContext);

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
      suggestions.add("bball shoes");
      suggestions.add("kids' bball shoes");
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
        <span className="text-[rgb(41,0,0)]">{match}</span>
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

  const list = [
    {
      link: "Members: Free Shipping on Orders $50+",
    },
    {
      link: "Members: Free Shipping ",
    },
  ];

  // Function to get normalized category path with section prefix
  const getCategoryPath = (name, section = "") => {
    // Construct key with section prefix (e.g., "Men All Shoes")
    const key = section ? `${section} ${name}` : name;
    const normalized =
      categoryMap[key] ||
      name.toLowerCase().replace(/ & /g, "_").replace(/ /g, "_");
    return `/shop?category=${normalized}`;
  };

  return (
    <header className="z-50">
      {/* Top nav */}
      <div className="bg-[#E5E5E5]">
        <ul className="flex justify-end items-center text-xs gap-2 px-5 py-2">
          {user.map((item, index) => (
            <li
              key={item.name}
              className={`relative hover:text-gray-500 px-2 text-[13px] ${
                index !== 0
                  ? "before:content-[''] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:h-3 before:w-[1px] before:bg-gray-600"
                  : ""
              }`}
            >
              <Link to={item.path}>{item.name}</Link>
            </li>
          ))}
        </ul>
      </div>
      {/* Main nav */}
      <nav className="flex items-center justify-between px-10 py-1 z-10 relative">
        {/* Logo Section */}
        <div>
          {error ? (
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
        <div className="">
          {/* Desktop */}
          <div className="hidden md:hidden lg:block">
            <div>
              <ul className="flex gap-7 text-sm bg-white px-5 py-3 rounded-full font-medium">
                {nav.map((item, index) => (
                  <li
                    onMouseEnter={() => setActiveNav(index)}
                    className=""
                    key={item.name}
                  >
                    <Link to={item.path} className="z-50">
                      {item.name}
                    </Link>
                    {item.list && activeNav === index && (
                      <div className="absolute top-0 right-0 left-0 w-full z-[-1]">
                        <div className="absolute inset-0 w-screen h-screen bg-[rgba(0,0,0,0.5)] z-[-3]"></div>
                        <div
                          onMouseLeave={() => setActiveNav(null)}
                          data-aos="fade-down"
                          data-aos-easing="linear"
                          data-aos-duration="200"
                          className="max-h-[50vh] overflow-y-auto bg-white py-[100px]"
                        >
                          <div className="flex justify-center w-full">
                            <ul className="flex flex-wrap px-7 w-[50%] gap-[10px_120px]">
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
          </div>
        </div>

        {/* Icon Links */}
        <ul className="flex items-center gap-2 text-3xl">
          <li>
            <button
              onClick={() => setSearch((s) => !s)}
              aria-label="Toggle search"
              className="flex items-center"
            >
              <CiSearch />
            </button>
          </li>
          {icons.map((item, index) => (
            <Link key={index} to={item.path} className="relative">
              <span>{item.icon}</span>
              {item.name === "Cart" && getCartCount() > 0 && (
                <span className="absolute -top-1 my-[10px] right-[5px] bottom-[-20px] text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {getCartCount()}
                </span>
              )}
              {item.name === "Wishlist" && getWishlistCount() > 0 && (
                <span className="absolute -top-[5px] my-[10px] right-[5px] bottom-[-20px] text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {getWishlistCount()}
                </span>
              )}
            </Link>
          ))}
          <li className="md:block lg:hidden">
            <Link>
              <HiMiniBars3 onClick={() => setNavbar((e) => !e)} />
            </Link>
          </li>
        </ul>
      </nav>
      {/* Mobile Navbar */}
      <div className="md:block lg:hidden">
        {navbar && (
          <div className="fixed inset-0 w-screen h-screen overflow-hidden z-50">
            <div
              className="absolute inset-0 bg-[rgba(0,0,0,0.7)] z-50"
              onClick={() => setNavbar(false)}
            ></div>
            <div className="bg-white absolute top-0 right-0 bottom-0 w-[350px] z-50 overflow-y-auto">
              <div className="p-4">
                <button
                  className="text-black text-2xl mb-4 p-3 flex justify-end w-full"
                  onClick={() => setNavbar(false)}
                  aria-label="Close menu"
                >
                  <Link className="hover:bg-gray-200 p-1 rounded-4xl">
                    <HiXMark />
                  </Link>
                </button>
                <ul className="space-y-4">
                  {nav.map((category, index) => (
                    <li key={index}>
                      <div
                        onClick={() => {
                          if (selectedCategoryIndex === index) {
                            setD(false);
                            setSelectedCategoryIndex(null);
                          } else {
                            setD(true);
                            setSelectedCategoryIndex(index);
                            setSmallNav(false);
                            setSelectedBrandIndex(null);
                          }
                        }}
                        className="flex items-center justify-between px-5 cursor-pointer hover:text-gray-400"
                      >
                        <span className="text-black text-[24px] hover:text-gray-500 font-[500]">
                          {category.name}
                        </span>
                        <BsChevronRight
                          className={`transition-transform duration-200 ${
                            d && selectedCategoryIndex === index
                              ? "rotate-90"
                              : ""
                          }`}
                        />
                      </div>
                      {d && selectedCategoryIndex === index && (
                        <ul className="space-y-4 bg-white absolute top-0 right-0 bottom-0 w-[350px]">
                          <div className="flex justify-center items-center p-4">
                            <Link
                              onClick={() => setD(false)}
                              className="flex items-center gap-1 text-xl"
                            >
                              <BsChevronLeft /> All
                            </Link>
                            <button
                              className="text-black text-2xl mb-4 p-3 flex justify-end w-full"
                              onClick={() => setNavbar(false)}
                              aria-label="Close menu"
                            >
                              <Link className="hover:bg-gray-200 p-1 rounded-4xl">
                                <HiXMark />
                              </Link>
                            </button>
                          </div>
                          {category.list.map((brand, brandIndex) => (
                            <li key={brandIndex}>
                              <div
                                onClick={() => {
                                  if (selectedBrandIndex === brandIndex) {
                                    setSmallNav(false);
                                    setSelectedBrandIndex(null);
                                  } else {
                                    setSmallNav(true);
                                    setSelectedBrandIndex(brandIndex);
                                  }
                                }}
                                className="flex items-center justify-between px-5 cursor-pointer hover:text-gray-500"
                              >
                                <span className="block text-lg font-[500] hover:text-gray-500">
                                  {brand.nav}
                                </span>
                                <BsChevronRight
                                  className={`transition-transform duration-200 ${
                                    smallNav &&
                                    selectedBrandIndex === brandIndex
                                      ? "rotate-90"
                                      : ""
                                  }`}
                                />
                              </div>
                              {smallNav &&
                                selectedBrandIndex === brandIndex && (
                                  <ul className="bg-white absolute top-0 right-0 bottom-0 w-[350px] pl-4">
                                    <div className="flex justify-center items-center p-4">
                                      <Link
                                        onClick={() => setSmallNav(false)}
                                        className="flex items-center gap-1 text-xl"
                                      >
                                        <BsChevronLeft /> All
                                      </Link>
                                      <button
                                        className="text-black text-2xl mb-4 p-3 flex justify-end w-full"
                                        onClick={() => setNavbar(false)}
                                        aria-label="Close menu"
                                      >
                                        <Link className="hover:bg-gray-200 p-1 rounded-4xl">
                                          <HiXMark />
                                        </Link>
                                      </button>
                                    </div>
                                    {brand.items.map((item, itemIndex) => (
                                      <li
                                        key={itemIndex}
                                        className="hover:text-gray-900 px-5 hover:underline"
                                      >
                                        <Link
                                          to={item.path}
                                          className="text-[16px] flex items-center justify-between py-2 font-medium"
                                        >
                                          {item.name} <BsChevronRight />
                                        </Link>
                                      </li>
                                    ))}
                                  </ul>
                                )}
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
      </div>
      {/* Search Panel */}
      {search && (
        <div className="absolute top-0 right-0 left-0 w-full z-10 bg-white">
          <div className="absolute inset-0 w-screen h-screen bg-[rgba(0,0,0,0.1)] z-[-3]"></div>
          <div
            data-aos="fade-down"
            data-aos-easing="linear"
            data-aos-duration="200"
            className="bg-white h-[50vh]"
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
                  <div className="w-1/7">
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
                      <div className="flex flex-wrap gap-5 relative">
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
                              className="w-[270px] h-[300px] object-cover mb-2"
                              onError={handleImageError}
                            />
                            <h3 className="text-xl font-[500]">
                              {product.name}
                            </h3>
                            <p className="text-sm py-1 text-gray-500">
                              {product.brand}
                            </p>
                            <p className="text-md flex font-medium">
                              ${product.price}
                              {product.discount > 0 && (
                                <div className="absolute top-0">
                                  <span className="text-red-500 text-xs ml-2">
                                    {product.discount}%
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
      {/* Slider */}
      <Swiper
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        modules={[Autoplay, Navigation]}
        loop={true}
        className="bg-[#E5E5E5] mySwiper"
      >
        {list.map((e, i) => (
          <SwiperSlide className="py-4 underline text-center text-sm" key={i}>
            <Link>{e.link}</Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </header>
  );
};

export default Nav;
