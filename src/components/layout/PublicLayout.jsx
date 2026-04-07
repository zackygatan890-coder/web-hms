import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Menu, X, Instagram, Youtube, MessageCircle, Sparkles, Target, Moon, Sun } from 'lucide-react';
import SEOEngine from '../SEOEngine';
import useDarkMode from '../../utils/useDarkMode';

export default function PublicLayout({ data }) {
  const [detailModal, setDetailModal] = useState({ open: false, item: null, type: null });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDark, toggleDark] = useDarkMode();
  const location = useLocation();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950 font-sans text-neutral-900 dark:text-white pb-0 flex flex-col overflow-x-hidden">
      <SEOEngine 
        name={data.identity.name} 
        title={data.hero.title} 
        desc={data.hero.desc} 
        logo={data.identity.logoUrl} 
        verifyId={data.identity.googleVerifyId}
      />

      {/* GLOBAL DETAIL MODAL FOR ALL PUBLICS */}
      {detailModal.open && (
        <div className="fixed inset-0 z-[350] flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl" onClick={()=>setDetailModal({open:false})}>
          <div className="bg-white w-full max-w-4xl rounded-[4rem] overflow-hidden shadow-2xl relative" onClick={e=>e.stopPropagation()}>
            <button onClick={()=>setDetailModal({open:false})} className="absolute top-8 right-8 z-10 bg-black/40 text-white p-4 rounded-full hover:bg-red-500 transition backdrop-blur-md"><X size={28}/></button>
            <div className="flex flex-col md:flex-row h-[80vh] md:h-[600px]">
               <div className="md:w-1/2 h-64 md:h-auto bg-neutral-200">
                  <img src={detailModal.item.img || detailModal.item.url || detailModal.item.headImg} className="w-full h-full object-cover" alt="Focus"/>
               </div>
               <div className="md:w-1/2 p-12 md:p-16 overflow-y-auto bg-white flex flex-col justify-center text-left">
                  <p className="text-emerald-600 font-black text-xs uppercase tracking-[0.4em] mb-4 italic">{detailModal.item.category || detailModal.item.role || "Database Info"}</p>
                  <h3 className="text-5xl font-black uppercase italic tracking-tighter mb-8 leading-none border-l-8 border-emerald-600 pl-8">{detailModal.item.title || detailModal.item.name}</h3>
                  <p className="text-gray-600 text-xl leading-relaxed whitespace-pre-wrap font-medium italic">{detailModal.item.desc || detailModal.item.bio || detailModal.item.detail || detailModal.item.story || "Informasi sedang diperbarui."}</p>
               </div>
            </div>
          </div>
        </div>
      )}

      {/* NAVBAR MAIN */}
      <nav className="fixed w-full z-[200] bg-black/95 backdrop-blur-xl text-white py-4 md:py-6 border-b border-emerald-900/30 transition-all">
        <div className="container mx-auto px-6 md:px-12 flex justify-between items-center">
          <div className="flex items-center gap-4 md:gap-6">
            <button className="lg:hidden text-white p-2 -ml-2 hover:bg-white/10 rounded-lg transition" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
               {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <Link to="/" className="relative cursor-pointer">
              <img src={data.identity.logoUrl} className="h-10 w-10 md:h-12 md:w-12 bg-white rounded-full p-1 shadow-2xl shadow-emerald-500/20" alt="Logo"/>
            </Link>
            <Link to="/" className="text-xl md:text-2xl font-black tracking-tighter uppercase italic drop-shadow-xl hidden sm:block hover:text-emerald-400 transition">{data.identity.name}</Link>
          </div>

          <div className="hidden lg:flex items-center gap-8 font-black text-[10px] uppercase tracking-[0.2em] text-neutral-400 mt-1">
            <Link to="/" className={location.pathname === '/' ? "text-emerald-400" : "hover:text-emerald-400 transition"}>Beranda</Link>
            <Link to="/tentang-kami" className={location.pathname === '/tentang-kami' ? "text-emerald-400" : "hover:text-emerald-400 transition"}>Tentang Kami</Link>
            <Link to="/publikasi" className={location.pathname === '/publikasi' ? "text-emerald-400" : "hover:text-emerald-400 transition"}>Publikasi</Link>
            <Link to="/portal-layanan" className={location.pathname === '/portal-layanan' ? "text-emerald-400" : "hover:text-emerald-400 transition"}>Portal & Layanan</Link>
            
            {/* Quick Badges */}
            {data.identity.isMabaOpen && <Link to="/portal-layanan" className="text-blue-400 hover:text-blue-300 transition flex items-center gap-1">Maba <Sparkles size={12}/></Link>}
            {data.identity.isOprecOpen && <Link to="/portal-layanan" className="text-yellow-400 hover:text-yellow-300 transition flex items-center gap-1">Oprec <Target size={12}/></Link>}

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDark}
              aria-label="Toggle dark mode"
              className="p-2 rounded-full hover:bg-white/10 transition text-neutral-400 hover:text-emerald-400"
            >
              {isDark ? <Sun size={16} /> : <Moon size={16} />}
            </button>
          </div>
        </div>

        {/* MOBILE DROPDOWN MENU */}
        {isMobileMenuOpen && (
          <div className="lg:hidden absolute top-[100%] left-0 w-full bg-black/95 backdrop-blur-3xl border-b border-emerald-900/30 flex flex-col items-center py-8 gap-8 font-black text-xs uppercase tracking-[0.2em] text-neutral-300 shadow-2xl overflow-y-auto max-h-[80vh]">
            <Link to="/" onClick={()=>setIsMobileMenuOpen(false)} className="hover:text-emerald-400 transition w-full text-center py-2">Beranda</Link>
            <Link to="/tentang-kami" onClick={()=>setIsMobileMenuOpen(false)} className="hover:text-emerald-400 transition w-full text-center py-2">Tentang Kami</Link>
            <Link to="/publikasi" onClick={()=>setIsMobileMenuOpen(false)} className="hover:text-emerald-400 transition w-full text-center py-2">Publikasi & Dokumen</Link>
            <Link to="/portal-layanan" onClick={()=>setIsMobileMenuOpen(false)} className="hover:text-emerald-400 transition w-full text-center py-2">Portal & Layanan Form</Link>
            
            {data.identity.isMabaOpen && <Link to="/portal-layanan" onClick={()=>setIsMobileMenuOpen(false)} className="text-blue-400 hover:text-blue-300 transition w-full text-center py-2 flex justify-center items-center gap-2">Portal Maba <Sparkles size={16}/></Link>}
            {data.identity.isOprecOpen && <Link to="/portal-layanan" onClick={()=>setIsMobileMenuOpen(false)} className="text-yellow-400 hover:text-yellow-300 transition w-full text-center py-2 flex justify-center items-center gap-2">Open Recruitment <Target size={16}/></Link>}
          </div>
        )}
      </nav>

      {/* DYNAMIC CONTENT OUTLET */}
      <main className="flex-grow flex flex-col w-full">
         <Outlet context={{ setDetailModal }} />
      </main>

      {/* FOOTER */}
      <footer className="bg-black w-full text-white py-24 md:py-48 text-center border-t border-emerald-900/50 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent"></div>
        <div className="container mx-auto px-6 relative z-10">
          <img src={data.identity.logoUrl} className="h-32 w-32 mx-auto mb-8 bg-white rounded-full p-3 grayscale hover:grayscale-0 transition duration-1000 shadow-[0_0_60px_rgba(255,255,255,0.05)]" alt="Footer Logo"/>
          
          <div className="flex justify-center gap-8 mb-16">
            {data.social?.instagram && <a href={data.social.instagram} target="_blank" rel="noreferrer" className="text-neutral-600 hover:text-emerald-500 transition-colors hover:scale-110"><Instagram size={28}/></a>}
            {data.social?.tiktokUrl && <a href={data.social.tiktokUrl} target="_blank" rel="noreferrer" className="text-neutral-600 hover:text-emerald-500 transition-colors hover:scale-110">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"/></svg>
            </a>}
            {data.social?.youtube && <a href={data.social.youtube} target="_blank" rel="noreferrer" className="text-neutral-600 hover:text-emerald-500 transition-colors hover:scale-110"><Youtube size={28}/></a>}
            {data.social?.whatsapp && <a href={data.social.whatsapp} target="_blank" rel="noreferrer" className="text-neutral-600 hover:text-emerald-500 transition-colors hover:scale-110"><MessageCircle size={28}/></a>}
          </div>
          
          <a href={data.identity.secretUrl || "#"} target={data.identity.secretUrl ? "_blank" : "_self"} rel="noreferrer" className={`font-black uppercase tracking-[0.8em] text-[10px] block mt-20 transition-all duration-1000 ${data.identity.secretUrl ? 'hover:text-emerald-500 cursor-pointer hover:tracking-[1em]' : 'text-neutral-800 cursor-default pointer-events-none'}`}>
            &copy; {new Date().getFullYear()} {data.identity.name} | SIPIL JAYA!
          </a>
        </div>
      </footer>
    </div>
  );
}
