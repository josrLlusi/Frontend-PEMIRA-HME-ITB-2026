"use client";
import { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import imageCompression from "browser-image-compression";
import LogoHeader from "@/app/component/LogoHeader";
import { MOCK_SETTING } from "@/app/mockConfig"; // Import Saklar Mocking

export default function VerificationPage() {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [photo, setPhoto] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);

  // --- LOGIKA KAMERA ---
  useEffect(() => {
    async function enableCamera() {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 720 } } 
        });
        setStream(mediaStream);
        if (videoRef.current) videoRef.current.srcObject = mediaStream;
      } catch (err) {
        console.error("Kamera tidak diizinkan", err);
        alert("Mohon izinkan akses kamera untuk verifikasi.");
      }
    }
    enableCamera();
    return () => { if (stream) stream.getTracks().forEach(track => track.stop()); };
  }, []);

  useEffect(() => {
    if (!photo && stream && videoRef.current) videoRef.current.srcObject = stream;
  }, [photo, stream]);
  
  const takePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      if(ctx) {
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1); 
        ctx.drawImage(video, 0, 0);
        setPhoto(canvas.toDataURL("image/jpeg", 0.7));
      }
    }
  };
  
  // --- LOGIKA UPLOAD (DENGAN TOGGLE SWITCHER) ---
  const uploadAndSubmit = async () => {
    if (!photo) return;
    setUploading(true);

    // 1. CEK MODE MOCKING
    if (MOCK_SETTING.isEnabled) {
      console.log("--- MODE MOCKING AKTIF: Simulasi Upload ---");
      setTimeout(() => {
        if (MOCK_SETTING.isApiHealthy) {
          stream?.getTracks().forEach(track => track.stop());
          router.push("/selection"); // Langsung lanjut ke menu pemilihan
        } else {
          alert("Gagal: Simulasi Error API (isApiHealthy = false)");
          setUploading(false);
        }
      }, 2000); // Simulasi proses upload selama 2 detik
      return; // Berhenti di sini, jangan jalankan fetch asli di bawah
    }
    
    // 2. KODE ASLI (Hanya jalan jika MOCK_SETTING.isEnabled = false)
    try {
      const byteString = atob(photo.split(',')[1]);
      const mimeString = photo.split(',')[0].split(':')[1].split(';')[0];
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      for (let i = 0; i < byteString.length; i++) ia[i] = byteString.charCodeAt(i);
      const blob = new Blob([ab], { type: mimeString });
      
      const currentUsername = Cookies.get("ChampID") || "Unknown";
      const fileName = `${currentUsername}_${Date.now()}.jpg`;
      const imageFile = new File([blob], fileName, { type: "image/jpeg" });
      
      const compressedFile = await imageCompression(imageFile, { maxSizeMB: 0.1, maxWidthOrHeight: 800 });
      
      const formData = new FormData();
      formData.append("file", compressedFile, fileName);
      formData.append("upload_preset", "pemira2026"); 
      
      const cloudRes = await fetch("https://api.cloudinary.com/v1_1/dpnt4jn3k/image/upload", {
        method: "POST",
        body: formData,
      });
      
      if (!cloudRes.ok) throw new Error("Cloudinary Upload Error");
      
      const cloudData = await cloudRes.json();
      const saveResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/save_attendance`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: currentUsername, imageUrl: cloudData.secure_url, token: process.env.NEXT_PUBLIC_API_TOKEN }),
      });

      if (!saveResponse.ok) throw new Error("Backend Save Error");

      stream?.getTracks().forEach(track => track.stop());
      router.push("/selection");

    } catch (err: any) {
      console.error(err);
      alert(`Gagal: ${err.message}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <main className="relative w-screen h-[100dvh] bg-black overflow-hidden flex flex-col items-center justify-center">
      
      {/* LAYER 1: VIDEO/PREVIEW */}
      <div className="absolute inset-0 z-0 flex items-center justify-center bg-gray-900">
        {!photo ? (
            <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover transform -scale-x-100" />
        ) : (
            <img src={photo} alt="Preview" className="w-full h-full object-cover" />
        )}
      </div>

      <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/40 via-transparent to-black/60 pointer-events-none"></div>
      
      <div className="absolute inset-0 z-20 flex items-center justify-center p-6 md:p-12 pointer-events-none">
          <img src="/cam-decor.png" className="w-full h-full object-contain opacity-80" alt="Frame" />
      </div>

      {/* LAYER 3: HEADER */}
      <div className="absolute top-10 md:top-14 w-full text-center z-30 px-4">
          <h2 className="text-white font-lubrifont text-2xl md:text-4xl tracking-[0.2em] drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)] uppercase">
              {photo ? (<>GAMBAR <span className="text-gradient-yellow">TEREKAM</span></>) : (<>MENGAMBIL <span className="text-gradient-yellow">GAMBAR</span></>)}
          </h2>
          <p className="text-white/60 font-lubrifont text-[10px] md:text-sm tracking-widest mt-2 uppercase">
              Posisikan wajah di tengah bingkai
          </p>
      </div>

      {/* LAYER 5: TOMBOL KONTROL */}
      <div className="absolute bottom-12 md:bottom-16 z-50 flex flex-col items-center w-full px-6">
        {!photo ? (
            <button onClick={takePhoto} className="group relative flex items-center justify-center transition-transform active:scale-90">
                <div className="w-20 h-20 md:w-24 md:h-24 bg-white/20 rounded-full border-4 border-white flex items-center justify-center backdrop-blur-sm shadow-2xl">
                    <div className="w-16 h-16 md:w-20 md:h-20 bg-white rounded-full group-hover:scale-90 transition-transform"></div>
                </div>
            </button>
        ) : (
            <div className="flex flex-col md:flex-row gap-4 w-full max-w-sm animate-fade-in">
                <button onClick={() => setPhoto(null)} className="flex-1 bg-black/60 hover:bg-white hover:text-black text-white border-2 border-white font-lubrifont text-xl py-3 rounded-xl backdrop-blur-md transition-all uppercase tracking-widest">
                    ULANGI
                </button>
                <button onClick={uploadAndSubmit} disabled={uploading} className="flex-1 bg-[#D22B2B] hover:bg-white hover:text-[#D22B2B] text-white border-2 border-[#D22B2B] font-lubrifont text-xl py-3 rounded-xl shadow-xl transition-all disabled:opacity-50 uppercase tracking-widest">
                    {uploading ? "PROSES..." : "LANJUT"}
                </button>
            </div>
        )}
      </div>

      <canvas ref={canvasRef} className="hidden" />
      <LogoHeader />
    </main>
  );
}