import axios from "axios";
import React, { useEffect, useState } from "react";
import Slider from "../../Contexts/Slider";

const Banner = () => {
  const [slider, setSlider] = useState([]);

  useEffect(() => {
    const fetchBanner = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/sliders`
        );
        setSlider(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error("Error fetching banners:", error);
      }
    };
    fetchBanner();
  }, []);

  return (
    <div className="">
      <Slider e={slider} />
    </div>
  );
};

export default Banner;
