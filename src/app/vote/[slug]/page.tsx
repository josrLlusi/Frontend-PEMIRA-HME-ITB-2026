"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter, notFound } from "next/navigation";
import Cookies from "js-cookie";
import Loading from "@/app/component/Loading";
import LogoHeader from "@/app/component/LogoHeader";
import ErrorDialogBox from "@/app/component/ErrorDialogBox";

// KONFIGURASI PRODUKSI
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL /*|| 'http://localhost:3000'*/;
const TOKEN = process.env.NEXT_PUBLIC_API_TOKEN;

export default function VotePage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug;

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [cookieValue, setCookieValue] = useState<string | undefined>(undefined);

  const [errorMsg, setErrorMsg] = useState("");
  const [isErrorOpen, setIsErrorOpen] = useState(false);

  const triggerError = (message: string) => {
    setErrorMsg(message);
    setIsErrorOpen(true);
    setTimeout(() => setIsErrorOpen(false), 3000);
    };

  useEffect(() => {
    const validSlugs = ["kahim", "senator"];
    if (!validSlugs.includes(slug as string)) {
      notFound();
    }
    const id = Cookies.get("ChampID");
    if (!id) {
      router.push("/"); // Proteksi jika user mencoba akses tanpa login
    }
    setCookieValue(id);
  }, [slug, router]);

  // Spesifikasi Kahim
  const dataKahim = [
    { id: "00", name: "KOTAK KOSONG", image: "/silhouette.png" }, 
    { id: "01", name: "FAUZAN", image: "/cand-fauzan.png" },
  ];

  const dataSenator = [
    { id: "00", name: "KOTAK KOSONG", image: "/silhouette.png" }, 
    { id: "01", name: "QADAFI", image: "/cand-qadafi.png" },
  ];

  const isKahim = slug === "kahim";
  const candidates = isKahim ? dataKahim : dataSenator;
  const titleCategory = isKahim ? "KAHIM" : "SENATOR";
  const bgDecor = isKahim ? "/bg-decor-kahim.png" : "/bg-decor-senator.png";

  const handleVoteSubmit = async () => {
    if (!selectedId || loading) return;

    setShowConfirm(false);
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: cookieValue,
          pilihan: selectedId,
          token: TOKEN,
          category: slug,
        }),
      });

      if (response.ok) {
        router.push("/thankyou");
      } else {
        const resData = await response.json();
        triggerError(resData.message || "Gagal melakukan voting. Silakan coba lagi.");
      }
    } catch (error) {
      console.error("Submission error:", error);
      triggerError("Terjadi kesalahan koneksi ke server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative w-full min-h-screen bg-black flex flex-col items-center overflow-x-hidden">
      
      {/* BACKGROUND DECORATION */}
      <div className="fixed inset-0 z-0 pointer-events-none flex items-end justify-center">
         <img 
            src={bgDecor} 
            alt="Background Frame" 
            className="w-full h-full object-fill opacity-100"
         />
      </div>

      {/* CONTENT */}
      <div className="relative z-10 w-full min-h-screen flex flex-col items-center pt-16 md:pt-20 pb-40 px-4">
        
        {/* HEADER */}
        <div className="text-center mb-6">
            <h2 className="text-gradient-yellow font-lubrifont text-xl md:text-2xl tracking-[0.3em] drop-shadow-md uppercase">
                PEMILIHAN
            </h2>
            <h1 className="text-gradient-silver font-lubrifont text-4xl md:text-6xl tracking-[0.1em] drop-shadow-lg uppercase">
                {titleCategory}
            </h1>
        </div>

        {/* CANDIDATE GRID */}
        <div className="w-full max-w-7xl flex-1 flex flex-col items-center justify-center">
            <div className="flex flex-col md:flex-row flex-wrap justify-center gap-16 md:gap-24 items-start">
                
                {candidates.map((can) => {
                    const isSelected = selectedId === can.id;
                    const isHovered = hoveredId === can.id;

                    return (
                        <div 
                            key={can.id}
                            onMouseEnter={() => setHoveredId(can.id)}
                            onMouseLeave={() => setHoveredId(null)}
                            onClick={() => setSelectedId(isSelected ? null : can.id)}
                            className="relative flex flex-col items-center cursor-pointer group transition-all"
                        >
                            {/* GLOW EFFECT */}
                            {(isHovered || isSelected) && (
                                <img 
                                    src="/Rectangle 82.png" 
                                    alt="glow" 
                                    className="absolute -top-6 w-[130%] h-[125%] z-0 object-fill opacity-100 animate-fade-in pointer-events-none"
                                />
                            )}

                            {/* CANDIDATE PHOTO */}
                            <div className={`
                                relative w-48 h-64 md:w-64 md:h-[380px] z-10 flex items-center justify-center transition-all
                                ${isHovered || isSelected ? "scale-105" : "scale-100 opacity-80"}
                            `}>
                                <img 
                                    src={can.image} 
                                    alt={can.name} 
                                    className="max-w-full max-h-full object-contain drop-shadow-2xl" 
                                />
                                <div className="absolute top-0 -left-10 font-lubrifont text-xl text-white/50">
                                    #{can.id}
                                </div>
                            </div>

                            {/* NAME LABEL */}
                            <div className={`
                                relative z-20 mt-4 px-6 py-2 transition-all min-w-[160px] text-center
                                ${isSelected 
                                    ? "bg-[#FFC045] text-black shadow-[0_0_20px_rgba(255,192,69,0.6)] border-none" 
                                    : "bg-gradient-to-t from-[#999999] to-[#FFFFFF] bg-clip-text text-transparent"
                                }
                            `}>
                                <span className={`
                                    font-lubrifont text-2xl tracking-[0.15em] uppercase font-bold
                                    ${isSelected ? "text-black" : "bg-gradient-to-t from-[#999999] to-[#FFFFFF] bg-clip-text text-transparent"}
                                `}>
                                    {can.name}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>

        {/* SUBMIT BUTTON */}
        <div className="fixed bottom-0 left-0 w-full p-8 flex justify-center z-[100] bg-gradient-to-t from-black via-black/80 to-transparent">
             <button
                onClick={() => setShowConfirm(true)}
                disabled={!selectedId || loading}
                className={`
                    font-lubrifont text-lg md:text-2xl py-3 px-12 md:px-20 rounded-xl border-2 tracking-[0.2em] transition-all duration-300
                    ${!selectedId 
                        ? "bg-[#1A1A1A] border-gray-700 text-gray-500 cursor-not-allowed opacity-50" 
                        : "bg-[#D22B2B] border-white text-white hover:scale-105 shadow-[0_0_40px_rgba(210,43,43,0.5)] active:scale-95"
                    }
                `}
            >
                {loading ? "MEMPROSES..." : "PILIH SEKARANG"}
            </button>
        </div>

      </div>

      {/* CONFIRMATION POPUP */}
      {showConfirm && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 animate-fade-in">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setShowConfirm(false)}></div>
            <div className="relative bg-[#111111] border-2 border-[#FFC045] p-6 md:p-10 rounded-3xl max-w-md w-full text-center shadow-[0_0_60px_rgba(0,0,0,1)]">
                <h3 className="font-lubrifont text-white text-2xl md:text-3xl mb-4 tracking-widest uppercase">KONFIRMASI</h3>
                <p className="text-gray-300 font-abhaya text-lg mb-8 leading-relaxed">
                    Yakin ingin memilih <span className="text-[#FFC045] font-bold">{candidates.find(c => c.id === selectedId)?.name}</span>? <br/>
                    Pilihan tidak dapat diubah kembali.
                </p>
                <div className="flex gap-4">
                    <button 
                        onClick={() => setShowConfirm(false)}
                        className="flex-1 py-3 border border-white/20 text-white font-lubrifont rounded-xl hover:bg-white/5 transition-colors"
                    >
                        BATAL
                    </button>
                    <button 
                        onClick={handleVoteSubmit}
                        className="flex-1 py-3 bg-[#FFC045] text-black font-lubrifont rounded-xl font-bold hover:bg-[#FFF300] transition-colors shadow-lg"
                    >
                        PILIH
                    </button>
                </div>
            </div>
        </div>
      )}

      <Loading condition={loading} />
      <ErrorDialogBox condition={isErrorOpen} errormessage={errorMsg} />
      <div className="absolute top-6 right-6 z-50">
          <LogoHeader />
      </div>

    </main>
  );
}