import React, { useState } from 'react';
import { PlusCircle, Camera, Trash2, ChevronRight, ChevronLeft, ShoppingCart } from 'lucide-react';
import EditableText from './ui/EditableText';

const MadingAndStore = ({ data, updateList, updateDataText, isEditMode, handleUpload, setDetailModal }) => {
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
      <section id="mading" className="py-32 bg-white">
        <div className="container mx-auto px-6">
           <div className="flex flex-col md:flex-row justify-between items-center mb-24 gap-8">
             <div className="text-center md:text-left flex flex-col items-center md:items-start w-full">
                <p className="text-emerald-600 font-black tracking-[0.5em] text-xs uppercase mb-3 text-center md:text-left w-full">
                  <EditableText value={data.sectionTitles?.madingSubtitle || "Community Bulletin"} onChange={v=>updateDataText('sectionTitles', 'madingSubtitle', v)} isEditMode={isEditMode} className="w-full text-center md:text-left" />
                </p>
                <h2 className="text-6xl md:text-7xl font-black text-neutral-950 uppercase italic tracking-tighter leading-none text-center md:text-left w-full flex">
                  <EditableText value={data.sectionTitles?.madingTitle || "Mading Digital HMS"} onChange={v=>updateDataText('sectionTitles', 'madingTitle', v)} isEditMode={isEditMode} className="w-full text-center md:text-left inline-block" />
                </h2>
             </div>
             <div className="flex gap-4 items-center">
                 {madingList.length > 3 && (
                   <div className="flex bg-neutral-100 p-2 rounded-full shadow-inner border border-neutral-200">
                     <button onClick={handlePrevMading} disabled={madingIndex === 0} className={`p-4 rounded-full transition ${madingIndex === 0 ? 'text-gray-300 cursor-not-allowed' : 'text-emerald-600 bg-white shadow-md hover:bg-emerald-50'}`}><ChevronLeft size={24}/></button>
                     <button onClick={handleNextMading} disabled={madingIndex + 3 >= madingList.length} className={`p-4 rounded-full transition ${madingIndex + 3 >= madingList.length ? 'text-gray-300 cursor-not-allowed' : 'text-emerald-600 bg-white shadow-md hover:bg-emerald-50'}`}><ChevronRight size={24}/></button>
                   </div>
                 )}
                 {isEditMode && <button onClick={() => updateList('mading', [...madingList, {id: Date.now(), title: "Berita Utama", desc: "Deskripsi singkat kegiatan.", img: "https://via.placeholder.com/800", category: "KEGIATAN"}])} className="bg-black text-white px-12 py-5 rounded-3xl font-black uppercase tracking-widest hover:bg-emerald-600 transition shadow-2xl flex items-center gap-4"><PlusCircle size={24}/> Tambah Informasi</button>}
             </div>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 relative">
             {visibleMading.map((item) => {
               const idx = madingList.findIndex(m => m.id === item.id);
               return (
               <div key={item.id} className="group cursor-pointer bg-neutral-50 rounded-[3rem] overflow-hidden border border-neutral-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500" onClick={()=>setDetailModal({open:true, item, type:'mading'})}>
                  <div className="h-72 relative overflow-hidden bg-neutral-200">
                    <img src={item.img} className="w-full h-full object-cover transition duration-1000 group-hover:scale-110" alt="News"/>
                    <div className="absolute top-8 left-8 bg-black text-white px-6 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest z-30 shadow-lg z-30 pointer-events-auto">
                      <EditableText value={item.category} onChange={v=>{const l=[...data.mading];l[idx].category=v;updateList('mading',l)}} isEditMode={isEditMode} />
                    </div>
                    {isEditMode && (
                      <div className="absolute inset-0 bg-emerald-950/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition z-20" onClick={e=>e.stopPropagation()}>
                         <label className="cursor-pointer bg-white text-black p-5 rounded-full shadow-2xl hover:scale-110 transition"><Camera size={28}/><input type="file" className="hidden" onChange={e=>handleUpload(e, 'mading', 'img', item.id)}/></label>
                         <button onClick={()=>updateList('mading', data.mading.filter(m=>m.id!==item.id))} className="ml-5 bg-red-600 text-white p-5 rounded-full hover:scale-110 transition"><Trash2 size={28}/></button>
                      </div>
                    )}
                  </div>
                  <div className="p-12">
                    <h3 className="text-3xl font-black uppercase italic tracking-tighter mb-5 leading-tight group-hover:text-emerald-600 transition duration-300"><EditableText value={item.title} onChange={v=>{const l=[...data.mading];l[idx].title=v;updateList('mading',l)}} isEditMode={isEditMode} /></h3>
                    <p className="text-gray-500 text-base line-clamp-3 leading-relaxed font-medium mb-10"><EditableText value={item.desc} onChange={v=>{const l=[...data.mading];l[idx].desc=v;updateList('mading',l)}} isEditMode={isEditMode} type="textarea" /></p>
                    <div className="flex items-center gap-3 text-emerald-600 font-black text-xs uppercase tracking-widest group-hover:gap-6 transition-all duration-500">Selengkapnya <ChevronRight size={18}/></div>
                  </div>
               </div>
               );
             })}
           </div>
        </div>
      </section>

      <section className="py-32 bg-neutral-950 text-white border-y border-white/10">
        <div className="container mx-auto px-6 text-center">
          <div className="flex flex-col items-center mb-24">
            <div className="w-24 h-24 bg-emerald-600 rounded-[2rem] flex items-center justify-center mb-10 shadow-[0_0_50px_rgba(16,185,129,0.3)]"><ShoppingCart size={48}/></div>
            <h2 className="text-6xl md:text-8xl font-black uppercase italic tracking-tighter mb-8 leading-none flex w-full">
               <EditableText value={data.sectionTitles?.storeTitle || "HMS Merch Store"} onChange={v=>updateDataText('sectionTitles', 'storeTitle', v)} isEditMode={isEditMode} className="w-full text-center inline-block" />
            </h2>
            <p className="text-neutral-500 max-w-4xl mx-auto text-xl font-medium leading-relaxed italic text-center w-full flex">
               <EditableText value={data.sectionTitles?.storeSubtitle || "Katalog resmi atribut dan perlengkapan Himpunan Mahasiswa Sipil Untirta."} onChange={v=>updateDataText('sectionTitles', 'storeSubtitle', v)} isEditMode={isEditMode} type="textarea" className="w-full text-center bg-transparent" />
            </p>
            {isEditMode && <button onClick={() => updateList('merch', [...(data.merch||[]), {id: Date.now(), name: "Nama Produk", price: "Rp 0", img: "https://via.placeholder.com/600", wa: "628xxx"}])} className="mt-12 bg-white text-black px-12 py-5 rounded-full font-black uppercase tracking-widest text-xs flex items-center gap-4 hover:bg-emerald-500 hover:text-white transition shadow-2xl active:scale-95"><PlusCircle size={20}/> Tambah Katalog Produk</button>}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
            {(data.merch || []).map((item, idx) => (
              <div key={item.id} className="group text-left">
                <div className="aspect-[4/5] bg-neutral-900 rounded-[3rem] mb-8 relative overflow-hidden border border-white/5 shadow-2xl">
                  <img src={item.img} className="w-full h-full object-cover transition duration-1000 group-hover:scale-110 grayscale group-hover:grayscale-0" alt="Item"/>
                  {isEditMode && (
                    <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center gap-5 opacity-0 group-hover:opacity-100 transition z-20">
                       <label className="cursor-pointer bg-white text-black px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest hover:scale-110 transition shadow-2xl">Ganti Foto <input type="file" className="hidden" onChange={e=>handleUpload(e, 'merch', 'img', item.id)}/></label>
                       <button onClick={()=>updateList('merch', data.merch.filter(m=>m.id!==item.id))} className="text-red-500 font-black text-xs uppercase hover:underline">Hapus Katalog</button>
                    </div>
                  )}
                  <div className="absolute bottom-8 left-8 right-8 opacity-0 group-hover:opacity-100 translate-y-6 group-hover:translate-y-0 transition-all duration-700">
                     {!isEditMode && <button onClick={()=>window.open(`https://wa.me/${item.wa}?text=Halo HMS Store, saya tertarik dengan ${item.name}`, '_blank')} className="w-full bg-emerald-600 text-white py-5 rounded-2xl font-black uppercase text-[11px] tracking-widest shadow-2xl shadow-emerald-950/50 hover:bg-emerald-50 transition">Pesan Sekarang</button>}
                  </div>
                </div>
                <div className="px-6 text-center md:text-left">
                  <h3 className="text-2xl font-black uppercase italic tracking-tighter mb-2 block text-white/90 leading-none"><EditableText value={item.name} onChange={v=>{const l=[...data.merch];l[idx].name=v;updateList('merch',l)}} isEditMode={isEditMode} /></h3>
                  <p className="text-emerald-500 font-black text-sm tracking-widest block mb-6 leading-none"><EditableText value={item.price} onChange={v=>{const l=[...data.merch];l[idx].price=v;updateList('merch',l)}} isEditMode={isEditMode} /></p>
                  {isEditMode && <div className="space-y-2"><p className="text-[9px] text-gray-500 font-black uppercase">No. WhatsApp Pemesanan:</p><input placeholder="628xxxxxxxx (WA)" value={item.wa} onChange={e=>{const l=[...data.merch];l[idx].wa=e.target.value;updateList('merch',l)}} className="w-full bg-black border border-neutral-800 text-[11px] p-3 rounded-xl text-white font-mono focus:border-emerald-500 outline-none" /></div>}
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
