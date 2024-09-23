import React from "react";
import banner from "../../assets/banner.png";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();
  return (
    <div className=" bg-neutralSilver" id="home">
      <div className="px-4 lg:px-14 max-w-screen-2xl mx-auto min-h-screen h-screen flex justify-center items-center">
        <div className="my-28 md:my-8 py-12 flex flex-col w-full mx-auto md:flex-row-reverse items-center justify-between gap-12">
          <div>
            <img src={banner} alt="" />
          </div>

          <div className="md:w-1/2">
            <h1 className="text-5xl mb-4 font-semibold text-neutralDGrey md:w-3/4 leading-snug">
              Lessons and insights{" "}
              <span className="text-brandPrimary leading-snug">
                from 8 years
              </span>
            </h1>
            <p className="text-neutralGrey text-base mb-8">
              Where to grow your business as a photographer: site or social
              media?
            </p>
            <button className="px-7 py-2 bg-brandPrimary text-white rounded hover:bg-neutralDGrey" onClick={()=>navigate('/signup')}>
              Register
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
