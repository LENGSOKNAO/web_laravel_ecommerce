import React from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css/scrollbar";
import { Scrollbar } from "swiper/modules";

const Banner1 = ({ e, n, b }) => {
  return (
    <div className="">
      <div className="">
        {e
          .filter((e) => e.status == "1" && e.qty == n && e.category == b)
          .slice(0, 1)
          .map((e, i) => (
            <div className="relative h-[933.33px]  mx-auto">
              <img
                className="w-full h-full object-cover"
                src={`${import.meta.env.VITE_STORAGE_URL}/${e.image}`}
                alt={e.title || "Product Image"}
              />
              <div className="absolute bottom-0 p-7 w-full text-white">
                <div className="text-6xl te ">{e.name}</div>
                <div className="text-sm py-5 font-[400] ">{e.description}</div>
                <Link className="bg-white shadow-5xl text-black rounded-[30px] py-3 px-[30px] font-medium text-[16px] inline-block">
                  Shop
                </Link>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Banner1;
