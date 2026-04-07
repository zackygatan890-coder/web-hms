import React, { useState } from 'react';
import { X, Image as ImageIcon } from 'lucide-react';

const GallerySection = ({ data }) => {
  const [lightbox, setLightbox] = useState(null);
  const gallery = data.gallery || [];

  if (gallery.length === 0) return null;

  return (
    <>
      <section className="py-20 md:py-32 bg-neutral-50 w-full border-t border-neutral-100">
        <div className="container mx-auto px-6 md:px-12">
          <div className="flex flex-col items-center mb-16 md:mb-24 text-center">
            <div className="bg-white p-4 rounded-full shadow-lg mb-8 text-amber-500">
              <ImageIcon size={40} />
            </div>
            <p className="text-amber-600 font-black tracking-[0.6em] text-xs uppercase mb-4 italic">
              {data.sectionTitles?.gallerySubtitle || "Activity Highlights"}
            </p>
            <h2 className="text-5xl md:text-7xl font-black text-neutral-900 uppercase italic tracking-tighter leading-none">
              {data.sectionTitles?.galleryTitle || "Galeri Kegiatan"}
            </h2>
          </div>

          <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
            {gallery.map((item) => (
              <div
                key={item.id}
                className="break-inside-avoid group cursor-pointer overflow-hidden rounded-2xl md:rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 relative bg-neutral-200"
                onClick={() => setLightbox(item)}
              >
                <img src={item.img} className="w-full h-auto object-cover group-hover:scale-105 transition duration-700" alt={item.title} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition duration-500 flex items-end p-6">
                  <p className="text-white font-black text-sm uppercase tracking-wider">{item.title}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {lightbox && (
        <div className="fixed inset-0 z-[400] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4" onClick={() => setLightbox(null)}>
          <button onClick={() => setLightbox(null)} className="absolute top-6 right-6 bg-white/10 text-white p-4 rounded-full hover:bg-red-500 transition backdrop-blur-md z-10">
            <X size={28} />
          </button>
          <div className="max-w-5xl max-h-[90vh] relative" onClick={e => e.stopPropagation()}>
            <img src={lightbox.img} className="max-w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl" alt={lightbox.title} />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-8 rounded-b-2xl">
              <h3 className="text-white font-black text-2xl uppercase italic tracking-tighter">{lightbox.title}</h3>
              {lightbox.desc && <p className="text-white/70 text-sm mt-2 font-medium">{lightbox.desc}</p>}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default GallerySection;
