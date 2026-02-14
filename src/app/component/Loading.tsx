interface LoadingProps {
  condition: boolean;
}

function Loading({ condition }: LoadingProps) {

  let mainStyle = "backdrop-blur-0 hidden pointer-events-none";
  let popup = "mt-[-100%]";

  if (condition) {
    mainStyle = "backdrop-blur-sm z-[100] pointer-events-auto";
    popup = "";
  }

  return (
    <div 
      className={`Loading w-screen h-screen fixed top-0 left-0 ${mainStyle} flex transition-all ease-in-out duration-700 overflow-hidden bg-black/20`}
    >
      <div className={`popupcontainer ${popup} p-2 h-[60px] w-[230px] bg-white rounded-3xl m-auto md:scale-125 overflow-hidden flex shadow-[0_0_50px_rgba(0,0,0,0.5)]`}>
        
        <div className="LoadingAniContainer h-full aspect-square bg-gradient-to-br from-[#FFC045] to-[#B3403D] p-1 rounded-full animate-spin">
          <div className="inner w-full h-full bg-white rounded-full overflow-hidden">
          </div>
        </div>

        <div className="textcontainer h-full w-[calc(100%-45px)] flex">
          <h2 className="text text-[#B3403D] m-auto font-bold text-[18pt] w-[100px] tracking-widest">
            LOADING
          </h2>
        </div>
        
      </div>
    </div>
  );
}

export default Loading;