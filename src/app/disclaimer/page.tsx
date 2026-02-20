"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import LogoHeader from "@/app/component/LogoHeader";
import Cookies from "js-cookie";

export default function DisclaimerPage() {
  const router = useRouter();
  const [agreed, setAgreed] = useState(false);
  const [showCopyPopup, setShowCopyPopup] = useState(false);

  const contactPerson = "081234567890 (Panitia PEMIRA)";

  useEffect(() => {
    const id = Cookies.get("ChampID");
    if (!id) {
      router.push("/");
    }
    }, [router]);

  const handleCopy = () => {
    navigator.clipboard.writeText(contactPerson);
    setShowCopyPopup(true);
    setTimeout(() => {
      setShowCopyPopup(false);
    }, 3000);
  };

  return (

    <main className="relative w-full min-h-screen flex flex-col items-center justify-center bg-black py-12 md:py-20 overflow-x-hidden">
      
      {/* Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <img 
          src="/disclaimer-bg.png" 
          alt="Background" 
          className="w-full h-full object-cover opacity-40 md:opacity-60" 
        />
        <img 
          src="/disclaimer-decor.png" 
          alt="Decoration" 
          className="absolute inset-0 w-full h-full object-fill z-10 opacity-80 md:opacity-100" 
        />
      </div>

      {/* Konten Modal */}
      <div className="relative z-20 w-[92%] max-w-4xl flex flex-col items-center justify-center p-2 my-auto">
        
        <div className="absolute inset-0 z-0">
            <img 
                src="/modal-box.png" 
                alt="Modal Box" 
                className="w-full h-full object-fill rounded-3xl opacity-80 md:opacity-60 shadow-2xl" 
            />
        </div>

        {/* Isi Konten Text */}
        <div className="relative z-10 w-full px-6 py-10 md:px-16 md:py-14 flex flex-col text-[#F8E5C1]">
            
            <h1 className="text-2xl sm:text-3xl md:text-5xl font-lubrifont text-center mb-8 text-gradient-yellow tracking-widest uppercase leading-tight">
                ALUR PEMILIHAN & VERIFIKASI
            </h1>
            
            <div className="font-lubrifont text-base md:text-xl leading-relaxed space-y-6">
                <div>
                    <p className="font-bold border-b-2 border-white pb-1 mb-4 text-[#FFF300] inline-block tracking-wide">
                        TAHAPAN VOTING:
                    </p>
                    <ol className="list-decimal ml-6 space-y-2 text-gray-200">
                        <li>Autentikasi menggunakan Akun NIM & Password.</li>
                        <li><strong className="text-[#FFF300]">Verifikasi Wajah</strong>: Pengambilan foto selfie sebagai validasi kehadiran (wajib).</li>
                        <li>Memilih kandidat pada sesi Ketua Himpunan & Senator.</li>
                        <li>Konfirmasi final suara digital.</li>
                    </ol>
                </div>

                <blockquote className="bg-[#B3403D]/20 p-4 border-l-4 border-[#B3403D] italic text-sm md:text-base rounded-r-lg text-gray-300">
                    "Data foto selfie Anda digunakan secara eksklusif untuk kepentingan audit kehadiran PEMIRA HME ITB 2026 dan tidak akan disalahgunakan untuk kepentingan di luar hal tersebut."
                </blockquote>

                {/* Info Kontak Ringkas */}
                <div className="flex flex-col lg:flex-row items-center justify-between gap-4 pt-2">
                    <p className="text-xs md:text-sm text-gray-400 text-center lg:text-left">Kendala dengan pengambilan foto? Hubungi Panitia:</p>
                    <div 
                        className="flex items-center gap-3 bg-black/60 px-4 py-2 rounded-lg border border-[#FFFBB5]/50 cursor-pointer hover:border-[#FFF300] transition-all group"
                        onClick={handleCopy}
                    >
                        <code className="text-[#FFFBB5] font-mono text-[10px] md:text-sm tracking-wider">{contactPerson}</code>
                        <span className="text-[10px] bg-[#FFF300] text-black px-2 py-1 rounded font-bold uppercase group-hover:bg-white transition-colors">Copy</span>
                    </div>
                </div>
            </div>

            <div className="mt-10 flex flex-col items-center gap-6">
                <label className="flex items-start md:items-center gap-4 cursor-pointer group select-none transition-transform hover:scale-105 active:scale-95">
                    <div className={`flex-shrink-0 w-7 h-7 border-2 border-[#FFF300] rounded flex items-center justify-center transition-all ${agreed ? 'bg-[#FFC045]' : 'bg-transparent'}`}>
                        {agreed && <span className="text-black font-bold text-lg">✓</span>}
                    </div>
                    <input 
                        type="checkbox" 
                        className="hidden" 
                        onChange={(e) => setAgreed(e.target.checked)} 
                    />
                    <span className="text-[#FFFBB5] group-hover:text-white transition-colors font-abhaya text-lg md:text-xl drop-shadow-md leading-tight">
                        Saya mengerti dan menyetujui alur di atas.
                    </span>
                </label>

                <button
                    disabled={!agreed}
                    onClick={() => router.push("/verification")}
                    className={`
                        group relative w-full md:w-auto px-12 py-3 border-2 rounded-xl transition-all duration-300
                        ${!agreed 
                            ? "border-gray-600 text-gray-600 cursor-not-allowed opacity-50" 
                            : "border-white bg-black text-white hover:bg-white hover:text-black hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.1)]"
                        }
                    `}
                >
                    <span className="font-lubrifont text-lg md:text-2xl tracking-[0.2em] uppercase">
                        LANJUT KE VERIFIKASI
                    </span>
                </button>
            </div>
        </div>
      </div>

      {/* POPUP COPY */}
      {showCopyPopup && (
        <div className="fixed bottom-10 z-[100] animate-fade-in-up">
            <div className="bg-[#1a1a1a] border-2 border-[#FFF300] px-6 py-3 rounded-full shadow-xl flex items-center gap-3">
                <span className="font-lubrifont text-[#FFFBB5] tracking-widest text-[10px] md:text-sm uppercase">
                    Nomor Berhasil Disalin!
                </span>
            </div>
        </div>
      )}

        <LogoHeader />
    </main>
  );
}