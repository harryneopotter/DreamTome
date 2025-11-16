import { useState } from "react";
import bookSvg from "../assets/dream-tome-final.svg?url";
import candleSvg from "../assets/candle.svg?url";
import quillSvg from "../assets/quill.svg?url";
import sealSvg from "../assets/seal.svg?url";

export default function SplashScreen({ onEnter }: { onEnter: () => void }) {
  const [kamui, setKamui] = useState(false);

  const start = () => {
    if (kamui) return;
    setKamui(true);
    setTimeout(onEnter, 1100);
  };

  return (
    <div className="fixed inset-0 w-full h-screen overflow-hidden bg-[#2a1b0f]">

      {/* Candle */}
      <img
        src={candleSvg}
        alt=""
        className="absolute left-8 top-12 w-24 h-auto pointer-events-none select-none"
      />

      {/* Quill */}
      <img
        src={quillSvg}
        alt=""
        className="absolute right-10 top-20 w-24 h-auto pointer-events-none select-none"
      />

      {/* Centered Book */}
      <div
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
          transform-gpu transition-transform duration-700
          ${kamui ? "kamui-implosion" : "hover:-rotate-2 hover:scale-[1.03]"}
        `}
      >
        <img
          src={bookSvg}
          alt=""
          className="w-[380px] h-auto drop-shadow-[0_18px_30px_rgba(0,0,0,0.6)]"
        />
      </div>

      {/* Wax Seal */}
      <button
        onClick={start}
        className="absolute bottom-14 left-1/2 -translate-x-1/2
        w-24 h-24 bg-center bg-cover rounded-full
        shadow-[0_8px_18px_rgba(0,0,0,0.6)]
        hover:scale-110 active:scale-95 transition-transform duration-200"
        style={{ backgroundImage: `url(${sealSvg})` }}
        aria-label="Enter Dream Tome"
      />
    </div>
  );
}
