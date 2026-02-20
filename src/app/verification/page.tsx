"use client";
import { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import imageCompression from "browser-image-compression";
import LogoHeader from "@/app/component/LogoHeader";
import Loading from "@/app/component/Loading";


export default function VerificationPage() {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL /*|| 'http://localhost:3000'*/;
  const API_TOKEN = process.env.NEXT_PUBLIC_API_TOKEN;
  const [photo, setPhoto] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const id = Cookies.get("ChampID");
    if (!id) {
      router.push("/");
    }
  }, [router]);
  
  useEffect(() => {

    async function enableCamera() {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({ 
          video: { 
              facingMode: "user",
              width: { ideal: 1280 }, 
              height: { ideal: 720 } 
          } 
        });
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (err) {
        console.error("Kamera tidak diizinkan", err);
        alert("Mohon izinkan akses kamera untuk verifikasi.");
      }
    }
    enableCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  useEffect(() => {
    if (!photo && stream && videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }, [photo, stream]);

  
  const takePhoto = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 100);
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
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
  
  const uploadAndSubmit = async () => {
    if (!photo) return;
    setUploading(true);
    
    try {
      const byteString = atob(photo.split(',')[1]);
      const mimeString = photo.split(',')[0].split(':')[1].split(';')[0];
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      const blob = new Blob([ab], { type: mimeString });
      
      const currentUsername = Cookies.get("ChampID") || "Unknown";
      const fileName = `${currentUsername}_${Date.now()}.jpg`;
      const imageFile = new File([blob], fileName, { type: "image/jpeg" });
      
      const option = {
        maxSizeMB: 0.1,
        maxWidthOrHeight: 800,
        useWebWorker: true,
        fileType: "image/jpeg"
      };
      
      const compressedFile = await imageCompression(imageFile, option);
      
      const formData = new FormData();
      formData.append("file", compressedFile, fileName);
      formData.append("upload_preset", "pemira2026"); 
      
      const cloudRes = await fetch("https://api.cloudinary.com/v1_1/dpnt4jn3k/image/upload", {
        method: "POST",
        body: formData,
      });
      
      if (!cloudRes.ok) throw new Error("Gagal mengunggah gambar ke cloud.");
      
      const cloudData = await cloudRes.json();
      const imageUrl = cloudData.secure_url;
      
      const saveResponse = await fetch(`${API_BASE_URL}/api/save_attendance`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
            username: currentUsername, 
            imageUrl: imageUrl, 
            token: API_TOKEN
        }),
      });

      if (!saveResponse.ok) throw new Error("Gagal menyimpan data ke server.");

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
      
      {/* VIDEO/PREVIEW (Fullscreen) */}
      <div className="absolute inset-0 z-0 flex items-center justify-center bg-gray-900">
        {!photo ? (
            <video 
                ref={videoRef} 
                autoPlay 
                playsInline
                muted
                className="w-full h-full object-cover transform -scale-x-100" 
            />
        ) : (
            <img src={photo} alt="Preview" className="w-full h-full object-cover" />
        )}
      </div>

      {/* OVERLAY VISUAL */}
      
      <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/40 via-transparent to-black/60 pointer-events-none"></div>
      
      {/* Dekorasi Kamera */}
      <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
          <img src="/cam-decor.png" className="w-full h-screen object-fill opacity-80" 
          alt="Frame" />
      </div>

      {/* HEADER */}
      <div className="absolute top-10 md:top-14 w-full text-center z-30 px-4">
          <h2 className="text-white font-lubrifont text-2xl md:text-4xl tracking-[0.2em] drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)] uppercase">
              {photo ? (
                <>GAMBAR <span className="text-gradient-yellow">TEREKAM</span></>
              ) : (
                <>MENGAMBIL <span className="text-gradient-yellow">GAMBAR</span></>
              )}
          </h2>
          <p className="text-white/60 font-lubrifont text-[10px] md:text-sm tracking-widest mt-2 uppercase">
              Posisikan wajah di tengah bingkai
          </p>
      </div>

      {/* INFO (Desktop) */}
      <div className="absolute bottom-[25%] right-10 text-right z-30 hidden lg:block">
           <h1 className="text-[#D22B2B] font-lubrifont text-5xl drop-shadow-lg tracking-widest">
               FOTO
           </h1>
           <p className="text-white text-xs font-bold mt-2 opacity-80 drop-shadow-md uppercase tracking-tighter">
             *Bukti kehadiran<br/>pemilihan digital
           </p>
      </div>

      {/* TOMBOL KONTROL */}
      <div className="absolute bottom-12 md:bottom-16 z-50 flex flex-col items-center w-full px-6">
        {!photo ? (
            <button 
                onClick={takePhoto}
                className="group relative flex items-center justify-center transition-transform active:scale-90"
            >
                {/* Lingkaran Shutter Kamera */}
                <div className="w-20 h-20 md:w-24 md:h-24 bg-white/20 rounded-full border-4 border-white flex items-center justify-center backdrop-blur-sm shadow-2xl">
                    <div className="w-16 h-16 md:w-20 md:h-20 bg-white rounded-full group-hover:scale-90 transition-transform"></div>
                </div>
            </button>
        ) : (
            <div className="flex flex-col md:flex-row gap-4 w-full max-w-sm animate-fade-in">
                <button 
                    onClick={() => setPhoto(null)}
                    className="flex-1 bg-black/60 hover:bg-white hover:text-black text-white border-2 border-white font-lubrifont text-xl py-3 rounded-xl backdrop-blur-md transition-all uppercase tracking-widest"
                >
                    ULANGI
                </button>
                <button 
                    onClick={uploadAndSubmit}
                    disabled={uploading}
                    className="flex-1 bg-[#D22B2B] hover:bg-white hover:text-[#D22B2B] text-white border-2 border-[#D22B2B] font-lubrifont text-xl py-3 rounded-xl shadow-xl transition-all disabled:opacity-50 uppercase tracking-widest"
                >
                    {uploading ? "PROSES..." : "LANJUT"}
                </button>
            </div>
        )}
      </div>

      <canvas ref={canvasRef} className="hidden" />
      
      <Loading condition={isLoading}/>

          <LogoHeader />
 

    </main>
  );
}