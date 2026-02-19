"use client";
import { useState, useEffect } from "react";
import NavBar from "@/app/component/NavBar";
import Cookies from "js-cookie";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL /*|| 'http://localhost:3000'*/;

export default function LiveCount() {
  const [cookieValue, setCookieValue] = useState<string | undefined>(undefined);
  
  // State untuk menyimpan semua data suara
  const [totalVoted, setTotalVoted] = useState(0);
  const [stats, setStats] = useState({
    total: 0,
    kahim: { '00': '01'},
    senator: { '00': '01' }
  });
  
  const TARGET_KUORUM = 500; //sekian sekian

  useEffect(() => {
    setCookieValue(Cookies.get("ChampID"));

    const fetchData = async () => {
      try {
        const resTotal = await fetch(`${API_BASE_URL}/api/live_count`);
        const data = await resTotal.json();
        
        // Simpan data dari backend ke state
        if (data && typeof data.suara === 'number') {
          setTotalVoted(data.suara);
        }
      } catch (error) {
        console.error("Gagal mengambil data partisipasi:", error);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  const progressPercent = Math.min(Math.round((totalVoted / TARGET_KUORUM) * 100), 100);

  return (
    <main className="relative min-h-screen w-full bg-black flex flex-col items-center pb-32 overflow-x-hidden text-[#F8E5C1]">
      
      {/* BACKGROUND */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <img 
          src="/thankyou-bg.png" 
          alt="Background" 
          className="w-full h-full object-cover opacity-60" 
        />
      </div>

      {/* HEADER JUDUL */}
      <div className="relative z-10 text-center mb-16 mt-32 md:mt-40 animate-fade-in px-4">
        <h2 className="text-gradient-yellow font-lubrifont text-lg md:text-2xl tracking-[0.3em] uppercase mb-2">
            STATISTIK PEMIRA HME ITB 2026
        </h2>
        <h1 className="text-gradient-silver font-lubrifont text-4xl md:text-6xl tracking-[0.1em] uppercase drop-shadow-2xl">
            LIVE COUNT
        </h1>
        <div className="w-32 h-1 bg-gradient-to-r from-transparent via-[#FFC045] to-transparent mx-auto mt-6"></div>
      </div>

      {/* DAFTAR KANDIDAT */}
      
      {/* KAHIM */}
      <section className="relative z-10 w-full max-w-7xl px-4 mb-24 animate-fade-in-up">
        <h2 className="font-lubrifont text-center text-2xl md:text-3xl mb-12 tracking-widest text-[#FFFBB5] uppercase border-b border-white/10 pb-4 mx-auto max-w-lg">
          KANDIDAT KETUA HIMPUNAN
        </h2>
        <div className="flex flex-wrap justify-center gap-10 md:gap-24">
          <CandidateCard 
            id="00" 
            name="KOTAK KOSONG" 
            photo="/silhouette.png" 
            isSpecial
          />
          <CandidateCard 
            id="01" 
            name="FAUZAN" 
            photo="/cand-fauzan.png"
          />
        </div>
      </section>

      {/* SENATOR */}
      <section className="relative z-10 w-full max-w-7xl px-4 mb-24 animate-fade-in-up">
        <h2 className="font-lubrifont text-center text-2xl md:text-3xl mb-12 tracking-widest text-[#FFFBB5] uppercase border-b border-white/10 pb-4 mx-auto max-w-lg">
          KANDIDAT SENATOR
        </h2>
        <div className="flex flex-wrap justify-center gap-10 md:gap-24">
          <CandidateCard 
            id="00" 
            name="KOTAK KOSONG" 
            photo="/silhouette.png" 
            isSpecial
          />
          <CandidateCard 
            id="01" 
            name="QADAFI" 
            photo="/cand-qadafi.png"
          />
        </div>
      </section>

      {/* PANEL TOTAL SUARA */}
      <div className="relative z-20 w-[90%] max-w-4xl px-6 py-10 bg-black/60 backdrop-blur-xl rounded-[2rem] border border-[#FFC045]/30 text-center shadow-[0_0_50px_rgba(0,0,0,0.8)] animate-popup">
        
        <h3 className="font-lubrifont text-xl md:text-2xl text-gradient-silver mb-4 tracking-widest uppercase">
          TOTAL PARTISIPASI
        </h3>
        
        <div className="text-7xl md:text-9xl font-bold text-gradient-yellow mb-8 font-lubrifont drop-shadow-[0_0_20px_rgba(255,192,69,0.3)]">
          {totalVoted}
        </div>
        
        <div className="flex justify-between text-[10px] md:text-sm px-2 mb-3 text-white/50 font-lubrifont tracking-widest">
            <span>START: 0</span>
            <span>TARGET: {TARGET_KUORUM}</span>
        </div>

        {/* Progress Bar */}
        <div className="relative w-full h-10 md:h-14 bg-black/80 border border-white/10 rounded-full overflow-hidden shadow-inner p-1">
          <div 
            className="h-full rounded-full transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(255,192,69,0.4)]"
            style={{ 
                width: `${progressPercent}%`,
                background: `linear-gradient(90deg, #8A6D3B 0%, #FFC045 50%, #DDC28E 100%)`
            }}
          >
             <div className="w-full h-full relative overflow-hidden">
                <div className="absolute inset-0 bg-white/20 skew-x-12 translate-x-full animate-shine"></div>
             </div>
          </div>
          
          <div className="absolute inset-0 flex items-center justify-center z-10">
             <span className="font-lubrifont text-white text-lg md:text-xl drop-shadow-md tracking-widest">
                {progressPercent}%
             </span>
          </div>
        </div>
        
        <p className="mt-8 text-white/30 text-[10px] md:text-xs font-lubrifont uppercase tracking-[0.4em] animate-pulse">
          • Real-time Data Connection •
        </p>
      </div>

      <div className="absolute top-0 left-0 w-full z-50">
        <NavBar data={cookieValue} />
      </div>
    </main>
  );
}

// --- KOMPONEN KARTU KANDIDAT ---
function CandidateCard({ id, name, photo, isSpecial = false}: any) {
  return (
    <div className="relative flex flex-col items-center group transition-transform hover:scale-105 duration-500">
      
      <div className="absolute -top-4 w-[120%] h-[120%] z-0 bg-white/10 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

      {/* Area Foto */}
      <div className="relative w-40 h-52 md:w-56 md:h-[280px] z-10 flex items-center justify-center mb-4">
         <img 
           src={photo} 
           alt={name} 
           className={`max-w-full max-h-full object-contain drop-shadow-2xl transition-all duration-500
             ${isSpecial ? 'opacity-50' : 'grayscale-0'}`} 
         />
         <div className="absolute top-0 -left-8 font-lubrifont text-xl text-white/30">
           #{id}
         </div>
      </div>

      {/* Label Nama */}
      <div className="relative z-20 px-6 py-2 border border-white/10 rounded-lg min-w-[180px] text-center mb-4 bg-black/40 backdrop-blur-sm">
        <span className="font-lubrifont text-lg md:text-xl text-gradient-silver tracking-widest uppercase font-bold">
          {name}
        </span>
      </div>

    </div>
  );
}