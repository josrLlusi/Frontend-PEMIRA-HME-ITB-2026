"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import Loading from "@/app/component/Loading";
import LogoHeader from "@/app/component/LogoHeader";
import { MOCK_SETTING } from "@/app/mockConfig"; // Import Saklar Mocking

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
const TOKEN = process.env.NEXT_PUBLIC_API_TOKEN;

export default function SelectionPage() {
  const router = useRouter();
  const [cookieValue, setCookieValue] = useState<string | undefined>(undefined);
  const [votedStatus, setVotedStatus] = useState({ ketua: false, senator: false });
  const [isLoading, setIsLoading] = useState(true);
  
  const isAllVoted = votedStatus.ketua && votedStatus.senator;

  useEffect(() => {
    const id = Cookies.get("ChampID");
    setCookieValue(id);

    const checkStatus = async () => {
      // --- 1. LOGIKA MOCKING ---
      if (MOCK_SETTING.isEnabled) {
        console.log("--- MODE MOCKING: Mengecek Status Vote ---");
        
        // Simulasi delay agar kita bisa melihat komponen Loading bekerja
        setTimeout(() => {
          setVotedStatus({
            ketua: MOCK_SETTING.votedStatus.ketua,
            senator: MOCK_SETTING.votedStatus.senator
          });
          setIsLoading(false);
        }, 1500); 
        return; // Berhenti di sini, jangan jalankan fetch asli
      }

      // --- 2. KODE ASLI (Hanya jalan jika MOCK_SETTING.isEnabled = false) ---
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
    if (window.confirm("Apakah Anda yakin ingin keluar?")) {
      Cookies.remove("ChampID");
      Cookies.remove("ChampName");
      Cookies.remove("ChampAccess");
      router.push("/");
    }
  };

  return (
    <main className="relative w-full min-h-screen bg-black overflow-x-hidden flex flex-col items-center justify-center py-10 md:py-0">
      
      <div className="fixed inset-0 z-0 bg-gradient-to-b from-[#1A1A1A] to-[#010101]"></div>
      
      <img 
        src="/selection-decor.png" 
        alt="decor" 
        className={`fixed inset-0 w-full h-full object-cover z-1 pointer-events-none transition-all duration-1000 ${
          isAllVoted ? "opacity-100 blur-0" : "opacity-100 blur-sm"
        }`} 
      />

      <div className="relative z-10 w-full max-w-7xl px-4 flex flex-col items-center">
        
        {isAllVoted ? (
            <div className="flex flex-col items-center justify-center w-full animate-fade-in text-center py-20">
                <h1 className="font-lubrifont text-5xl md:text-8xl text-gradient-yellow tracking-widest leading-tight mb-4 drop-shadow-2xl uppercase">
                    TERIMA<br/>KASIH
                </h1>
                <p className="font-lubrifont text-white/70 text-lg md:text-3xl tracking-widest mb-12 uppercase px-4">
                    Pilihan Anda Berhasil Dicatat
                </p>

                <button
                    onClick={handleLogout}
                    className="group relative px-10 py-3 bg-black border-2 border-[#D22B2B] rounded-xl overflow-hidden transition-all hover:bg-[#D22B2B] shadow-[0_0_20px_rgba(210,43,43,0.3)]"
                >
                    <span className="font-lubrifont text-[#D22B2B] text-xl md:text-2xl tracking-widest group-hover:text-white">
                        LOGOUT
                    </span>
                </button>
            </div>
        ) : (
            
            <div className="flex flex-col items-center w-full justify-center">
                <h1 className="font-lubrifont text-3xl md:text-7xl text-gradient-yellow text-center tracking-widest mb-10 md:mb-20 uppercase drop-shadow-lg leading-tight">
                    PILIH SESI<br/><span className="text-[#FFF300]">VOTING</span>
                </h1>

                <div className="flex flex-col md:flex-row gap-10 md:gap-24 items-center md:items-start justify-center w-full">
                    
                    {/* 1. TOMBOL SENATOR */}
                    <div className="flex flex-col items-center group w-[280px] md:w-[350px]">
                        <button
                            onClick={() => router.push('/vote/senator')}
                            disabled={votedStatus.senator || isLoading}
                            className={`relative w-full h-[220px] md:h-[350px] flex items-center justify-center transition-all duration-500 rounded-3xl p-4 ${
                                votedStatus.senator 
                                ? "opacity-40 grayscale cursor-not-allowed" 
                                : "hover:scale-110 hover:bg-white/5 border-2 border-transparent hover:border-[#FFC045]/30 cursor-pointer shadow-[0_0_50px_rgba(255,192,69,0.1)]"
                            }`}
                        >
                            <img src="/icon-senator.png" alt="Senator" className="max-w-full max-h-full object-contain drop-shadow-2xl" />
                            {votedStatus.senator && (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="bg-black/80 text-[#FFC045] border border-[#FFC045] px-6 py-2 rounded-lg font-lubrifont text-sm tracking-widest backdrop-blur-md">VOTED</span>
                                </div>
                            )}
                        </button>
                        <h2 className={`mt-6 font-lubrifont text-2xl md:text-3xl tracking-widest transition-all drop-shadow-md ${votedStatus.senator ? "text-gray-500" : "text-gradient-silver group-hover:text-gradient-yellow"}`}>
                            SENATOR
                        </h2>
                    </div>

                    {/* 2. TOMBOL KAHIM */}
                    <div className="flex flex-col items-center group w-[280px] md:w-[350px]">
                        <button
                            onClick={() => router.push('/vote/ketua')}
                            disabled={votedStatus.ketua || isLoading}
                            className={`relative w-full h-[220px] md:h-[350px] flex items-center justify-center transition-all duration-500 rounded-3xl p-4 ${
                                votedStatus.ketua 
                                ? "opacity-40 grayscale cursor-not-allowed" 
                                : "hover:scale-110 hover:bg-white/5 border-2 border-transparent hover:border-[#FFC045]/30 cursor-pointer shadow-[0_0_50px_rgba(255,192,69,0.1)]"
                            }`}
                        >
                             <img src="/icon-kahim.png" alt="Kahim" className="max-w-full max-h-full object-contain drop-shadow-2xl" />
                             {votedStatus.ketua && (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="bg-black/80 text-[#FFC045] border border-[#FFC045] px-6 py-2 rounded-lg font-lubrifont text-sm tracking-widest backdrop-blur-md">VOTED</span>
                                </div>
                            )}
                        </button>
                        <h2 className={`mt-6 font-lubrifont text-2xl md:text-3xl tracking-widest transition-all drop-shadow-md ${votedStatus.ketua ? "text-gray-500" : "text-gradient-silver group-hover:text-gradient-yellow"}`}>
                            KAHIM
                        </h2>
                    </div>
                </div>
            </div>
        )}
      </div>

      <Loading condition={isLoading} />
      <LogoHeader />
    </main>
  );
}