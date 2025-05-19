import React from "react";
import { Swiper, SwiperSlide } from "swiper/react"; // Import Swiper components
import { Autoplay, Navigation } from "swiper/modules"; // Import Swiper modules

const Slider = ({ e }) => {
  const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp"];
  const isImage = (fileName) => {
    return imageExtensions.some((ext) => fileName?.toLowerCase().endsWith(ext));
  };

  return (
    <div>
      {" "}
      <Swiper
        modules={[Autoplay, Navigation]}
        autoplay={{
          delay: 60000,
          disableOnInteraction: false,
        }}
        loop={true}
        className="banner-slider relative "
      >
        {e
          .filter((e) => e.status == "1")
          .map((e, i) => (
            <SwiperSlide key={i}>
              {isImage(e.image) ? (
                <div className="h-[900px] lg:h-[700px] xl:h-[800px]">
                  <img
                    src={`${import.meta.env.VITE_STORAGE_URL}/${e.image}`}
                    alt=""
                    className="hidden sm:hidden lg:block w-full h-full object-cover "
                  />
                  <img
                    src={`${import.meta.env.VITE_STORAGE_URL}/${e.small_image}`}
                    alt=""
                    className="xl:hidden w-full h-full object-cover"
                  />
                  {/* small */}
                  <div className="  lg:hidden xl:hidden  text-center text-[rgb(255,255,255,0.9)] p-[100px] absolute inset-0 flex flex-col justify-end items-center">
                    <div className=" w-[600px] ">
                      <h2 className="text-5xl font-[900] te tracking-[5px] ">
                        {e.name}{" "}
                      </h2>
                      <p className="text-sm py-2 "> {e.description} </p>
                    </div>
                  </div>

                  {/* full */}
                  <div className="hidden lg:block">
                    <div className="text-center text-[rgb(255,255,255,0.9)] p-[100px] absolute inset-0 flex flex-col justify-end items-center">
                      <div className=" w-[700px] ">
                        <h2 className="text-8xl font-[900] te tracking-[5px] ">
                          {e.name}{" "}
                        </h2>
                        <p className="text-sm py-2 "> {e.description} </p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-[900px] bg-amber-100 lg:h-[700px] xl:h-[800px]">
                  <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full  object-cover "
                  >
                    <source
                      src={`${import.meta.env.VITE_STORAGE_URL}/${e.image}`}
                      type="video/mp4"
                    />
                  </video>
                  {/* small */}
                  <div className="  lg:hidden xl:hidden  text-center text-[rgb(255,255,255,0.9)] p-[100px] absolute inset-0 flex flex-col justify-end items-center">
                    <div className=" w-[600px] ">
                      <h2 className="text-5xl font-[900] te tracking-[5px] ">
                        {e.name}{" "}
                      </h2>
                      <p className="text-sm py-2 "> {e.description} </p>
                    </div>
                  </div>

                  {/* full */}
                  <div className="hidden lg:block">
                    <div className="text-center text-[rgb(255,255,255,0.9)] p-[100px] absolute inset-0 flex flex-col justify-end items-center">
                      <div className=" w-[700px] ">
                        <h2 className="text-8xl font-[900] te tracking-[5px] ">
                          {e.name}{" "}
                        </h2>
                        <p className="text-sm py-2 "> {e.description} </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </SwiperSlide>
          ))}
      </Swiper>
    </div>
  );
};

export default Slider;
