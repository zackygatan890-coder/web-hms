import React, { Suspense, lazy, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';

const MadingAndStore = lazy(() => import('../../components/MadingAndStore'));
const MagazineSection = lazy(() => import('../../components/MagazineSection'));

export default function PublicationPage({ data }) {
  const { setDetailModal } = useOutletContext();

  useEffect(() => {
    document.title = `Publikasi & Media | ${data.identity.name}`;
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.content = `Baca mading digital, belanja merchandise, dan jelajahi e-magazine ${data.identity.name}.`;
  }, [data.identity.name]);

  return (
    <div className="w-full flex-grow flex flex-col items-center pt-32 pb-24 bg-white">
      {/* PAGE HEADER */}
      <div className="container mx-auto px-6 md:px-12 mb-10 text-center">
         <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter italic text-neutral-900 mb-6 drop-shadow-sm">Media & Jurnalistik</h1>
         <p className="text-gray-500 font-medium tracking-widest uppercase text-sm max-w-2xl mx-auto border-b-2 border-emerald-500 pb-8 inline-block">Mading Berita, Merch, & Majalah Digital</p>
      </div>

      {/* CONTENT */}
      <div className="w-full">
         <Suspense fallback={<div className="h-64 flex justify-center items-center text-emerald-500 font-black animate-pulse">Memuat Publikasi...</div>}>
            <MadingAndStore data={data} setDetailModal={setDetailModal} />
            <MagazineSection data={data} />
         </Suspense>
      </div>
    </div>
  );
}
