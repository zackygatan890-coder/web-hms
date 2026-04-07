import React, { useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Users, Shield, LayoutGrid } from 'lucide-react';
import useScrollReveal from '../../utils/useScrollReveal';

export default function AboutPage({ data }) {
  const { setDetailModal } = useOutletContext();
  const [profileRef, profileVisible] = useScrollReveal();
  const [bphRef, bphVisible] = useScrollReveal();
  const [bpoRef, bpoVisible] = useScrollReveal();
  const [deptRef, deptVisible] = useScrollReveal();

  useEffect(() => {
    document.title = `Tentang Kami | ${data.identity.name}`;
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.content = `Kenali sejarah, struktur organisasi, BPH, BPO, dan departemen ${data.identity.name}. Himpunan Mahasiswa Sipil FT Untirta.`;
  }, [data.identity.name]);

  return (
    <div className="w-full flex-grow flex flex-col items-center pt-32 pb-0 bg-white">
      {/* PAGE HEADER */}
      <div className="container mx-auto px-6 md:px-12 mb-20 text-center">
         <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter italic text-neutral-900 mb-6 drop-shadow-sm">Sejarah & Struktur</h1>
         <p className="text-gray-500 font-medium tracking-widest uppercase text-sm max-w-2xl mx-auto border-b-2 border-emerald-500 pb-8 inline-block">Kenali {data.identity.name} Lebih Dekat</p>
      </div>

      {/* FULL PROFILE SECTION */}
      <section ref={profileRef} className={`py-12 bg-white w-full reveal ${profileVisible?'visible':''}`}>
        <div className="container mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-32 items-start">
          <div className="relative group mx-auto w-full max-w-[600px] lg:max-w-none sticky top-32">
             <div className="absolute -inset-6 md:-inset-10 bg-emerald-500/5 rounded-[3rem] md:rounded-[5rem] -z-10 group-hover:bg-emerald-500/15 transition duration-[2000ms]"></div>
             <img src={data.profile.img} className="rounded-[3rem] md:rounded-[5rem] shadow-[0_50px_100px_rgba(0,0,0,0.15)] h-[300px] md:h-auto lg:h-[800px] w-full object-cover grayscale-0 group-hover:grayscale transition duration-[2000ms] group-hover:scale-[1.02]" alt="Profil Lengkap Himpunan Mahasiswa Sipil FT Untirta"/>
          </div>
          <div className="text-left py-8">
            <p className="text-emerald-600 font-black text-xs uppercase tracking-[0.5em] mb-6 italic">
              {data.profile.subtitle || "About Our Legacy"}
            </p>
            <h2 className="text-5xl md:text-6xl font-black mb-10 text-neutral-900 border-l-[15px] border-emerald-600 pl-8 uppercase tracking-tighter leading-none italic drop-shadow-sm flex w-full whitespace-pre-wrap">
              {data.profile.title}
            </h2>
            <div className="text-gray-600 text-2xl leading-relaxed font-semibold mb-16 italic opacity-90 w-full flex whitespace-pre-wrap">
               {data.profile.desc}
            </div>
            
            <div className="flex gap-10 border-t border-neutral-100 pt-16">
               <div className="flex flex-col">
                 <span className="text-6xl font-black text-emerald-600">{data.profile.stat1Value || "20+"}</span>
                 <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest mt-2 italic">{data.profile.stat1Label || "Tahun Berdiri"}</span>
               </div>
               <div className="flex flex-col border-l border-neutral-200 pl-10">
                 <span className="text-6xl font-black text-emerald-600">{data.profile.stat2Value || "500+"}</span>
                 <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest mt-2 italic">{data.profile.stat2Label || "Anggota Aktif"}</span>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* BPH SECTION */}
      <section ref={bphRef} className={`py-32 bg-neutral-50 w-full mt-32 rounded-t-[5rem] border-t border-neutral-200 shadow-[0_-20px_50px_rgba(0,0,0,0.02)] reveal ${bphVisible?'visible':''}`}>
        <div className="container mx-auto px-6 md:px-12 text-center">
          <div className="max-w-4xl mx-auto mb-32 flex flex-col items-center">
             <div className="bg-white p-4 rounded-full shadow-lg mb-8 text-emerald-600">
               <Users size={40} />
             </div>
             <p className="text-emerald-600 font-black tracking-[0.6em] text-xs uppercase mb-4 italic text-center w-full">
               {data.sectionTitles?.bphSubtitle || "Backbone of HMS"}
             </p>
             <h2 className="text-5xl md:text-7xl font-black text-neutral-900 uppercase italic tracking-tighter leading-none text-center w-full flex whitespace-pre-wrap">
               {data.sectionTitles?.bphTitle || "Badan Pengurus Harian"}
             </h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-12 gap-y-24">
            {(data.topManagement||[]).map((member) => (
              <div key={member.id} className="bg-white rounded-[4rem] overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.08)] border border-neutral-100 group hover:-translate-y-6 transition duration-700 cursor-pointer" onClick={()=>setDetailModal({open:true, item:member, type:'tm'})}>
                <div className="relative h-[350px] sm:h-[450px] overflow-hidden bg-neutral-200">
                  <img src={member.img} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition duration-[1500ms] scale-110 group-hover:scale-100" alt={member.name}/>
                </div>
                <div className="p-10 text-center bg-white relative z-10 -mt-10 mx-6 rounded-3xl shadow-xl">
                  <span className="text-emerald-600 font-black text-[10px] uppercase tracking-[0.4em] mb-2 block italic">{member.role}</span>
                  <span className="text-2xl font-black text-neutral-900 uppercase italic tracking-tighter leading-tight block whitespace-pre-wrap line-clamp-2">{member.name}</span>
                </div>
              </div>
            ))}
            {(!data.topManagement || data.topManagement.length === 0) && (
              <p className="col-span-4 text-gray-500 font-black tracking-widest uppercase italic py-20">Data BPH belum diunggah.</p>
            )}
          </div>
        </div>
      </section>

      {/* BPO SECTION */}
      <section ref={bpoRef} className={`py-32 bg-white w-full border-t border-neutral-100 reveal ${bpoVisible?'visible':''}`}>
        <div className="container mx-auto px-6 md:px-12 text-center">
          <div className="max-w-4xl mx-auto mb-32 flex flex-col items-center">
             <div className="bg-blue-50 p-4 rounded-full shadow-lg mb-8 text-blue-600">
               <Shield size={40} />
             </div>
             <p className="text-blue-600 font-black tracking-[0.6em] text-xs uppercase mb-4 italic text-center w-full">
               {data.sectionTitles?.bpoSubtitle || "Supervisory Board"}
             </p>
             <h2 className="text-5xl md:text-7xl font-black text-neutral-900 uppercase italic tracking-tighter leading-none text-center w-full">
               {data.sectionTitles?.bpoTitle || "Badan Pengawas Organisasi"}
             </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-24">
            {(data.bpo||[]).map((member) => (
              <div key={member.id} className="bg-white rounded-[4rem] overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.08)] border border-neutral-100 group hover:-translate-y-6 transition duration-700 cursor-pointer" onClick={()=>setDetailModal({open:true, item:member, type:'bpo'})}>
                <div className="relative h-[350px] sm:h-[450px] overflow-hidden bg-neutral-200">
                  <img src={member.img} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition duration-[1500ms] scale-110 group-hover:scale-100" alt={member.name}/>
                </div>
                <div className="p-10 text-center bg-white relative z-10 -mt-10 mx-6 rounded-3xl shadow-xl">
                  <span className="text-blue-600 font-black text-[10px] uppercase tracking-[0.4em] mb-2 block italic">{member.role}</span>
                  <span className="text-2xl font-black text-neutral-900 uppercase italic tracking-tighter leading-tight block whitespace-pre-wrap line-clamp-2">{member.name}</span>
                </div>
              </div>
            ))}
            {(!data.bpo || data.bpo.length === 0) && (
              <p className="col-span-3 text-gray-500 font-black tracking-widest uppercase italic py-20">Data BPO belum diunggah.</p>
            )}
          </div>
        </div>
      </section>

      {/* DEPARTMENTS SECTION */}
      <section ref={deptRef} className={`py-32 bg-neutral-950 w-full text-white border-t border-neutral-800 reveal ${deptVisible?'visible':''}`}>
        <div className="container mx-auto px-6 md:px-12 text-center">
          <div className="max-w-4xl mx-auto mb-32 flex flex-col items-center">
             <div className="bg-emerald-500/10 p-4 rounded-full shadow-lg mb-8 text-emerald-500">
               <LayoutGrid size={40} />
             </div>
             <p className="text-emerald-500 font-black tracking-[0.6em] text-xs uppercase mb-4 italic text-center w-full">
               {data.sectionTitles?.deptSubtitle || "Internal Org"}
             </p>
             <h2 className="text-5xl md:text-7xl font-black text-white uppercase italic tracking-tighter leading-none text-center w-full">
               {data.sectionTitles?.deptTitle || "Struktur Departemen"}
             </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {(data.departments||[]).map((dept) => (
              <div key={dept.id} className="bg-neutral-900 rounded-[3rem] overflow-hidden border border-neutral-800 group hover:border-emerald-500/50 transition duration-700 cursor-pointer text-left" onClick={()=>setDetailModal({open:true, item:{...dept, title: dept.name, img: dept.headImg}, type:'dept'})}>
                <div className="relative h-[300px] overflow-hidden bg-neutral-800">
                  <img src={dept.headImg} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition duration-700" alt={dept.name}/>
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-transparent to-transparent"></div>
                  <div className="absolute bottom-6 left-6 right-6">
                    <span className="text-emerald-400 font-black text-[10px] uppercase tracking-[0.4em] block">{dept.headName || "Kepala Departemen"}</span>
                  </div>
                </div>
                <div className="p-8">
                  <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter leading-tight mb-3">{dept.name}</h3>
                  <p className="text-neutral-500 text-sm font-medium line-clamp-2">{dept.desc || "Deskripsi belum tersedia."}</p>
                </div>
              </div>
            ))}
            {(!data.departments || data.departments.length === 0) && (
              <p className="col-span-3 text-neutral-600 font-black tracking-widest uppercase italic py-20">Data Departemen belum diunggah.</p>
            )}
          </div>
        </div>
      </section>

    </div>
  );
}
