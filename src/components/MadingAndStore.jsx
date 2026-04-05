import React, { useState } from 'react';
import { ChevronRight, ChevronLeft, ShoppingCart } from 'lucide-react';

const MadingAndStore = ({ data, setDetailModal }) => {
  const [madingIndex, setMadingIndex] = useState(0);
  const madingList = data.mading || [];
  const visibleMading = madingList.slice(madingIndex, madingIndex + 3);
  
  const handlePrevMading = () => {
    if (madingIndex > 0) setMadingIndex(prev => prev - 1);
  };
  const handleNextMading = () => {
    if (madingIndex + 3 < madingList.length) setMadingIndex(prev => prev + 1);
  };

  return (
    <>
      <section id="mading" className="py-20 md:py-32 bg-white">
        <div className="container mx-auto px-6">
           <div className="flex flex-col md:flex-row justify-between items-center mb-24 gap-8">
             <div className="text-center md:text-left flex flex-col items-center md:items-start w-full">
                <p className="text-emerald-600 font-black tracking-[0.5em] text-xs uppercase mb-3 text-center md:text-left w-full">
                  {data.sectionTitles?.madingSubtitle || "Community Bulletin"}
                </p>
                <h2 className="text-5xl md:text-6xl lg:text-7xl font-black text-neutral-950 uppercase italic tracking-tighter leading-none text-center md:text-left w-full flex">
                  {data.sectionTitles?.madingTitle || "Mading Digital HMS"}
                </h2>
             </div>
             <div className="flex gap-4 items-center">
                 {madingList.length > 3 && (
                   <div className="flex bg-neutral-100 p-2 rounded-full shadow-inner border border-neutral-200">
                     <button onClick={handlePrevMading} disabled={madingIndex === 0} className={`p-4 rounded-full transition ${madingIndex === 0 ? 'text-gray-300 cursor-not-allowed' : 'text-emerald-600 bg-white shadow-md hover:bg-emerald-50'}`}><ChevronLeft size={24}/></button>
                     <button onClick={handleNextMading} disabled={madingIndex + 3 >= madingList.length} className={`p-4 rounded-full transition ${madingIndex + 3 >= madingList.length ? 'text-gray-300 cursor-not-allowed' : 'text-emerald-600 bg-white shadow-md hover:bg-emerald-50'}`}><ChevronRight size={24}/></button>
                   </div>
                 )}
             </div>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 relative">
             {visibleMading.map((item) => (
               <div key={item.id} className="group cursor-pointer bg-neutral-50 rounded-[2rem] md:rounded-[3rem] overflow-hidden border border-neutral-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500" onClick={()=>setDetailModal({open:true, item, type:'mading'})}>
                  <div className="h-64 md:h-72 relative overflow-hidden bg-neutral-200">
                    <img src={item.img} className="w-full h-full object-cover transition duration-1000 group-hover:scale-110" alt={`Berita HMS Untirta: ${item.title}`}/>
                    <div className="absolute top-8 left-8 bg-black text-white px-6 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest z-30 shadow-lg pointer-events-auto">
                      {item.category}
                    </div>
                  </div>
                  <div className="p-12">
                    <h3 className="text-3xl font-black uppercase italic tracking-tighter mb-5 leading-tight group-hover:text-emerald-600 transition duration-300">{item.title}</h3>
                    <p className="text-gray-500 text-base line-clamp-3 leading-relaxed font-medium mb-10 whitespace-pre-wrap">{item.desc}</p>
                    <div className="flex items-center gap-3 text-emerald-600 font-black text-xs uppercase tracking-widest group-hover:gap-6 transition-all duration-500">Selengkapnya <ChevronRight size={18}/></div>
                  </div>
               </div>
             ))}
           </div>
        </div>
      </section>

      <section className="py-20 md:py-32 bg-neutral-950 text-white border-y border-white/10">
        <div className="container mx-auto px-6 text-center">
          <div className="flex flex-col items-center mb-16 md:mb-24">
            <div className="w-20 h-20 md:w-24 md:h-24 bg-emerald-600 rounded-[2rem] flex items-center justify-center mb-8 md:mb-10 shadow-[0_0_50px_rgba(16,185,129,0.3)]"><ShoppingCart size={40} className="md:w-12 md:h-12"/></div>
            <h2 className="text-5xl md:text-6xl lg:text-8xl font-black uppercase italic tracking-tighter mb-6 md:mb-8 leading-none flex w-full">
               {data.sectionTitles?.storeTitle || "HMS Merch Store"}
            </h2>
            <p className="text-neutral-500 max-w-4xl mx-auto text-xl font-medium leading-relaxed italic text-center w-full flex">
               {data.sectionTitles?.storeSubtitle || "Katalog resmi atribut dan perlengkapan Himpunan Mahasiswa Sipil Untirta."}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {(data.merch || []).map((item) => (
              <div key={item.id} className="group text-left">
                <div className="aspect-[4/5] bg-neutral-900 rounded-[3rem] mb-8 relative overflow-hidden border border-white/5 shadow-2xl">
                  <img src={item.img} className="w-full h-full object-cover transition duration-1000 group-hover:scale-110 grayscale group-hover:grayscale-0" alt="Item"/>
                  <div className="absolute bottom-8 left-8 right-8 opacity-0 group-hover:opacity-100 translate-y-6 group-hover:translate-y-0 transition-all duration-700">
                     <button onClick={()=>window.open(`https://wa.me/${item.wa}?text=Halo HMS Store, saya tertarik dengan ${item.name}`, '_blank')} className="w-full bg-emerald-600 text-white py-5 rounded-2xl font-black uppercase text-[11px] tracking-widest shadow-2xl shadow-emerald-950/50 hover:bg-emerald-50 transition">Pesan Sekarang</button>
                  </div>
                </div>
                <div className="px-6 text-center md:text-left">
                  <h3 className="text-2xl font-black uppercase italic tracking-tighter mb-2 block text-white/90 leading-none">{item.name}</h3>
                  <p className="text-emerald-500 font-black text-sm tracking-widest block mb-6 leading-none">{item.price}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default MadingAndStore;
