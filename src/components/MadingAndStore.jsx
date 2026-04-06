import React, { useState } from 'react';
import { ChevronRight, ChevronLeft, ShoppingCart, Camera, Trash2, PlusCircle } from 'lucide-react';
import EditableText from './ui/EditableText';

const MadingAndStore = ({ data, setDetailModal, isEditMode, updateList, updateDataText, handleUpload }) => {
  const [madingIndex, setMadingIndex] = useState(0);
  const madingList = data.mading || [];
  const merchList = data.merch || [];
  
  // Jika edit mode, tampilkan semua tanpa carousel
  const visibleMading = isEditMode ? madingList : madingList.slice(madingIndex, madingIndex + 3);
  
  const handlePrevMading = () => {
    if (madingIndex > 0) setMadingIndex(prev => prev - 1);
  };
  const handleNextMading = () => {
    if (madingIndex + 3 < madingList.length) setMadingIndex(prev => prev + 1);
  };

  return (
    <>
      <section id="mading" className={`py-20 md:py-32 bg-white ${isEditMode ? 'border-4 border-dashed border-emerald-500 m-8 rounded-3xl' : ''}`}>
        <div className="container mx-auto px-6">
           {isEditMode && <p className="text-xs font-black uppercase tracking-widest text-emerald-500 bg-emerald-50 inline-block px-4 py-2 rounded-full mb-8">Section: Mading Info</p>}
           
           <div className="flex flex-col md:flex-row justify-between items-center mb-24 gap-8">
             <div className="text-center md:text-left flex flex-col items-center md:items-start w-full">
                <p className="text-emerald-600 font-black tracking-[0.5em] text-xs uppercase mb-3 text-center md:text-left w-full">
                  <EditableText value={data.sectionTitles?.madingSubtitle || "Community Bulletin"} onChange={v=>updateDataText?.('sectionTitles', 'madingSubtitle', v)} isEditMode={isEditMode} className={isEditMode?"bg-neutral-100 p-2 rounded":""}/>
                </p>
                <h2 className="text-5xl md:text-6xl lg:text-7xl font-black text-neutral-950 uppercase italic tracking-tighter leading-none text-center md:text-left w-full flex">
                  <EditableText value={data.sectionTitles?.madingTitle || "Mading Digital HMS"} onChange={v=>updateDataText?.('sectionTitles', 'madingTitle', v)} isEditMode={isEditMode} className={isEditMode?"bg-neutral-100 p-2 rounded":""}/>
                </h2>
             </div>
             {!isEditMode && madingList.length > 3 && (
                 <div className="flex bg-neutral-100 p-2 rounded-full shadow-inner border border-neutral-200">
                   <button onClick={handlePrevMading} disabled={madingIndex === 0} className={`p-4 rounded-full transition ${madingIndex === 0 ? 'text-gray-300 cursor-not-allowed' : 'text-emerald-600 bg-white shadow-md hover:bg-emerald-50'}`}><ChevronLeft size={24}/></button>
                   <button onClick={handleNextMading} disabled={madingIndex + 3 >= madingList.length} className={`p-4 rounded-full transition ${madingIndex + 3 >= madingList.length ? 'text-gray-300 cursor-not-allowed' : 'text-emerald-600 bg-white shadow-md hover:bg-emerald-50'}`}><ChevronRight size={24}/></button>
                 </div>
             )}
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 relative">
             {visibleMading.map((item, idx) => (
               <div key={item.id} className="group cursor-pointer bg-neutral-50 rounded-[2rem] md:rounded-[3rem] overflow-hidden border border-neutral-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 relative" onClick={()=>!isEditMode && setDetailModal({open:true, item, type:'mading'})}>
                  <div className="h-64 md:h-72 relative overflow-hidden bg-neutral-200">
                    <img src={item.img} className="w-full h-full object-cover transition duration-1000 group-hover:scale-110" alt={`Berita HMS Untirta: ${item.title}`}/>
                    
                    {isEditMode ? (
                        <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition z-10">
                            <label className="cursor-pointer bg-white text-black px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2"><Camera size={14}/> Ganti Sampul <input type="file" className="hidden" onChange={(e) => handleUpload(e, 'mading', 'img', item.id)} /></label>
                            <button onClick={(e) => { e.stopPropagation(); updateList('mading', madingList.filter(m => m.id !== item.id)); }} className="text-red-500 bg-red-100 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2"><Trash2 size={14}/> Hapus Berita</button>
                        </div>
                    ) : (
                        <div className="absolute top-8 left-8 bg-black text-white px-6 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest z-30 shadow-lg pointer-events-auto">
                          {item.category}
                        </div>
                    )}
                  </div>
                  
                  <div className="p-12">
                    {isEditMode && <p className="text-[10px] text-gray-500 font-bold mb-1 uppercase">Kategori & Judul</p>}
                    {isEditMode && (
                        <EditableText value={item.category || "Berita"} onChange={v=>{const l=[...madingList];l[idx].category=v;updateList('mading',l)}} isEditMode={isEditMode} className="text-[10px] bg-neutral-200 p-1 rounded font-black uppercase tracking-widest mb-2 block w-max"/>
                    )}
                    <h3 className="text-3xl font-black uppercase italic tracking-tighter mb-5 leading-tight group-hover:text-emerald-600 transition duration-300">
                       <EditableText value={item.title} onChange={v=>{const l=[...madingList];l[idx].title=v;updateList('mading',l)}} isEditMode={isEditMode} className={isEditMode?"bg-white p-2 border border-neutral-200 rounded block w-full":""}/>
                    </h3>
                    
                    {isEditMode && <p className="text-[10px] text-gray-500 font-bold mb-1 uppercase">Isi Berita</p>}
                    <p className={`text-gray-500 text-base leading-relaxed font-medium mb-10 whitespace-pre-wrap ${!isEditMode?'line-clamp-3':''}`}>
                       <EditableText type="textarea" value={item.desc} onChange={v=>{const l=[...madingList];l[idx].desc=v;updateList('mading',l)}} isEditMode={isEditMode} className={isEditMode?"bg-white p-2 border border-neutral-200 rounded w-full":""}/>
                    </p>
                    
                    {!isEditMode && <div className="flex items-center gap-3 text-emerald-600 font-black text-xs uppercase tracking-widest group-hover:gap-6 transition-all duration-500">Selengkapnya <ChevronRight size={18}/></div>}
                  </div>
               </div>
             ))}

             {isEditMode && (
               <div className="bg-neutral-50 rounded-[3rem] overflow-hidden border-2 border-dashed border-emerald-300 flex items-center justify-center min-h-[400px]">
                  <button onClick={() => updateList('mading', [{id: Date.now(), title: "Kabar Baru", desc: "Isi konten...", img: "https://via.placeholder.com/800", category: "INFO"}, ...madingList])} className="text-emerald-600 flex flex-col items-center justify-center hover:scale-110 active:scale-95 transition">
                     <PlusCircle size={48} className="mb-4"/>
                     <span className="font-black uppercase tracking-widest text-xs">Tambah Berita Mading</span>
                  </button>
               </div>
             )}
           </div>
        </div>
      </section>

      <section className={`py-20 md:py-32 bg-neutral-950 text-white border-y border-white/10 ${isEditMode ? 'border-4 border-dashed border-emerald-500 m-8 rounded-3xl' : ''}`}>
        <div className="container mx-auto px-6 text-center">
          {isEditMode && <p className="text-xs font-black uppercase tracking-widest text-emerald-500 bg-black inline-block px-4 py-2 rounded-full mb-8">Section: HMS Store</p>}
          <div className="flex flex-col items-center mb-16 md:mb-24">
            <div className="w-20 h-20 md:w-24 md:h-24 bg-emerald-600 rounded-[2rem] flex items-center justify-center mb-8 md:mb-10 shadow-[0_0_50px_rgba(16,185,129,0.3)]"><ShoppingCart size={40} className="md:w-12 md:h-12"/></div>
            <h2 className="text-5xl md:text-6xl lg:text-8xl font-black uppercase italic tracking-tighter mb-6 md:mb-8 leading-none flex w-full">
               <EditableText value={data.sectionTitles?.storeTitle || "HMS Merch Store"} onChange={v=>updateDataText?.('sectionTitles', 'storeTitle', v)} isEditMode={isEditMode} className={isEditMode?"bg-neutral-900 border border-neutral-800 p-2 rounded text-center w-full":""}/>
            </h2>
            <p className="text-neutral-500 max-w-4xl mx-auto text-xl font-medium leading-relaxed italic text-center w-full flex">
               <EditableText value={data.sectionTitles?.storeSubtitle || "Katalog resmi atribut dan perlengkapan Himpunan Mahasiswa Sipil Untirta."} onChange={v=>updateDataText?.('sectionTitles', 'storeSubtitle', v)} isEditMode={isEditMode} className={isEditMode?"bg-neutral-900 border border-neutral-800 p-2 rounded text-center w-full":""}/>
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {merchList.map((item, idx) => (
              <div key={item.id} className="group text-left relative">
                <div className="aspect-[4/5] bg-neutral-900 rounded-[3rem] mb-8 relative overflow-hidden border border-white/5 shadow-2xl">
                  <img src={item.img} className="w-full h-full object-cover transition duration-1000 group-hover:scale-110 grayscale group-hover:grayscale-0" alt="Item"/>
                  
                  {isEditMode ? (
                      <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition z-10">
                          <label className="cursor-pointer bg-white text-black px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl flex items-center gap-2"><Camera size={14}/> Ganti Foto <input type="file" className="hidden" onChange={(e) => handleUpload(e, 'merch', 'img', item.id)} /></label>
                          <button onClick={() => updateList('merch', merchList.filter(m => m.id !== item.id))} className="text-red-500 bg-red-950 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2"><Trash2 size={14}/> Hapus</button>
                      </div>
                  ) : (
                      <div className="absolute bottom-8 left-8 right-8 opacity-0 group-hover:opacity-100 translate-y-6 group-hover:translate-y-0 transition-all duration-700">
                         <button onClick={()=>window.open(`https://wa.me/${item.wa}?text=Halo HMS Store, saya tertarik dengan ${item.name}`, '_blank')} className="w-full bg-emerald-600 text-white py-5 rounded-2xl font-black uppercase text-[11px] tracking-widest shadow-2xl shadow-emerald-950/50 hover:bg-emerald-50 transition">Pesan Sekarang</button>
                      </div>
                  )}
                </div>
                
                <div className="px-6 text-center md:text-left space-y-2">
                  {isEditMode && <p className="text-[10px] text-gray-500 font-bold uppercase">Nama Produk</p>}
                  <h3 className="text-2xl font-black uppercase italic tracking-tighter mb-2 block text-white/90 leading-none">
                     <EditableText value={item.name} onChange={v=>{const l=[...merchList];l[idx].name=v;updateList('merch',l)}} isEditMode={isEditMode} className={isEditMode?"bg-neutral-800 p-2 rounded w-full":""}/>
                  </h3>
                  
                  {isEditMode && <p className="text-[10px] text-gray-500 font-bold uppercase mt-2">Harga</p>}
                  <p className="text-emerald-500 font-black text-sm tracking-widest block mb-2 leading-none">
                     <EditableText value={item.price} onChange={v=>{const l=[...merchList];l[idx].price=v;updateList('merch',l)}} isEditMode={isEditMode} className={isEditMode?"bg-neutral-800 p-2 rounded w-full":""}/>
                  </p>

                  {isEditMode && (
                     <>
                       <p className="text-[10px] text-gray-500 font-bold uppercase mt-2">No. WA Penjual</p>
                       <EditableText value={item.wa || "628xxx"} onChange={v=>{const l=[...merchList];l[idx].wa=v;updateList('merch',l)}} isEditMode={isEditMode} className="bg-neutral-800 p-2 rounded w-full text-xs text-gray-300 font-mono"/>
                     </>
                  )}
                </div>
              </div>
            ))}

            {isEditMode && (
               <div className="bg-neutral-900 rounded-[3rem] overflow-hidden border-2 border-dashed border-neutral-700 flex items-center justify-center min-h-[300px]">
                  <button onClick={() => updateList('merch', [...merchList, {id: Date.now(), name: "Nama Produk", price: "Rp 0", wa: "628", img: "https://via.placeholder.com/400x500"}])} className="text-emerald-500 flex flex-col items-center justify-center hover:scale-110 active:scale-95 transition">
                     <PlusCircle size={48} className="mb-4"/>
                     <span className="font-black uppercase tracking-widest text-xs">Tambah Merch Baru</span>
                  </button>
               </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default MadingAndStore;
