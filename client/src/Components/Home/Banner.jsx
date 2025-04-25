import axios from "axios";
import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";

const Banner = () => {
  const [banner, setBanner] = useState([]);

  useEffect(() => {
    const fetchBanner = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/sliders`
        );
        setBanner(
          Array.isArray(response.data)
            ? response.data
            : response.data.banners || []
        );
      } catch (error) {
        console.error("Failed to fetch banners:", error);
      }
    };
    fetchBanner();
  }, []);

  const isImage = (file) => {
    const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp"];
    return imageExtensions.some((ext) => file.toLowerCase().endsWith(ext));
  };

  const isVideo = (file) => {
    const videoExtensions = [".mp4", ".webm", ".ogg"];
    return videoExtensions.some((ext) => file.toLowerCase().endsWith(ext));
  };

  return (
    <div>
      <Swiper
        modules={[Navigation, Pagination, Autoplay]} // Add required modules
        spaceBetween={0}
        slidesPerView={1}
        navigation
        loop
        pagination={{ clickable: true }}
        autoplay={{ delay: 5000 }}
        className="mySwiper"
      >
        {banner
          .filter((e) => e.status === 1)
          .map((e, i) => (
            <SwiperSlide key={i}>
              <div className="banner-item">
                {isImage(e.image) && (
                  <img
                    src={`${import.meta.env.VITE_BASE_URL}/storage/${e.image}`}
                    alt={e.name || "Banner"}
                    className="w-full h-[70vh] object-cover"
                  />
                )}
                {isVideo(e.image) && (
                  <video
                    src={`${import.meta.env.VITE_BASE_URL}/storage/${e.image}`}
                    autoPlay
                    muted
                    loop
                    className="w-full h-[70vh] object-cover"
                  />
                )}
                <div className="banner-name">{e.name}</div>
              </div>
            </SwiperSlide>
          ))}
      </Swiper>
    </div>
  );
};

export default Banner;
