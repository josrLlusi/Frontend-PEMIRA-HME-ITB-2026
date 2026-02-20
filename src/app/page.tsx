"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Loading from "@/app/component/Loading";
import Cookies from "js-cookie";
import ErrorDialogBox from "@/app/component/ErrorDialogBox";
import NavBar from "@/app/component/NavBar";

// KONFIGURASI API
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL /*|| 'http://localhost:3000'*/;
const TOKEN = process.env.NEXT_PUBLIC_API_TOKEN;

export default function Auth() {
  // --- STATE SYSTEM ---
  const [ErrorMessage, setErrorMessage] = useState("");
  const [ErrorStatus, setErrorStatus] = useState(false);
  const [LoadingCondition, setLoadingCondition] = useState(false);
  
  // --- STATE INPUT DATA ---
  const [name, setName] = useState("");         
  const [username, setUsername] = useState(""); 
  const [password, setPassword] = useState(""); 
  
  // --- STATE UI ---
  const [showPassword, setShowPassword] = useState(false);
  const route = useRouter();

  // HANDLER ERROR
  const ErrorHandler = (message: string) => {
    setErrorMessage(message);
    setErrorStatus(true);
    setTimeout(() => {
      setErrorStatus(false);
    }, 4000);
  };

  useEffect(() => {
    if (Cookies.get('AuthError')) {
      ErrorHandler("AUTENTIKASI GAGAL!!");
      Cookies.remove('AuthError');
    }
  }, []);

  // --- LOGIKA INPUT ---
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    const formattedName = input.replace(/\b\w/g, (char) => char.toUpperCase());
    setName(formattedName);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value.toUpperCase());
  };

  // --- LOGIKA SUBMIT UTAMA ---
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    if (!name.trim()) {
       ErrorHandler("NAMA HARUS DIISI!!");
       return;
    }

    setLoadingCondition(true);

    const requestBody = {
      username: username,
      pass: password, 
      token: TOKEN,
    };

    try {
      // 1. REQUEST LOGIN
      const response = await fetch(`${API_BASE_URL}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });
      const data = await response.json();

      if (data.ID) {
        // Login Sukses
        Cookies.set("ChampID", data.ID, { expires: 1, secure: true, sameSite: 'strict' });
        Cookies.set("ChampName", name, { expires: 1, secure: true, sameSite: 'strict' }); 

        /* {CEK VALIDITAS AKUN}
        const isThereRes = await fetch(`${API_BASE_URL}/api/is_there`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username: data.ID, token: TOKEN }),
        });
        const isThereData = await isThereRes.json();*/

        Cookies.set("ChampAccess", "granted", { expires: 1 });
        

          // 3. CEK STATUS VOTE
        const checkVoteRes = await fetch(`${API_BASE_URL}/api/is_vote`, {
           method: "POST",
           headers: { "Content-Type": "application/json" },
           body: JSON.stringify({ username: data.ID, token: TOKEN }),
          });
        const voteStatus = await checkVoteRes.json();

        if (voteStatus.data === "true") {
          route.push("/thankyou");
        } else {
          route.push("/disclaimer");
        }

       } else {
          setLoadingCondition(false);
          //ErrorHandler("DATA AKUN TIDAK DITEMUKAN!!");
          if (data.message === "Username dan password harus diisi.") {
            ErrorHandler("FORM HARUS DILENGKAPI!!");
        } else {
          ErrorHandler("AKUN TIDAK DITEMUKAN!!");
        //setLoadingCondition(false);
        }
        
      }
    } catch (error) {
      console.error("Terjadi kesalahan:", error);
      setLoadingCondition(false);
      ErrorHandler("SERVER CONNECTION ERROR");
    }
  };

  // --- RENDER UI ---
return (
    <main className="relative w-full min-h-screen bg-black flex flex-col md:flex-row overflow-x-hidden">

      {/* BACKGROUND GRADIENT & DECORATION */}

      <div className="fixed inset-0 z-0 bg-gradient-to-b from-[#1A1A1A] to-[#010101]"></div>
      
      <img 
        src="/castle.png" 
        alt="Castle Decoration" 
        className="fixed inset-0 w-full h-full object-fill object-bottom z-10 opacity-60 md:opacity-100 pointer-events-none" 
      />

      {/* KONTEN UTAMA */}
      <div className="relative z-20 w-full md:w-[60%] lg:w-[50%] ml-auto min-h-screen flex flex-col justify-center items-end py-20 px-8 md:pr-16 lg:pr-24">
        
        {/* JUDUL RESPONSIVE */}
        <div className="text-right mb-12 select-none flex flex-col items-end w-full">
          <div className="flex flex-wrap justify-end items-baseline gap-2 md:gap-3 leading-none">
            <h1 className="font-lubrifont text-[2.8rem] sm:text-[3.5rem] md:text-[4.5rem] lg:text-[5.5rem] text-gradient-yellow tracking-wider">
              PEMIRA
            </h1>
            <h2 className="font-lubrifont text-[2rem] sm:text-[2.5rem] md:text-[3.5rem] lg:text-[4rem] text-gradient-silver">
              HME
            </h2>
          </div>
          
          <div className="flex items-center gap-3 mt-[-5px] leading-none">
            <span className="font-lubrifont text-gray-400 text-lg md:text-2xl tracking-widest mt-2">
              ITB
            </span>
            <span className="font-lubrifont text-[2.8rem] sm:text-[3.5rem] md:text-[4.5rem] lg:text-[5.5rem] text-gradient-yellow">
              2026
            </span>
          </div>
        </div>

        {/* FORM INPUT RESPONSIVE */}
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-5 items-end">
          
          <input
            type="text"
            placeholder="NAMA LENGKAP"
            className="w-full max-w-[480px] bg-[#D9D9D9] text-[#292216] font-lubrifont font-extrabold text-lg md:text-xl py-4 px-6 rounded-lg outline-none placeholder-[#777] shadow-inner focus:ring-2 focus:ring-[#FFC045] transition-all"
            value={name}
            onChange={handleNameChange}
            required
          />

          <input
            type="text"
            placeholder="NIM"
            className="w-full max-w-[480px] bg-[#D9D9D9] text-[#292216] font-lubrifont font-extrabold text-lg md:text-xl py-4 px-6 rounded-lg outline-none placeholder-[#777] shadow-inner focus:ring-2 focus:ring-[#FFC045] transition-all"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <div className="relative w-full max-w-[480px]">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="PASSWORD"
              className="w-full bg-[#D9D9D9] text-[#292216] font-lubrifont font-extrabold text-lg md:text-xl py-4 px-6 rounded-lg outline-none placeholder-[#777] shadow-inner pr-14 focus:ring-2 focus:ring-[#FFC045] transition-all"
              value={password}
              onChange={handlePasswordChange}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-black transition-colors"
            >
              {showPassword ? (
                 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                  <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
                  <path fillRule="evenodd" d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 010-1.113zM17.25 12a5.25 5.25 0 11-10.5 0 5.25 5.25 0 0110.5 0z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                </svg>
              )}
            </button>
          </div>

          <div className="w-full max-w-[480px] flex justify-center mt-6">
            <button
              type="submit"
              disabled={LoadingCondition}
              className="group px-12 py-3 bg-gradient-to-b from-[#FFFFFF] via-[#CCCCCC] to-[#999999] border-2 border-white/50 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-[0_0_20px_rgba(255,255,255,0.2)] active:scale-95"
            >
              <span className="font-bold font-lubrifont text-2xl tracking-[0.2em] text-black">
                LOGIN
              </span>
            </button>
          </div>

        </form>
      </div>

      {/* OVERLAYS */}
      <Loading condition={LoadingCondition} />
      <ErrorDialogBox condition={ErrorStatus} errormessage={ErrorMessage} />
      <NavBar data={null} />
    </main>
  );
}