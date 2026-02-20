"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";

export default function LogoHeader() {
  const [name, setName] = useState("");

  useEffect(() => {
    const savedName = Cookies.get("ChampName");
    if (savedName) setName(savedName);
  }, []);

  return (

    <header className="fixed top-0 left-0 w-full p-3 md:p-6 z-[90] flex justify-between items-center bg-gradient-to-b from-black/60 to-transparent pointer-events-none transition-all">
      

      <div className="flex items-center gap-2 md:gap-4 pointer-events-auto">

        <div className="relative w-10 h-10 md:w-16 md:h-16 drop-shadow-[0_0_12px_rgba(255,192,69,0.4)]">
          <Image 
            src="/Group 149.png"
            alt="Logo Pemira" 
            fill
            className="object-contain"
            priority
          />
        </div>
        

        <div className="block">
          <h1 className="font-lubrifont text-[#F8E5C1] text-base md:text-xl leading-none tracking-widest uppercase">
            PEMIRA
          </h1>
          <h2 className="font-lubrifont text-[#DDC28E] text-[10px] md:text-xs tracking-wider opacity-80">
            HME ITB 2026
          </h2>
        </div>
      </div>


      {name && (
        <div className="pointer-events-auto bg-black/50 backdrop-blur-md border border-[#A38855]/40 px-3 py-1.5 md:px-5 md:py-2 rounded-full shadow-lg transition-transform hover:scale-105">
          <p className="text-[#F8E5C1] font-lubrifont text-[10px] md:text-sm uppercase tracking-widest">
            <span className="md:inline hidden">Hi, </span>
            {name.split(' ')[0]}
          </p>
        </div>
      )}
    </header>
  );
}