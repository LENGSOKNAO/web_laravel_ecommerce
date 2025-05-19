import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Banner4 from "../../Contexts/Banner4";
import Banner3 from "../../Contexts/Banner3";
import Banner2 from "../../Contexts/Banner2";
import Banner1 from "../../Contexts/Banner1";

const Trending = () => {
  const [banner, setBanner] = useState([]);

  useEffect(() => {
    const fetchBanner = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/banners`
        );
        setBanner(response.data.banners);
      } catch (error) {
        console.error("Error fetching banners:", error);
      }
    };
    fetchBanner();
  }, []);

  const n4 = "4";
  const n3 = "3";
  const n2 = "2";
  const n1 = "1";

  const trending = "trending";
  const men2 = "men";
  const men1 = "men";
  const brand2 = "women";
  const women3 = "women";

  return (
    <div className="text-shadow overflow-hidden">
      <Banner4 e={banner} n={n4} b={trending} />
      <div className="p-5">
        <h2 className="text-[32px] font-[400]"> Women </h2>
      </div>
      <Banner1 e={banner} n={n1} b={brand2} />
      <div className="p-5">
        <h2 className="text-[32px] font-[400]">Shop By Style </h2>
      </div>
      <Banner3 e={banner} n={n3} b={women3} />
      <div className="p-5">
        <h2 className="text-[32px] font-[400]"> Men </h2>
      </div>
      <Banner1 e={banner} n={n1} b={men1} />
      <div className="p-5">
        <h2 className="text-[32px] font-[400]"> Football Must-Haves </h2>
      </div>
      <Banner2 e={banner} n={n2} b={men2} />
    </div>
  );
};

export default Trending;
