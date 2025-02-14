import React from "react";
import Link from "next/link";
import Image from "next/image";

const Logo = () => {
  return (
    <div className="bg-transparent">
      <Link href="/" className="flex gap-[10px]">
        <Image
          src={"/images/adminLogo.png"}
          alt="logo"
          height={30}
          width={35}
          className="w-[3rem] h-auto object-contain"
        />
        <h2 className="text-center">
          <span className="font-bold text-[1.5rem] font-sans uppercase text-white tracking-[1px] ">
            Pal and co
          </span>
        </h2>
      </Link>
    </div>
  );
};

export default Logo;
