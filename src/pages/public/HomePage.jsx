import React, { Suspense, lazy } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { ArrowRight, ChevronRight } from 'lucide-react';
import useScrollReveal from '../../utils/useScrollReveal';

const MedpartSection = lazy(() => import('../../components/MedpartSection'));
const GallerySection = lazy(() => import('../../components/GallerySection'));

export default function HomePage({ data }) {
  const { setDetailModal } = useOutletContext();
  const [profileRef, profileVisible] = useScrollReveal();
  const [madingRef, madingVisible] = useScrollReveal();
  const [galleryRef, galleryVisible] = useScrollReveal();

  return (
    <div className="w-full flex-grow flex flex-col items-center">
      {/* HERO SECTION */}
      <section className="relative h-screen w-full flex items-center justify-center text-white bg-black overflow-hidden">
        <img src={data.hero.bgImage} className="absolute inset-0 w-full h-full object-cover opacity-60 scale-105 animate-[pulse_20s_ease-in-out_infinite]" alt="Background"/>
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black"></div>
        <div className="relative z-10 text-center px-6 max-w-6xl mt-16">
          <div className="inline-block px-10 py-2 border-2 border-emerald-500 text-emerald-400 text-[11px] font-black tracking-[0.6em] mb-14 rounded-full uppercase bg-emerald-900/40 backdrop-blur-lg">
            {data.hero.tagline}
          </div>
          <h1 className="text-5xl md:text-8xl lg:text-[10rem] font-black block mb-12 leading-none tracking-tighter uppercase italic drop-shadow-[0_10px_50px_rgba(0,0,0,0.5)] whitespace-pre-wrap">
            {data.hero.title}
          </h1>
          <p className="text-xl md:text-3xl opacity-80 max-w-4xl mx-auto leading-relaxed font-semibold italic mb-16 whitespace-pre-wrap">
             {data.hero.desc}
          </p>
          <div className="flex justify-center gap-6 flex-wrap">
             <Link to="/tentang-kami" className="bg-emerald-600 hover:bg-emerald-500 text-white px-10 py-5 rounded-[2rem] font-black uppercase tracking-[0.3em] text-xs shadow-[0_0_40px_rgba(16,185,129,0.4)] transition-all flex items-center gap-3">Kenali Kami <ArrowRight size={16}/></Link>
             <Link to="/portal-layanan" className="bg-neutral-900 hover:bg-white hover:text-black border border-neutral-800 text-white px-10 py-5 rounded-[2rem] font-black uppercase tracking-[0.3em] text-xs transition-all flex items-center gap-3">Portal Layanan</Link>
          </div>
        </div>
      </section>

      {/* QUICK PROFILE HIGHLIGHT */}
      <section ref={profileRef} className={`py-24 bg-white w-full border-b border-neutral-100 reveal ${profileVisible ? 'visible' : ''}`}>
        <div className="container mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="relative group mx-auto w-full max-w-[500px]">
             <div className="absolute -inset-6 bg-emerald-500/5 rounded-[4rem] -z-10 group-hover:bg-emerald-500/15 transition duration-[2000ms]"></div>
             <img src={data.profile.img} className="rounded-[4rem] shadow-2xl h-[400px] w-full object-cover" alt="Profile Intro"/>
          </div>
          <div className="text-left">
            <p className="text-emerald-600 font-black text-xs uppercase tracking-[0.5em] mb-4 italic">Introductory</p>
            <h2 className="text-4xl md:text-6xl font-black mb-8 text-neutral-900 border-l-[15px] border-emerald-600 pl-8 uppercase tracking-tighter leading-none italic">{data.profile.title}</h2>
            <p className="text-gray-500 text-2xl leading-relaxed font-semibold mb-10 italic opacity-80 whitespace-pre-wrap line-clamp-4">
               {data.profile.desc}
            </p>
            <Link to="/tentang-kami" className="text-emerald-600 font-black uppercase tracking-widest text-sm flex items-center gap-2 hover:gap-4 transition-all hover:text-emerald-500">Baca Selengkapnya <ChevronRight size={20}/></Link>
          </div>
        </div>
      </section>

      {/* QUICK MADING HIGHLIGHT (3 items) */}
      <section ref={madingRef} className={`py-24 bg-neutral-50 w-full relative overflow-hidden reveal ${madingVisible ? 'visible' : ''}`}>
        <div className="container mx-auto px-6 md:px-12">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
               <div className="max-w-2xl">
                 <p className="text-emerald-600 font-black tracking-[0.6em] text-xs uppercase mb-4 italic">Kabar Terbaru</p>
                 <h2 className="text-5xl md:text-7xl font-black text-neutral-900 uppercase italic tracking-tighter leading-none">Mading &amp; Info</h2>
               </div>
               <Link to="/publikasi" className="bg-white border-2 border-neutral-100 px-8 py-4 rounded-full text-xs font-black uppercase tracking-widest text-neutral-900 hover:border-emerald-500 hover:text-emerald-600 transition shadow-sm whitespace-nowrap">Lihat Papan Mading Seutuhnya</Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
               {(data.mading || []).slice(0, 3).map((item, id) => (
                 <div key={id} onClick={()=>setDetailModal({open:true, item, type:'mading'})} className="bg-white rounded-3xl overflow-hidden shadow-lg border border-neutral-100 cursor-pointer group">
                    <div className="h-64 bg-neutral-200 overflow-hidden relative">
                       <img src={item.img} className="w-full h-full object-cover group-hover:scale-110 transition duration-700" alt={item.title}/>
                       <div className="absolute top-4 right-4 bg-black text-white px-4 py-2 font-black uppercase text-[10px] tracking-widest rounded-full">{item.category}</div>
                    </div>
                    <div className="p-8">
                       <h3 className="text-xl font-black uppercase tracking-tighter italic mb-3 line-clamp-2 text-neutral-900">{item.title}</h3>
                       <p className="text-gray-500 text-sm font-medium line-clamp-2">{item.desc?.replace(/<[^>]+>/g, '')}</p>
                    </div>
                 </div>
               ))}
               {(!data.mading || data.mading.length === 0) && (
                 <div className="col-span-3 text-center py-20 bg-white rounded-3xl border-2 border-dashed border-neutral-200">
                    <p className="text-neutral-400 font-black uppercase tracking-widest">Belum ada mading terbaru</p>
                 </div>
               )}
            </div>
        </div>
      </section>

      {/* GALLERY */}
      <Suspense fallback={<div className="h-32"/>}>
         <GallerySection data={data} />
      </Suspense>

      {/* MEDPART */}
      <Suspense fallback={<div className="h-32"/>}>
         <MedpartSection data={data} />
      </Suspense>
    </div>
  );
}
