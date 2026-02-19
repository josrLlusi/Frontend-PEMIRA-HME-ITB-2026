"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import Loading from "@/app/component/Loading";
import LogoHeader from "@/app/component/LogoHeader";
import LogoutModal from "@/app/component/LogOutModal";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL /*|| 'http://localhost:3000'*/;
const TOKEN = process.env.NEXT_PUBLIC_API_TOKEN;

export default function SelectionPage() {
  const router = useRouter();
  const [votedStatus, setVotedStatus] = useState({ ketua: false, senator: false });
  const [isLoading, setIsLoading] = useState(true);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  
  const isAllVoted = votedStatus.ketua && votedStatus.senator;

  useEffect(() => {
    const id = Cookies.get("ChampID");
      if (!id) {
        router.push("/");
      }
    const checkStatus = async () => {
      try {
        const [resKetua, resSenator] = await Promise.all([
          fetch(`${API_BASE_URL}/api/is_vote_specific`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username: id, category: "ketua", token: TOKEN }),
          }),
          fetch(`${API_BASE_URL}/api/is_vote_specific`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username: id, category: "senator", token: TOKEN }),
          })
        ]);

        const dataKetua = await resKetua.json();
        const dataSenator = await resSenator.json();

        setVotedStatus({
          ketua: dataKetua.data === "true",
          senator: dataSenator.data === "true"
        });
      } catch (error) {
        console.error("Gagal mengambil status voting", error);
      } finally {
        setIsLoading(false);
      }
    };
    checkStatus();
  }, [router]);

  const handleLogout = () => {
    Cookies.remove("ChampID");
    Cookies.remove("ChampName");
    Cookies.remove("ChampAccess");
    router.push("/");
    
  };

  return (
    <main className="relative w-full min-h-screen bg-black overflow-x-hidden flex flex-col items-center justify-center py-10 md:py-0">
      
      {/* BACKGROUND */}
      <div className="fixed inset-0 z-0 bg-gradient-to-b from-[#1A1A1A] to-[#010101]"></div>
      <img 
        src="/selection-decor.png" 
        alt="decor" 
        className={`fixed inset-0 w-full h-full object-fill z-1 pointer-events-none transition-all duration-1000 ${
          isAllVoted ? "opacity-100 blur-0" : "opacity-100 blur-sm"
        }`} 
      />

      <div className="relative z-10 w-full max-w-7xl px-4 flex flex-col items-center">
        
        {/* JUDUL DINAMIS */}
        <h1 className={`font-lubrifont text-gradient-yellow text-center tracking-widest mb-10 md:mb-16 uppercase drop-shadow-lg leading-tight ${isAllVoted ? 'text-2xl md:text-5xl max-w-4xl' : 'text-3xl md:text-7xl'}`}>
          {isAllVoted ? (
            "TERIMAKASIH SUDAH BERPARTISIPASI PADA KEGIATAN INI"
          ) : (
            <>PILIH SESI<br/><span className="text-[#FFF300]">VOTING</span></>
          )}
        </h1>

        {/* KARTU PILIHAN */}
        <div className="flex flex-col md:flex-row gap-10 md:gap-20 items-center justify-center w-full">
            
            {/* SENATOR */}
            <div className="flex flex-col items-center group w-[260px] md:w-[320px]">
                <button
                    onClick={() => router.push('/vote/senator')}
                    disabled={votedStatus.senator || isLoading}
                    className={`relative w-full h-[200px] md:h-[300px] flex items-center justify-center transition-all duration-500 rounded-3xl p-4 ${
                        votedStatus.senator 
                        ? "opacity-40 grayscale cursor-not-allowed border-2 border-white/10" 
                        : "hover:scale-110 hover:bg-white/5 border-2 border-transparent hover:border-[#FFC045]/30 cursor-pointer shadow-[0_0_50px_rgba(255,192,69,0.1)]"
                    }`}
                >
                    <img src="/icon-senator.png" alt="Senator" className="max-w-full max-h-full object-contain drop-shadow-2xl" />
                    {votedStatus.senator && (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="bg-black/80 text-[#FFC045] border border-[#FFC045] px-6 py-2 rounded-lg font-lubrifont text-sm tracking-widest">VOTED</span>
                        </div>
                    )}
                </button>
                <h2 className={`mt-6 font-lubrifont text-2xl tracking-widest transition-all ${votedStatus.senator ? "text-gray-500" : "text-gradient-silver"}`}>SENATOR</h2>
            </div>

            {/* KAHIM */}
            <div className="flex flex-col items-center group w-[260px] md:w-[320px]">
                <button
                    onClick={() => router.push('/vote/ketua')}
                    disabled={votedStatus.ketua || isLoading}
                    className={`relative w-full h-[200px] md:h-[300px] flex items-center justify-center transition-all duration-500 rounded-3xl p-4 ${
                        votedStatus.ketua 
                        ? "opacity-40 grayscale cursor-not-allowed border-2 border-white/10" 
                        : "hover:scale-110 hover:bg-white/5 border-2 border-transparent hover:border-[#FFC045]/30 cursor-pointer shadow-[0_0_50px_rgba(255,192,69,0.1)]"
                    }`}
                >
                    <img src="/icon-kahim.png" alt="Kahim" className="max-w-full max-h-full object-contain drop-shadow-2xl" />
                    {votedStatus.ketua && (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="bg-black/80 text-[#FFC045] border border-[#FFC045] px-6 py-2 rounded-lg font-lubrifont text-sm tracking-widest">VOTED</span>
                        </div>
                    )}
                </button>
                <h2 className={`mt-6 font-lubrifont text-2xl tracking-widest transition-all ${votedStatus.ketua ? "text-gray-500" : "text-gradient-silver"}`}>KAHIM</h2>
            </div>
        </div>

        {/* TOMBOL TAMBAHAN */}
        {isAllVoted && (
          <div className="mt-16 flex flex-col md:flex-row gap-6 animate-fade-in">
              <button
                  onClick={() => router.push("/livecount")}
                  className="px-10 py-3 bg-[#FFC045] text-black font-lubrifont text-xl rounded-xl hover:scale-105 active:scale-95 transition-all shadow-lg"
              >
                  LIHAT LIVE COUNT
              </button>
              <button
                  onClick={() => setShowLogoutModal(true)}
                  className="px-10 py-3 border-2 border-[#D22B2B] text-[#D22B2B] font-lubrifont text-xl rounded-xl hover:bg-[#D22B2B] hover:text-white transition-all shadow-lg"
              >
                  LOGOUT
              </button>
          </div>
        )}
      </div>
      <LogoutModal 
        isOpen={showLogoutModal} 
        onClose={() => setShowLogoutModal(false)} 
        onConfirm={handleLogout} 
      />
      <Loading condition={isLoading} />
      <LogoHeader />
    </main>
  );
}