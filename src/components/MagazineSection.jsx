import React from 'react';
import { BookOpen, ExternalLink, Library } from 'lucide-react';

const MagazineSection = ({ data }) => {
  return (
    <section id="magazine" className="py-20 md:py-32 bg-neutral-100 border-t border-neutral-200">
      <div className="container mx-auto px-6">
        <div className="flex flex-col items-center mb-16 text-center">
            <span className="inline-block bg-emerald-600 text-white font-black px-5 py-2 text-[10px] rounded-full mb-6 tracking-[0.3em] uppercase items-center flex gap-2 shadow-lg shadow-emerald-600/20">
              <Library size={14}/>
              {data.sectionTitles?.magazineSubtitle || "Official Publication"}
            </span>
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-black mb-6 md:mb-8 text-neutral-900 uppercase italic tracking-tighter w-full flex flex-col items-center">
              {data.sectionTitles?.magazineTitle || "E-Magazine HMS"}
            </h2>
            <p className="text-gray-500 text-lg md:text-xl leading-relaxed max-w-2xl w-full flex flex-col items-center italic font-medium whitespace-pre-wrap">
              {data.sectionTitles?.magazineDesc || "Jelajahi buletin, prosiding, dan laporan majalah digital himpunan terbaru dalam format rak buku interaktif."}
            </p>
        </div>

        <div className="max-w-[75rem] mx-auto bg-neutral-950 p-4 md:p-10 rounded-[2.5rem] md:rounded-[4rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] relative group border border-neutral-900">
            {/* Tombol Akses Cepat Fullscreen / Standalone */}
            <div className="absolute top-0 right-10 -translate-y-1/2 z-20">
                <a href="https://fliphtml5.com/bookcase/fujojq/" target="_blank" rel="noreferrer" className="bg-yellow-400 hover:bg-yellow-300 text-black px-8 py-4 rounded-full font-black text-xs uppercase tracking-[0.2em] flex items-center gap-3 hover:scale-105 transition-all shadow-xl active:scale-95 duration-300">
                    Baca Full View <ExternalLink size={18}/>
                </a>
            </div>
            
            {/* Ornamen Rak Buku (Estetika UI) */}
            <div className="absolute top-10 left-10 pointer-events-none opacity-10">
               <BookOpen size={120} className="text-emerald-500" />
            </div>

            {/* Container Iframe Flipbook yang Responsif dan Lazy */}
            <div className="w-full h-[450px] md:h-[396px] rounded-[1.5rem] md:rounded-[3rem] overflow-hidden bg-black border-2 border-neutral-800 relative shadow-inner z-10 transition duration-1000 group-hover:border-emerald-500/50 flex justify-center">
                {/* Fallback & Loading State Skeleton Indicator */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-neutral-600 font-black uppercase tracking-widest text-xs z-0 pointer-events-none gap-4">
                   <div className="w-16 h-16 border-4 border-neutral-800 border-t-emerald-500 rounded-full animate-spin"></div>
                   Loading Bookcase...
                </div>

                <iframe 
                  className="relative z-10"
                  style={{width: '100%', maxWidth: '1584px', height: '100%', maxHeight: '396px'}} 
                  src="https://fliphtml5.com/bookcase/fujojq/"  
                  seamless="seamless" 
                  scrolling="no" 
                  frameBorder="0" 
                  allowTransparency="true" 
                  allowFullScreen={true}
                  loading="lazy"
                  title="E-Magazine Bookshelf HMS"
                ></iframe>
            </div>
            
            <div className="mt-8 text-center">
              <p className="text-neutral-600 text-xs font-black uppercase tracking-[0.4em]">Powered by FlipHTML5 Interactive Engine.</p>
            </div>
        </div>
      </div>
    </section>
  );
};

export default MagazineSection;
