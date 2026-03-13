import React from 'react';
import { HeartHandshake, CheckCircle2, MessageCircle, ExternalLink, Settings, FileText } from 'lucide-react';
import EditableText from './ui/EditableText';

const MedpartSection = ({ data, updateIdentity, updateDataText, updateList, isEditMode }) => {
  // Ambil daftar syarat (requirements) dari database, atau berikan default
  const requirements = data.medpartReqs || [
    { id: 1, text: "Wajib follow akun Instagram @hms_untirta" },
    { id: 2, text: "Memasang logo HMS Untirta pada poster/pamflet acara (H-7)" },
    { id: 3, text: "Akun instansi/acara media partner minimal memiliki 500 followers" },
    { id: 4, text: "Tema acara tidak berkaitan dengan politik praktis atau SARA" }
  ];

  // Nomor WA Humas/Narahubung
  const cpNumber = data.identity?.medpartWa || "628xxxxxxxxxx";

  const handleWhatsappClick = () => {
    const message = "Halo Humas HMS Untirta, kami tertarik untuk mengajukan kerjasama Media Partner. Kami telah menyetujui persyaratan yang tertera di website.";
    window.open(`https://wa.me/${cpNumber}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <section id="medpart" className="py-20 md:py-32 bg-white border-t border-neutral-100">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-16 items-center">
          
          {/* KIRI: Deskripsi & Syarat */}
          <div className="lg:w-1/2 flex flex-col items-center text-center lg:items-start lg:text-left">
             <span className="inline-flex bg-blue-100 text-blue-700 font-black px-4 py-2 text-[10px] rounded-full mb-6 tracking-[0.2em] uppercase items-center gap-2 shadow-sm border border-blue-200">
               <HeartHandshake size={14}/>
               <EditableText value={data.sectionTitles?.medpartSubtitle || "Partnership Program"} onChange={v=>updateDataText('sectionTitles', 'medpartSubtitle', v)} isEditMode={isEditMode} className="bg-transparent text-blue-700 w-full" />
             </span>
             <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 text-neutral-900 uppercase italic tracking-tighter w-full">
               <EditableText value={data.sectionTitles?.medpartTitle || "Media Partner HMS"} onChange={v=>updateDataText('sectionTitles', 'medpartTitle', v)} isEditMode={isEditMode} className="w-full bg-transparent" />
             </h2>
             <p className="text-gray-500 text-lg leading-relaxed mb-10 font-medium italic w-full">
               <EditableText value={data.sectionTitles?.medpartDesc || "Tingkatkan exposure acara Himpunan/Organisasi Anda dengan menjalin kerja sama Media Partner bersama HMS Untirta. Berikut adalah syarat dan ketentuannya:"} onChange={v=>updateDataText('sectionTitles', 'medpartDesc', v)} isEditMode={isEditMode} type="textarea" className="w-full bg-transparent" />
             </p>
             
             {/* Daftar Syarat */}
             <div className="w-full bg-neutral-50 p-8 rounded-[2rem] border border-neutral-200 mb-8 shadow-inner">
               <h3 className="text-lg font-black uppercase text-neutral-800 tracking-widest mb-6 flex items-center gap-3">
                 <FileText size={20} className="text-blue-500"/> Syarat & Ketentuan
               </h3>
               <ul className="space-y-4">
                 {requirements.map((req, idx) => (
                   <li key={req.id} className="flex items-start gap-4">
                     <CheckCircle2 size={24} className="text-emerald-500 shrink-0 mt-0.5"/>
                     <div className="text-neutral-600 font-medium leading-relaxed w-full">
                       <EditableText value={req.text} onChange={v => { const newList=[...requirements]; newList[idx].text=v; updateList('medpartReqs', newList) }} isEditMode={isEditMode} type="textarea" className="w-full" />
                     </div>
                     {isEditMode && (
                        <button onClick={() => updateList('medpartReqs', requirements.filter(r => r.id !== req.id))} className="text-red-500 hover:bg-red-100 p-2 rounded-lg transition shrink-0"><CheckCircle2 size={16} className="opacity-0 hidden"/>Hapus</button>
                     )}
                   </li>
                 ))}
               </ul>
               {isEditMode && (
                 <button onClick={() => updateList('medpartReqs', [...requirements, {id: Date.now(), text: "Syarat baru..."}])} className="mt-6 text-xs font-black uppercase tracking-widest text-emerald-600 hover:text-emerald-500 flex items-center gap-2 transition p-3 bg-emerald-50 rounded-xl hover:bg-emerald-100 border border-emerald-200">
                   + Tambah Persyaratan
                 </button>
               )}
             </div>
          </div>

          {/* KANAN: Card Action / Form */}
          <div className="lg:w-1/2 w-full">
             <div className="bg-neutral-950 p-8 md:p-14 rounded-[3.5rem] shadow-2xl relative overflow-hidden border border-neutral-900 group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600 rounded-full blur-[100px] opacity-20 group-hover:opacity-40 transition duration-700 pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-600 rounded-full blur-[100px] opacity-20 group-hover:opacity-40 transition duration-700 pointer-events-none"></div>
                
                <div className="relative z-10 flex flex-col items-center text-center">
                   <div className="bg-neutral-900 p-6 rounded-[2.5rem] border border-neutral-800 mb-8 inline-block shadow-inner">
                     <MessageCircle size={56} className="text-blue-400"/>
                   </div>
                   <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter mb-4">Pengajuan Cepat</h3>
                   <p className="text-neutral-400 font-medium leading-relaxed mb-10 text-sm">
                     Sudah memenuhi semua persyaratan di samping? Klik tombol di bawah ini untuk terhubung langsung dengan Admin Humas HMS via WhatsApp.
                   </p>

                   {/* Admin Control untuk Nomor WA */}
                   {isEditMode && (
                     <div className="w-full bg-black/50 p-6 rounded-3xl border border-blue-500/30 mb-8 max-w-sm">
                       <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400 flex items-center gap-2 mb-3 justify-center"><Settings size={12}/> Admin: Atur Nomor WA Humas</p>
                       <input 
                         type="text" 
                         value={cpNumber}
                         onChange={(e) => updateIdentity('medpartWa', e.target.value)}
                         className="w-full bg-black border border-neutral-800 text-white px-4 py-3 rounded-xl font-mono text-center focus:border-blue-500 outline-none"
                         placeholder="Contoh: 628123456789"
                       />
                     </div>
                   )}

                   <button 
                     onClick={handleWhatsappClick}
                     className="w-full max-w-sm bg-white text-black py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-emerald-400 transition-all shadow-xl hover:shadow-emerald-900/50 flex items-center justify-center gap-3 active:scale-95"
                   >
                     Hubungi Humas <ExternalLink size={18}/>
                   </button>
                </div>
             </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MedpartSection;
