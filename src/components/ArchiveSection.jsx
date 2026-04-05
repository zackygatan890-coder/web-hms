import React, { useState, useMemo } from 'react';
import { Lock, ChevronRight, Folder, Download, Search, Filter, ShieldCheck, FileText } from 'lucide-react';

const ArchiveSection = ({ data, archives, accessCode, orgCode }) => {
  const [inputCode, setInputCode] = useState("");
  const [unlockedMode, setUnlockedMode] = useState(null); // 'akademik' | 'organisasi' | null
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");

  const handleUnlock = (e) => { 
    e.preventDefault(); 
    if (inputCode === accessCode) {
      setUnlockedMode('akademik');
    } else if (inputCode === orgCode) {
      setUnlockedMode('organisasi');
    } else {
      alert("Kode akses salah!"); 
    }
  };
  
  const isCurrentlyUnlocked = unlockedMode !== null;
  const currentViewMode = unlockedMode;

  // Mendapatkan daftar file berdasarkan mode aktif (akademik vs organisasi)
  const activeFiles = useMemo(() => {
    return (archives || []).filter(item => {
      // Pastikan ada properti archiveType pada data lama (fallback ke akademik)
      const type = item.archiveType || 'akademik';
      return type === currentViewMode;
    });
  }, [archives, currentViewMode]);

  // Mengambil daftar kategori unik dari file yang sedang aktif
  const uniqueCategories = useMemo(() => {
    const cats = new Set(activeFiles.map(a => a.category || "General"));
    return ["Semua", ...Array.from(cats)];
  }, [activeFiles]);

  // Memfilter file berdasarkan search query dan dropdown kategori
  const displayedFiles = useMemo(() => {
    return activeFiles.filter(item => {
      const matchSearch = item.title?.toLowerCase().includes((searchQuery || "").toLowerCase());
      const matchCategory = selectedCategory === "Semua" || item.category === selectedCategory;
      return matchSearch && matchCategory;
    });
  }, [activeFiles, searchQuery, selectedCategory]);


  return (
    <section id="archive" className="py-20 md:py-32 bg-neutral-950 text-white border-t border-neutral-900">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-4xl md:text-5xl font-black uppercase mb-12 md:mb-16 italic tracking-tighter text-white/90 w-full text-center flex">
           {data.sectionTitles?.archiveTitle || "Arsip Digital HMS"}
        </h2>
        {!isCurrentlyUnlocked ? (
          <div className="max-w-lg mx-auto bg-neutral-900 p-12 rounded-[3rem] border border-neutral-800 shadow-2xl relative overflow-hidden flex flex-col items-center">
            <Lock size={64} className="mx-auto text-emerald-500 mb-8 opacity-60 animate-pulse md:w-[72px] md:h-[72px]"/>
            <h3 className="text-xl md:text-2xl font-black mb-4 uppercase italic w-full text-center flex">
               {data.sectionTitles?.archiveLockTitle || "Password Protected"}
            </h3>
            <p className="text-neutral-500 mb-10 text-sm leading-relaxed font-medium w-full text-center flex mb-4">
               {data.sectionTitles?.archiveLockDesc || "Database resmi modul, tugas, dan aset Teknik Sipil Untirta. Masukkan kode akses Mahasiswa atau Pengurus anda."}
            </p>
            <form onSubmit={handleUnlock} className="flex flex-col gap-4 relative z-10 w-full">
              <input type="text" placeholder="ACCESS CODE" className="bg-black border border-neutral-800 rounded-2xl px-6 py-5 text-center font-black tracking-[0.5em] uppercase outline-none focus:border-emerald-500 text-xl transition-all w-full" value={inputCode} onChange={e => setInputCode(e.target.value.toUpperCase())}/>
              <button type="submit" className="bg-emerald-600 hover:bg-emerald-500 w-full text-white py-5 rounded-2xl font-black uppercase tracking-widest transition-all shadow-lg flex justify-center items-center gap-3 active:scale-95">Open Vault <ChevronRight size={24}/></button>
            </form>
          </div>
        ) : (
          <div className="max-w-6xl mx-auto">
             
             {/* UI Search & Filter Header */}
             <div className="flex flex-col md:flex-row items-center justify-between mb-10 gap-4">
                <div className="flex items-center gap-3 text-left w-full md:w-auto">
                   <div className={`p-4 rounded-2xl ${currentViewMode === 'organisasi' ? 'bg-blue-500/10 text-blue-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
                     {currentViewMode === 'organisasi' ? <ShieldCheck size={28}/> : <Folder size={28}/>}
                   </div>
                   <div>
                     <h3 className="text-2xl font-black uppercase italic leading-none">{currentViewMode === 'organisasi' ? "Vault Pengurus (Secret)" : "Modul & Bank Soal"}</h3>
                     <p className="text-[10px] text-gray-500 uppercase tracking-[0.3em] font-bold mt-1">Data: {displayedFiles.length} Berkas Ditemukan</p>
                   </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                   <div className="relative w-full sm:w-64">
                     <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"/>
                     <input type="text" placeholder="Cari arsip..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-neutral-900 border border-neutral-800 focus:border-emerald-500 rounded-xl py-3 pl-11 pr-4 outline-none text-sm transition-colors"/>
                   </div>
                   <div className="relative w-full sm:w-48">
                      <Filter size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"/>
                      <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="w-full bg-neutral-900 border border-neutral-800 focus:border-emerald-500 rounded-xl py-3 pl-11 pr-4 outline-none text-sm appearance-none cursor-pointer">
                        {uniqueCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                      </select>
                   </div>
                </div>
             </div>

             {/* Arsip Grid View */}
             {displayedFiles.length === 0 ? (
                <div className="py-24 text-center border-2 border-dashed border-neutral-800 rounded-[3rem]">
                   <Folder size={48} className="mx-auto text-neutral-800 mb-4"/>
                   <p className="text-neutral-500 font-bold uppercase tracking-widest text-sm">Tidak ada arsip yang ditemukan.</p>
                </div>
             ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
                  {displayedFiles.map((item) => (
                    <div key={item.id} className="flex flex-col justify-between p-7 bg-neutral-900 rounded-[2rem] border border-neutral-800 hover:border-emerald-500 transition duration-500 group relative shadow-lg">
                      <div className="flex items-start gap-4 mb-8">
                        <div className={`p-4 rounded-2xl transition duration-500 ${currentViewMode === 'organisasi' ? 'bg-blue-500/10 text-blue-500 group-hover:bg-blue-600 group-hover:text-white' : 'bg-emerald-500/10 text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white'}`}>
                          <FileText size={28}/>
                        </div>
                        <div className="text-left min-w-0 flex-1">
                          <h4 className="font-black truncate text-lg uppercase italic text-white/90 group-hover:text-white transition leading-none mb-3">{item.title}</h4>
                          <span className={`px-3 py-1 text-[9px] uppercase font-black tracking-widest rounded-md ${currentViewMode === 'organisasi' ? 'bg-blue-950 text-blue-400' : 'bg-emerald-950 text-emerald-400'}`}>{item.category}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                         <a href={item.link || "#"} target="_blank" rel="noreferrer" className={`w-full text-white py-4 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-3 shadow-xl ${currentViewMode === 'organisasi' ? 'bg-blue-600 hover:bg-blue-500 hover:shadow-blue-900/50' : 'bg-emerald-600 hover:bg-emerald-500 hover:shadow-emerald-900/50'}`}>Akses Berkas <Download size={16}/></a>
                      </div>
                    </div>
                  ))}
                </div>
             )}
          </div>
        )}
      </div>
    </section>
  );
};

export default ArchiveSection;
