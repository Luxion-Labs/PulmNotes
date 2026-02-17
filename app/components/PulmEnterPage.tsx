import React from 'react';

type PulmEnterPageProps = {
  onEnter: () => void;
};

const PulmEnterPage: React.FC<PulmEnterPageProps> = ({ onEnter }) => {
  return (
    <div
      className="h-screen w-full flex flex-col items-center relative bg-[#f1f2ef] overflow-hidden font-sans select-none"
      style={{
        backgroundImage:
          'radial-gradient(1200px 600px at 50% 8%, rgba(246, 249, 252, 0.92), rgba(241, 242, 239, 0.98) 58%, rgba(234, 236, 232, 1) 100%)',
      }}
    >
      <div className="pointer-events-none absolute inset-y-0 left-0 w-[32%] opacity-40 bg-[radial-gradient(400px_700px_at_0%_50%,rgba(206,213,220,0.22),rgba(241,242,239,0))]" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-[32%] opacity-40 bg-[radial-gradient(400px_700px_at_100%_45%,rgba(223,235,246,0.24),rgba(241,242,239,0))]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')] bg-repeat" />
      <style>
        {`
          @keyframes floatNote {
            0% { transform: translateY(0); }
            50% { transform: translateY(-3px); }
            100% { transform: translateY(0); }
          }
        `}
      </style>

      {/* Corner scrapbook elements */}
      <div
        className="pointer-events-none absolute -left-14 top-36 w-36 h-28 bg-[#e6e8e4] rotate-[-7deg] shadow-[0_10px_24px_rgba(47,52,59,0.12)] opacity-70 rounded-[14px]"
        style={{
          WebkitMaskImage: 'linear-gradient(90deg, transparent 0%, black 18%, black 100%)',
          maskImage: 'linear-gradient(90deg, transparent 0%, black 18%, black 100%)',
        }}
      />
      <div
        className="pointer-events-none absolute left-6 top-32 w-12 h-3 bg-[#cfd4cf] rotate-[-12deg] shadow-[0_4px_12px_rgba(47,52,59,0.12)] rounded-full opacity-70"
        style={{
          WebkitMaskImage: 'linear-gradient(90deg, transparent 0%, black 35%, black 100%)',
          maskImage: 'linear-gradient(90deg, transparent 0%, black 35%, black 100%)',
        }}
      />
      <div
        className="pointer-events-none absolute -right-14 top-40 w-32 h-24 bg-[#d5d8d4] rotate-[8deg] shadow-[0_10px_24px_rgba(47,52,59,0.12)] opacity-70 rounded-[14px]"
        style={{
          WebkitMaskImage: 'linear-gradient(270deg, transparent 0%, black 18%, black 100%)',
          maskImage: 'linear-gradient(270deg, transparent 0%, black 18%, black 100%)',
        }}
      />
      <div
        className="pointer-events-none absolute right-6 top-32 w-10 h-10 bg-[#c7c4b0]/60 rotate-[14deg] shadow-[0_6px_16px_rgba(47,52,59,0.12)] rounded-[10px] opacity-70"
        style={{
          WebkitMaskImage: 'linear-gradient(270deg, transparent 0%, black 35%, black 100%)',
          maskImage: 'linear-gradient(270deg, transparent 0%, black 35%, black 100%)',
        }}
      />

      {/* Top Header - Fixed relative to top */}
      <div className="flex-none pt-4 z-30 w-full">
        <header className="w-full flex flex-col items-center justify-center pt-4 md:pt-6 animate-fade-in-down" />
      </div>

      {/* Main Content Area - Centered in remaining space */}
      <main className="flex-grow flex flex-col justify-center items-center w-full max-w-7xl px-4 z-20 pb-20 sm:pb-32 lg:pb-40">
        <div className="flex flex-col items-center text-center max-w-5xl mx-auto z-20 transform translate-y-[-4%] relative">
          {/* Curvy line element */}
          <svg
            className="absolute -top-6 md:-top-10 left-1/2 -translate-x-1/2 w-[260px] md:w-[340px] opacity-30"
            viewBox="0 0 340 60"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M10 40 C 70 10, 140 55, 210 25 C 250 10, 290 15, 330 30"
              stroke="#6b5f54"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeDasharray="420"
              strokeDashoffset="420"
            >
              <animate
                attributeName="stroke-dashoffset"
                from="420"
                to="0"
                dur="2.8s"
                begin="0.4s"
                fill="freeze"
              />
            </path>
          </svg>
          <svg
            className="absolute -bottom-10 md:-bottom-12 right-12 md:right-20 w-[180px] opacity-25"
            viewBox="0 0 200 60"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M10 30 C 55 5, 95 55, 140 20 C 165 8, 185 12, 190 24"
              stroke="#6b5f54"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeDasharray="260"
              strokeDashoffset="260"
            >
              <animate
                attributeName="stroke-dashoffset"
                from="260"
                to="0"
                dur="3.2s"
                begin="0.7s"
                fill="freeze"
              />
            </path>
          </svg>

          {/* Pinned micro notes */}
          <div
            className="pointer-events-none absolute -left-20 md:-left-36 top-8 md:top-6 rotate-[-6deg] bg-[#d2d7d2] text-[#55504a] text-[10px] md:text-xs px-3 py-2 rounded-[6px] shadow-[0_8px_18px_rgba(47,52,59,0.12)]"
            style={{ animation: 'floatNote 7s ease-in-out 0s infinite' }}
          >
            <span className="absolute -top-1 left-3 w-2 h-2 bg-[#6e7076] rounded-full shadow-[0_2px_6px_rgba(47,52,59,0.2)]" />
            <span className="inline-block rotate-[-2deg]" style={{ fontFamily: 'cursive' }}>
              slow notes
            </span>
          </div>
          <div
            className="pointer-events-none absolute -right-24 md:-right-40 top-16 md:top-10 rotate-[5deg] bg-[#d1d9e3] text-[#55504a] text-[10px] md:text-xs px-3 py-2 rounded-[6px] shadow-[0_8px_18px_rgba(47,52,59,0.12)]"
            style={{ animation: 'floatNote 7.6s ease-in-out 0.3s infinite' }}
          >
            <span className="absolute -top-1 left-4 w-2 h-2 bg-[#6e7076] rounded-full shadow-[0_2px_6px_rgba(47,52,59,0.2)]" />
            <span className="inline-block rotate-[1deg]" style={{ fontFamily: 'cursive' }}>
              soft focus
            </span>
          </div>
          <div
            className="pointer-events-none absolute -left-8 md:-left-16 top-44 md:top-40 rotate-[-3deg] bg-[#cfd6da] text-[#55504a] text-[10px] md:text-xs px-2.5 py-1.5 rounded-[6px] shadow-[0_8px_18px_rgba(47,52,59,0.12)]"
            style={{ animation: 'floatNote 7.2s ease-in-out 0.1s infinite' }}
          >
            <span className="absolute -top-1 left-3 w-2 h-2 bg-[#6e7076] rounded-full shadow-[0_2px_6px_rgba(47,52,59,0.2)]" />
            <span className="inline-block rotate-[-1deg]" style={{ fontFamily: 'cursive' }}>
              quiet here
            </span>
          </div>
          <div
            className="pointer-events-none absolute -right-10 md:-right-20 top-44 md:top-40 rotate-[4deg] bg-[#d7dad6] text-[#55504a] text-[10px] md:text-xs px-2.5 py-1.5 rounded-[6px] shadow-[0_8px_18px_rgba(47,52,59,0.12)]"
            style={{ animation: 'floatNote 7.8s ease-in-out 0.5s infinite' }}
          >
            <span className="absolute -top-1 left-3 w-2 h-2 bg-[#6e7076] rounded-full shadow-[0_2px_6px_rgba(47,52,59,0.2)]" />
            <span className="inline-block rotate-[1deg]" style={{ fontFamily: 'cursive' }}>
              slow hours
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-[3.5rem] md:text-[4rem] lg:text-[4.6rem] xl:text-[5.1rem] font-normal font-serif text-[#3b342f] leading-[1.18] tracking-[0.01em] mb-2 md:mb-3 flex flex-col items-center">
            <span>Your Ideas.</span>
            <span className="relative inline-block">
              Locally Yours.
              <svg
                className="absolute left-1/2 -translate-x-1/2 -bottom-3 w-[140px] md:w-[170px] opacity-35"
                viewBox="0 0 200 30"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M10 18 C 55 8, 90 26, 140 14 C 160 10, 180 12, 190 16"
                  stroke="#6b5f54"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeDasharray="260"
                  strokeDashoffset="260"
                >
                  <animate
                    attributeName="stroke-dashoffset"
                    from="260"
                    to="0"
                    dur="2.2s"
                    begin="0.5s"
                    fill="freeze"
                  />
                </path>
              </svg>
            </span>
          </h1>

          <div className="text-[11px] md:text-xs text-[#6b5f54] tracking-[0.08em] mb-2 md:mb-3" style={{ fontFamily: 'cursive' }}>
            a quiet place
          </div>

          <div className="text-[10px] md:text-xs uppercase tracking-[0.35em] text-[#6b5f54] font-mono mb-6 md:mb-8">
            Pulm
          </div>

          {/* Subtitle */}
          <p className="text-xs sm:text-sm md:text-lg text-gray-600 font-normal tracking-normal mb-10 md:mb-14 max-w-xs sm:max-w-md md:max-w-lg mx-auto leading-relaxed">
            A quiet thinking system that lives on your device.
          </p>

          {/* CTA Button */}
          <button
            className="bg-[#f3e9dc]/60 text-[#3b342f] border border-[#c4b3a3]/70 hover:border-[#c4b3a3]/90 hover:bg-[#efe2d2]/70 text-xs md:text-sm lg:text-base font-medium py-2.5 px-6 md:py-3 md:px-8 rounded-full transition-all duration-300 transform hover:-translate-y-0.5 active:scale-95 cursor-pointer"
            onClick={onEnter}
          >
            Enter Pulm
          </button>
        </div>
      </main>

      {/* Footer / Book Visuals - Anchored to bottom */}
      <div className="absolute bottom-0 left-0 w-full h-[45vh] min-h-[300px] max-h-[500px] flex justify-center items-end z-10 pointer-events-none">
        <div className="relative w-full max-w-[1500px] h-full flex justify-center items-end perspective-1000 scale-[0.6] sm:scale-[0.75] md:scale-95 lg:scale-110 origin-bottom transition-transform duration-500 opacity-85 saturate-75 contrast-95">
          {/* 
            BOOK LAYERING STRATEGY:
            Back to Front rendering order.
          */}

          {/* 1. Green Book (Far Right, Back) */}
          <div className="absolute bottom-[-140px] right-[-2%] md:right-[8%] w-[200px] h-[280px] md:w-[240px] md:h-[340px] bg-[#7a9f9c] rounded-sm shadow-[0_22px_55px_rgba(47,52,59,0.2)] transform rotate-[16deg] origin-bottom-left z-10 flex flex-col p-4 overflow-hidden">
            <div className="mt-4 ml-2 border border-white/30 w-16 h-8 rounded-full" />
            <div className="absolute top-1/3 left-4 right-4 text-white font-bold text-2xl leading-tight opacity-90">
              QUIET<br />
              FIELD<br />
              NOTES<br />
              AT HOME
            </div>
          </div>

          {/* 2. Black Book (Far Left) */}
          <div className="absolute bottom-[-160px] left-[-6%] md:left-[4%] w-[240px] h-[320px] md:w-[280px] md:h-[380px] bg-[#6a5d77] rounded-sm shadow-[0_26px_65px_rgba(47,52,59,0.22)] transform -rotate-[26deg] z-20 flex flex-col items-start justify-center p-6 overflow-hidden">
            <h2 className="text-[#f7f2ea] font-bold text-[120px] leading-none tracking-tighter ml-[-10px]">ARC</h2>
            <div className="absolute bottom-6 left-6 w-12 h-12 bg-[#f7f2ea] rounded-full"></div>
          </div>

          {/* 3. Grey Book (Left Center, behind Yellow) */}
          <div className="absolute bottom-[-180px] left-[10%] md:left-[18%] w-[220px] h-[300px] md:w-[260px] md:h-[350px] bg-[#d6d8d2] rounded-sm shadow-[0_22px_58px_rgba(47,52,59,0.2)] transform -rotate-[14deg] z-30 flex flex-col items-center justify-center overflow-hidden border-l-4 border-[#c2c5bf]">
            <div className="w-[180px] h-[180px] rounded-full border-[16px] border-[#1a1a1a] opacity-80 mb-4"></div>
          </div>

          {/* 4. Yellow Book (Center, Hero) */}
          <div className="absolute bottom-[-120px] left-[50%] translate-x-[-60%] w-[230px] h-[310px] md:w-[280px] md:h-[390px] bg-[#d4b56b] rounded-[2px] shadow-[0_28px_72px_rgba(47,52,59,0.24)] transform -rotate-[6deg] z-50 flex flex-col p-6 overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
            <div className="relative z-10 mt-8">
              <div className="text-black font-bold text-3xl md:text-4xl leading-[0.9] tracking-tight">
                Quiet<br />Drafts<br />Only
              </div>
              <div className="mt-4 text-xs font-semibold uppercase tracking-widest text-black/60">
                margin<br />
                thinking<br />
                in small<br />
                hours
              </div>
              <div className="absolute bottom-8 right-0 text-black font-bold text-lg rotate-[-90deg] origin-bottom-right">
                local study
              </div>
            </div>
          </div>

          {/* 5. White "how" Book (Right Center) */}
          <div className="absolute bottom-[-150px] left-[50%] translate-x-[15%] w-[240px] h-[320px] md:w-[290px] md:h-[400px] bg-[#e7e9e4] rounded-sm shadow-[0_24px_62px_rgba(47,52,59,0.22)] transform rotate-[12deg] z-40 flex flex-col p-6 overflow-hidden">
            <div className="absolute top-1/2 left-[-40px] text-black font-bold text-[140px] md:text-[180px] leading-none tracking-tighter opacity-90">
              slow
            </div>
            <div className="absolute bottom-12 left-6 text-sm font-bold max-w-[120px] leading-tight">
              research rituals
            </div>
            {/* Partial D letter from "Do" perhaps */}
            <div className="absolute top-[-20px] right-[-20px] text-black font-bold text-[100px] leading-none tracking-tighter opacity-90 overflow-hidden">
              D
            </div>
          </div>

          {/* 6. Pink Book (Right) */}
          <div className="absolute bottom-[-150px] right-[-4%] md:right-[12%] w-[220px] h-[300px] md:w-[260px] md:h-[350px] bg-[#c9776a] rounded-sm shadow-[0_22px_58px_rgba(47,52,59,0.2)] transform rotate-[20deg] z-30 flex flex-col p-5 overflow-hidden">
            <div className="w-full border-t border-white/40 pt-2 mb-2">
              <span className="text-[#f7f2ea] text-[10px] uppercase tracking-widest">personal archives</span>
            </div>
            <div className="flex-grow flex items-end">
              <div className="w-full h-[80%] rounded-tl-[100px] border-l-2 border-t-2 border-white/30"></div>
            </div>
            <div className="absolute bottom-[-40px] right-[-40px] w-40 h-40 rounded-full border-[20px] border-white/20"></div>
          </div>
        </div>
      </div>

      {/* Looping line near stack */}
      <svg
        className="pointer-events-none absolute bottom-28 right-[18%] w-[220px] opacity-20"
        viewBox="0 0 260 80"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M10 50 C 60 10, 120 75, 170 35 C 200 12, 230 20, 250 32"
          stroke="#6b5f54"
          strokeWidth="1.1"
          strokeLinecap="round"
          strokeDasharray="320"
          strokeDashoffset="320"
        >
          <animate attributeName="stroke-dashoffset" from="320" to="0" dur="3s" begin="0.6s" fill="freeze" />
        </path>
      </svg>
    </div>
  );
};

export default PulmEnterPage;
