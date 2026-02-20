"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import NavBar from "@/app/component/NavBar";
import Cookies from "js-cookie";

export default function ThankYouPage() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const id = Cookies.get("ChampID");
    if (!id) {
      router.push("/");
    }
    
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push('/selection'); 
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [router]);

  return (
    <main className="relative w-full min-h-screen bg-black overflow-x-hidden flex flex-col items-center justify-center py-20 px-4">
      <div className="fixed inset-0 z-0">
        <img src="/thankyou-bg.png" alt="BG" className="w-full h-full object-cover opacity-100" />
      </div>

      <div className="relative z-10 flex flex-col items-center text-center animate-fade-in w-full max-w-lg">
        <h1 className="font-lubrifont text-5xl md:text-8xl text-gradient-yellow tracking-widest mb-6 drop-shadow-2xl uppercase">
            TERIMA<br className="md:hidden"/> KASIH
        </h1>

        <p className="font-lubrifont text-white/80 text-lg md:text-3xl tracking-widest mb-10 uppercase drop-shadow-md">
            PILIHAN ANDA BERHASIL DICATAT
        </p>

        {/* INDIKATOR REDIRECT */}
        <div className="flex flex-col items-center gap-4 w-full">
            <div className="w-48 md:w-64 h-2 bg-white/10 rounded-full overflow-hidden border border-white/5">
                <div 
                    className="h-full bg-[#FFC045] transition-all duration-1000 ease-linear shadow-[0_0_15px_rgba(255,192,69,0.8)] animate-pulse"
                    style={{ width: `${(countdown / 5) * 100}%` }}
                ></div>
            </div>
            
            <button 
              onClick={() => router.push('/selection')}
              className="mt-4 px-8 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full backdrop-blur-md transition-all group"
            >
              <span className="text-white font-lubrifont text-sm tracking-widest uppercase flex items-center gap-2">
                Kembali Sekarang <span className="animate-ping inline-block w-2 h-2 bg-[#FFC045] rounded-full"></span>
              </span>
            </button>

            <span className="text-white/30 font-lubrifont text-[10px] tracking-[0.3em] uppercase mt-2">
                OTOMATIS DALAM {countdown} DETIK
            </span>
        </div>
      </div>
      <div className="absolute top-0 left-0 w-full z-50">
          <NavBar data={null} />
      </div>
    </main>
  );
}