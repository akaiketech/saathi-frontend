import Link from "next/link";

const Header = () => {
  const tabs = [
    "Scheme",
    "Access",
    "Attention",
    "Training",
    "Help",
    "inclusion",
  ];

  return (
    <header className="w-full flex flex-col justify-center items-center">
      <h1 className="text-[#DC493A] text-8xl not-italic font-bold leading-[normal]">
        SAATHI
      </h1>
      <ol className=" flex justify-evenly">
        {tabs.map((tabsName, index) => (
          <li key={tabsName} className="flex justify-around w-full">
            <Link href="/"> {tabsName}</Link>
            {tabs.length - 1 > index && <span className="mx-8">|</span>}
          </li>
        ))}
      </ol>
    </header>
  );
};

export default Header;
