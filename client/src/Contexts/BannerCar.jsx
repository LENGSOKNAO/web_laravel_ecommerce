import React from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css/scrollbar";
import { Scrollbar } from "swiper/modules";

const BannerCar = ({ e, n }) => {
  return (
    <div className="">
      <div className="px-3">
        <Swiper
          scrollbar={{
            draggable: true,
          }}
          modules={[Scrollbar]}
          className="mySwiper"
          breakpoints={{
            0: {
              slidesPerView: 1,
            },
            640: {
              slidesPerView: n - 2,
            },
            1024: {
              slidesPerView: n - 1,
            },
            1280: {
              slidesPerView: n,
            },
          }}
        >
          {e
            .filter((e) => e.status == "1" && e.qty == n)
            .map((e, i) => (
              <SwiperSlide key={i}>
                <div className="relative w-[500px] h-[700px] mx-auto">
                  <img
                    className="w-full h-full object-cover"
                    src={`${import.meta.env.VITE_STORAGE_URL}/${e.image}`}
                    alt={e.title || "Product Image"}
                  />
                  <div className="absolute bottom-0 p-7 w-full">
                    <Link className="bg-white shadow-5xl text-black rounded-[30px] py-2 px-5 font-medium text-[12px] inline-block">
                      Shop
                    </Link>
                  </div>
                </div>
              </SwiperSlide>
            ))}
        </Swiper>
      </div>
    </div>
  );
};

export default BannerCar;
