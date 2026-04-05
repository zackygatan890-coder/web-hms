import React, { Suspense, lazy } from 'react';
import { ShieldAlert } from 'lucide-react';

const ArchiveSection = lazy(() => import('../../components/ArchiveSection'));
const MabaSection = lazy(() => import('../../components/MabaSection'));
const OprecSection = lazy(() => import('../../components/OprecSection'));

export default function ServicesPage({ data }) {
  return (
    <div className="w-full flex-grow flex flex-col items-center pt-32 pb-24 bg-neutral-900 min-h-screen">
      {/* PAGE HEADER */}
      <div className="container mx-auto px-6 md:px-12 mb-20 text-center">
         <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter italic text-white mb-6 drop-shadow-[0_0_40px_rgba(16,185,129,0.3)]">Layanan & Portal</h1>
         <p className="text-emerald-500 font-medium tracking-widest uppercase text-sm max-w-2xl mx-auto border-b border-neutral-800 pb-8 inline-block">Sistem Informasi, Registrasi, & Arsip Terpusat</p>
      </div>

      {/* CONTENT */}
      <div className="w-full">
         <Suspense fallback={<div className="h-64 flex justify-center items-center text-emerald-500 font-black animate-pulse">Memuat Layanan...</div>}>
            <ArchiveSection data={data} archives={data.archives} accessCode={data.identity.archivePassword} orgCode={data.identity.orgPassword}/>
            
            {data.identity.isMabaOpen ? (
               <MabaSection data={data} />
            ) : (
               <section className="py-20 bg-neutral-950 text-white text-center border-t border-neutral-900 flex flex-col items-center justify-center">
                  <ShieldAlert size={48} className="text-neutral-700 mb-6"/>
                  <h3 className="text-2xl font-black uppercase tracking-widest italic text-neutral-600">Portal Pendataan Maba Tertutup</h3>
               </section>
            )}

            {data.identity.isOprecOpen ? (
               <OprecSection data={data} />
            ) : (
               <section className="py-20 bg-black text-white text-center border-t border-neutral-900 flex flex-col items-center justify-center">
                  <ShieldAlert size={48} className="text-neutral-700 mb-6"/>
                  <h3 className="text-2xl font-black uppercase tracking-widest italic text-neutral-600">Formulir Rekrutmen Tertutup</h3>
               </section>
            )}
         </Suspense>
      </div>
    </div>
  );
}
