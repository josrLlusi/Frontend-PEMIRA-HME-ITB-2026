interface ErrorProps {
  condition: boolean;
  errormessage: string;
}

function ErrorDialogBox({ condition, errormessage }: ErrorProps) {
  let mainStyle = "mt-[-100%]"
  let popup = ""

  if (condition){
    mainStyle = ""
    popup =""
  } else {
    mainStyle = "mt-[-100%]"
    popup = ""
  }
  return ( 
    <div className={`ErrorDialogBox w-full h-[300px] fixed top-0 left-0 z-[999] ${mainStyle} flex transition-all ease-in-out duration-700 overflow-hidden pointer-events-none`}>
      <div className={`popupcontainer ${popup} p-2 h-[60px] w-[230px] bg-white rounded-3xl m-auto md:scale-125 overflow-hidden flex shadow-2xl`}>
        <div className="LoadingAniContainer h-full aspect-square bg-red-700 p-1 rounded-full">
          <div className="inner w-full h-full bg-white rounded-full overflow-hidden flex">
            <div className="bar w-[80%] h-[5px] bg-red-700 m-auto rounded-full rotate-45"></div>
          </div>
          <div className="inner w-full h-full mt-[-100%] rounded-full overflow-hidden flex">
            <div className="bar w-[80%] h-[5px] bg-red-700 m-auto rounded-full rotate-[-45deg]"></div>
          </div>
        </div>
        <div className="textcontainer h-full w-[calc(100%-45px)] flex">
          <h2 className="text text-[#B3403D] m-auto font-bold text-[10pt] text-center w-[100px]">{errormessage}</h2>
        </div>
      </div>
      
    </div> 
   );
}

export default ErrorDialogBox;