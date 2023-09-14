"use client";

import { ChangeEvent, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useGlobalContext } from "./context";

const tabs = ["Scheme", "Access", "Attention", "Training", "Help", "inclusion"];

const Home = () => {
  const { language, setLanguage, voice, setVoice } = useGlobalContext();

  const handleLanguageChange = (event: ChangeEvent<HTMLInputElement>) =>
    setLanguage(event.target.value);

  const handleVoiceChange = (event: ChangeEvent<HTMLInputElement>) =>
    setVoice(event.target.value);

  return (
    <main className="flex flex-col items-center mt-6">
      <header>
        <h1 className="text-[#DC493A] text-8xl not-italic font-bold leading-[normal] text-center">
          SAATHI
        </h1>
        <ol className=" flex justify-evenly mt-4">
          {tabs.map((tabsName, index) => (
            <li key={tabsName} className="flex justify-around">
              <Link href="/"> {tabsName}</Link>
              {tabs.length - 1 > index && <span className="mx-8">|</span>}
            </li>
          ))}
        </ol>
      </header>
      <>
        <section className="mt-8">
          <h3 className="text-black text-4xl not-italic font-normal leading-[normal]">
            Select Language
          </h3>
          <section className="rounded-[40px] bg-[#efefef] flex px-16 py-4 mt-4">
            <div className=" mr-8">
              <input
                id="english"
                type="radio"
                className="bg-[#DC493A] h-8 w-8 mr-4 text-[#DC493A] border-[#DC493A]"
                value="english"
                checked={language === "english"}
                onChange={handleLanguageChange}
              />
              <label className="text-[#302B27] text-5xl not-italic font-bold leading-[normal]">
                English
              </label>
            </div>
            <div>
              <input
                id="hindi"
                type="radio"
                value="hindi"
                className="bg-[#DC493A] h-8 w-8 mr-4"
                checked={language === "hindi"}
                onChange={handleLanguageChange}
              />
              <label className="text-[#302B27] text-5xl not-italic font-bold leading-[normal]">
                हिन्दी
              </label>
            </div>
          </section>
        </section>
        <section className="mt-8">
          <h3 className="text-black text-4xl not-italic font-normal leading-[normal]">
            Select Voice
          </h3>
          <form className="rounded-[40px] bg-[#efefef] flex px-16 py-4 mt-4">
            <div className=" mr-8">
              <input
                id="female"
                type="radio"
                value="female"
                className="bg-[#DC493A] h-8 w-8 mr-4"
                checked={voice === "female"}
                onChange={handleVoiceChange}
              />
              <label className="text-[#302B27] text-5xl not-italic font-bold leading-[normal]">
                Female
              </label>
            </div>
            <div>
              <input
                id="male"
                type="radio"
                value="male"
                className="bg-[#DC493A] h-8 w-8 mr-4"
                checked={voice === "male"}
                onChange={handleVoiceChange}
              />
              <label className="text-[#302B27] text-5xl not-italic font-bold leading-[normal]">
                Male
              </label>
            </div>
          </form>
        </section>
        <section className="mt-8 ">
          <Link
            href="/terms"
            className="shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] rounded-[60px] bg-[#ff725e] text-white text-[64px] not-italic font-bold leading-[normal] px-16 py-4 flex justify-between items-center"
          >
            START
            <span className="pl-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="70"
                height="70"
                viewBox="0 0 70 70"
                fill="none"
              >
                <path
                  d="M28.4375 4.375C24.9578 4.37905 21.6217 5.76316 19.1612 8.2237C16.7007 10.6842 15.3166 14.0203 15.3125 17.5H19.6875C19.6875 15.1794 20.6094 12.9538 22.2503 11.3128C23.8913 9.67187 26.1169 8.75 28.4375 8.75C30.7581 8.75 32.9837 9.67187 34.6247 11.3128C36.2656 12.9538 37.1875 15.1794 37.1875 17.5H41.5625C41.5584 14.0203 40.1743 10.6842 37.7138 8.2237C35.2533 5.76316 31.9172 4.37905 28.4375 4.375Z"
                  fill="white"
                />
                <path
                  d="M45.9375 65.625H36.225C34.0303 65.6244 31.916 64.7992 30.3012 63.3128L10.1762 44.7934C9.70637 44.3639 9.33579 43.837 9.09034 43.2496C8.84489 42.6622 8.73047 42.0283 8.75504 41.3922C8.77961 40.756 8.94259 40.1328 9.23262 39.5661C9.52265 38.9993 9.93276 38.5027 10.4344 38.1106C11.2937 37.481 12.3473 37.1739 13.4103 37.2431C14.4734 37.3123 15.4782 37.7534 16.2487 38.4891L24.0625 45.6247V17.5C24.0625 16.3397 24.5234 15.2269 25.3439 14.4064C26.1644 13.5859 27.2772 13.125 28.4375 13.125C29.5978 13.125 30.7106 13.5859 31.5311 14.4064C32.3516 15.2269 32.8125 16.3397 32.8125 17.5V32.8125C32.8125 31.6522 33.2734 30.5394 34.0939 29.7189C34.9144 28.8984 36.0272 28.4375 37.1875 28.4375C38.3478 28.4375 39.4606 28.8984 40.2811 29.7189C41.1016 30.5394 41.5625 31.6522 41.5625 32.8125V35C41.5625 33.8397 42.0234 32.7269 42.8439 31.9064C43.6644 31.0859 44.7772 30.625 45.9375 30.625C47.0978 30.625 48.2106 31.0859 49.0311 31.9064C49.8516 32.7269 50.3125 33.8397 50.3125 35V37.1875C50.3125 36.0272 50.7734 34.9144 51.5939 34.0939C52.4144 33.2734 53.5272 32.8125 54.6875 32.8125C55.8478 32.8125 56.9606 33.2734 57.7811 34.0939C58.6016 34.9144 59.0625 36.0272 59.0625 37.1875V52.5C59.0625 55.981 57.6797 59.3194 55.2183 61.7808C52.7569 64.2422 49.4185 65.625 45.9375 65.625Z"
                  fill="white"
                />
              </svg>
            </span>
          </Link>
        </section>
      </>
      <footer className="mt-8 flex justify-center">
        <Image
          className="ml-16 w-[50%] "
          height={1}
          width={1}
          src="/Illustration - Male.svg"
          alt="Illustration - Male.svg"
          priority
        />
      </footer>
    </main>
  );
};

export default Home;
