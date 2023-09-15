"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { useGlobalContext } from "../context";
import { startSessionApi } from "./util";
import Image from "next/image";

const tabs = ["Scheme", "Access", "Attention", "Training", "Help", "inclusion"];

const Terms = () => {
  const router = useRouter();
  const { language, setSessionId } = useGlobalContext();
  const [loading, setLoading] = useState(false);

  const handleAccept = async () => {
    setLoading(true);
    startSessionApi(language, (id: string) => {
      console.log("🚀 ~ file: page.tsx:20 ~ startSessionApi ~ id:", id);
      setSessionId(id);
      router.push("/chat");
    });
  };
  const handleDecline = () => {
    router.replace("/");
  };

  return (
    <main className="flex min-h-screen flex-col items-center mt-6">
      <header>
        <h1 className="text-[#DC493A] text-8xl not-italic font-bold leading-[normal] text-center">
          SAATHI
        </h1>
        <ol className=" flex justify-evenly">
          {tabs.map((tabsName, index) => (
            <li key={tabsName} className="flex justify-around w-full">
              <Link href="/" className="text-xl">
                {" "}
                {tabsName}
              </Link>
              {tabs.length - 1 > index && <span className="mx-8">|</span>}
            </li>
          ))}
        </ol>
      </header>
      <section className=" bg-[#F1F1F1] mt-8 rounded-[40px] p-8   w-[95%]">
        <h2 className="text-[#302B27] text-[48px] not-italic font-bold leading-[normal]">
          Terms & Conditions
        </h2>
        <div className="mt-4 h-[600px] overflow-y-scroll text-[#6D6D6D] text-xl not-italic font-normal leading-[normal]">
          {language === "hindi" ? (
            <div>
              <div className="font-semibold">
                SAATHI User Consent Terms and Conditions
              </div>
              <div>
                <div className="my-4">
                  SAATHI is developed by a consortium of researchers (Indian
                  Institute of Science, Bangalore, and Oxford Brookes
                  University, UK), technical experts from Akaike Technologies
                  and the banking professionals from Kotak Mahindra Bank.
                </div>
                <ul>
                  <li className="my-2">
                    ● SAATHI aims to provide you with answers for your queries.
                  </li>
                  <li className="my-2">
                    ● SAATHI stores your questions and the answers that it
                    provides so that we can validate and verify if the answers
                    were appropriate and relevant to your question.
                  </li>
                  <li className="my-2">
                    ● SAATHI does not ask or store your personal information.
                  </li>
                  <li className="my-2">
                    ● SAATHI aims to be a very helpful tool and any bias in the
                    answer is unintentional. By asking a query to SAATHI you are
                    agreeing to the above terms and conditions.
                  </li>
                </ul>
              </div>
            </div>
          ) : (
            <div>
              SAATHI User Consent Terms and Conditions SAATHI is developed by a
              consortium of researchers (Indian Institute of Science, Bangalore,
              and Oxford Brookes University, UK), technical experts from Akaike
              Technologies and the banking professionals from Kotak Mahindra
              Bank. ● SAATHI aims to provide you with answers for your queries.
              ● SAATHI stores your questions and the answers that it provides so
              that we can validate and verify if the answers were appropriate
              and relevant to your question. ● SAATHI does not ask or store your
              personal information. ● SAATHI aims to be a very helpful tool and
              any bias in the answer is unintentional. By asking a query to
              SAATHI you are agreeing to the above terms and conditions.
            </div>
          )}
        </div>
      </section>
      <footer className="mt-16 flex justify-evenly items-center w-full">
        <div
          onClick={handleAccept}
          className={`${
            loading ? "opacity-50 pointer-events-none" : "" // Disable button when loading
          } shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] rounded-[60px] bg-[#ff725e] text-white text-[50px] not-italic font-bold leading-[normal]  flex justify-between items-center w-[40%] py-4`}
        >
          <div className="flex justify-between ">
            <div className="ml-8">{loading ? "Loading..." : "ACCEPT"}</div>
            {!loading && (
              <Image
                src="../check.svg"
                alt="avatar"
                height={40}
                width={40}
                className="ml-8"
              />
            )}
          </div>
          {!loading && (
            <span className="pl-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="46"
                height="46"
                viewBox="0 0 46 46"
                fill="none"
              ></svg>
            </span>
          )}
        </div>
        <div
          onClick={handleDecline}
          className={`${
            loading ? "opacity-50 pointer-events-none" : "" // Disable button when loading
          } border shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] rounded-[60px] border-solid border-[#D6D6D6] text-[#302B27] text-[50px] not-italic font-bold leading-[normal] px-8 py-4 flex justify-between items-center`}
        >
          DECLINE
          <Image
            src="../cross.svg"
            alt="avatar"
            height={32}
            width={32}
            className="ml-8"
          />
        </div>
      </footer>
    </main>
  );
};

export default Terms;
