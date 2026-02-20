'use client'
import Image from 'next/image';
import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import LogoutModal from '@/app/component/LogOutModal'; 

const NavBar = ({ data }: any) => {
  const router = useRouter();
  const pathname = usePathname();
  const [userName, setUserName] = useState<string>("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  useEffect(() => {

    if (pathname === "/") {
      setIsLoggedIn(false);
      return;
    }

    const hasSession = !!data || !!Cookies.get("ChampID");
    setIsLoggedIn(hasSession);

    if (hasSession) {
      const nameFromCookie = Cookies.get("ChampName");
      setUserName(nameFromCookie || "Mahasiswa");
    }
  }, [data, pathname]);


  const handleNavButtonClick = () => {
    if (isLoggedIn) {

      setShowLogoutModal(true);
    } else {

      router.push('/');
    }
  };


  const confirmLogout = () => {
    Cookies.remove('ChampID');
    Cookies.remove('ChampName');
    Cookies.remove('ChampAccess');
    Cookies.remove('ChampSig');
    

    setIsLoggedIn(false);
    setShowLogoutModal(false);
    

    router.push('/');
  };

  return (
    <>
      <nav className="fixed top-0 left-0 w-full z-[80] transition-all duration-300">
        <div className="mx-auto px-4 md:px-8 py-3 flex justify-between items-center bg-black/40 backdrop-blur-md border-b border-white/5">
        
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => router.push('/')}>
            <div className="relative h-10 w-10 md:h-16 md:w-16">
              <Image src="/Group 149.png" alt="Logo" fill className="object-contain" />
            </div>
            <div className="block">
              <h1 className="text-[#FFC045] font-lubrifont text-lg leading-none uppercase">PEMIRA HME</h1>
              <p className="text-gray-400 text-[10px] font-lubrifont font-bold tracking-[0.2em]">ITB 2026</p>
            </div>
          </div>

        
          <div className="flex items-center gap-3 md:gap-6">
            <button onClick={() => router.push('/livecount')} className="px-4 py-1.5 border border-[#FFC045]/40 rounded-full hover:bg-[#FFC045]/10 transition-all">
              <span className="text-[#FFC045] font-bold text-[10px] md:text-sm tracking-wide">LIVE COUNT</span>
            </button>

            {isLoggedIn && (
              <div className="hidden lg:flex flex-col items-end mr-1">
                <span className="text-[9px] text-gray-500 uppercase tracking-widest">Logged in</span>
                <span className="text-white font-bold text-sm">{userName.split(' ')[0]}</span>
              </div>
            )}

            <button
              onClick={handleNavButtonClick}
              className={`px-4 py-1.5 rounded-full font-bold text-[10px] md:text-sm transition-all ${isLoggedIn ? "bg-[#D22B2B] text-white hover:bg-red-700" : "bg-[#FFC045] text-black hover:bg-yellow-500"}`}
            >
              {isLoggedIn ? "LOGOUT" : "LOGIN"}
            </button>
          </div>
        </div>
      </nav>


      <LogoutModal 
        isOpen={showLogoutModal} 
        onClose={() => setShowLogoutModal(false)}
        onConfirm={confirmLogout}
      />
    </>
  );
};

export default NavBar;