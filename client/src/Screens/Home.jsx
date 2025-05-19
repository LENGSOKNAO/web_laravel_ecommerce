import React from "react";
import Layout from "../Layouts/Layout";
import Banner from "../Components/Home/Banner";
import { Link } from "react-router-dom";
import Trending from "../Components/Home/Trending";

const Home = () => {
  return (
    <Layout>
      <Banner />
      <div className="">
        {/* small */}
        <div className=" sm:block md:hidden">
          <div className="flex justify-center">
            <div className="w-[500px] text-center ">
              <h3 className="text-5xl py-3 "> TRENDING </h3>
              <p className="text-[12px]  ">
                It's not the rings or the titles that make A'ja Wilson top tier
                - it's the way she stays grounded from that high up. With her
                community behind her, she is always real. Always A'One
              </p>
              <div className="py-5">
                <Link className="bg-black text-white rounded-[30px] py-2 px-6 text-[10px]  ">
                  Explore the Collection
                </Link>
              </div>
            </div>
          </div>
        </div>
        {/* full */}
        <div className=" hidden sm:hidden md:block   ">
          <div className="flex justify-center">
            <div className="w-[800px] text-center ">
              <h3 className="text-[95.63px]"> TRNDING </h3>
              <p className="  text-[16px]  ">
                It's not the rings or the titles that make A'ja Wilson top tier
                - it's the way she stays grounded from that high up. With her
                community behind her, she is always real. Always A'One
              </p>
              <div className="py-10">
                <Link className="bg-black text-white rounded-[30px] py-2 px-10 text-[16px]  ">
                  Explore the Collection
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Trending />
    </Layout>
  );
};

export default Home;
