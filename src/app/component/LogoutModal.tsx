"use client";

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function LogoutModal({ isOpen, onClose, onConfirm }: LogoutModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 animate-fade-in">

      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={onClose} 
      ></div>

      
      <div className="relative bg-[#111111] border-2 border-[#FFC045] p-8 rounded-3xl max-w-sm w-full text-center shadow-[0_0_50px_rgba(255,192,69,0.2)] transform transition-all scale-100">
        
        
        <div className="mx-auto w-16 h-16 mb-6 rounded-full bg-[#FFC045]/20 flex items-center justify-center border border-[#FFC045]">
           <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="#FFC045" className="w-8 h-8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
           </svg>
        </div>

        <h3 className="font-lubrifont text-white text-2xl tracking-widest uppercase mb-2">
          LOGOUT
        </h3>
        
        <p className="text-gray-400 font-sans text-sm mb-8 leading-relaxed">
          Apakah anda yakin ingin mengakhiri sesi pemilihan ini?
        </p>

        
        <div className="flex gap-4">
          <button 
            onClick={onClose} 
            className="flex-1 py-3 px-4 border border-white/20 text-white font-lubrifont rounded-xl hover:bg-white/10 transition-colors uppercase tracking-wider text-sm"
          >
            Batal
          </button>
          
          <button 
            onClick={onConfirm} 
            className="flex-1 py-3 px-4 bg-[#D22B2B] text-white font-lubrifont rounded-xl hover:bg-[#b01e1e] shadow-[0_0_20px_rgba(210,43,43,0.4)] transition-all uppercase tracking-wider text-sm font-bold"
          >
            Keluar
          </button>
        </div>
      </div>
    </div>
  );
}