import React, { useState, useMemo } from 'react';
import { Lock, ChevronRight, PlusCircle, Folder, Download, Trash2, Search, Filter, ShieldCheck, FileText } from 'lucide-react';
import EditableText from './ui/EditableText';

const ArchiveSection = ({ data, archives, updateDataText, isEditMode, accessCode, orgCode, updateList, setIdentityPassword, setOrgPassword }) => {
  const [inputCode, setInputCode] = useState("");
  const [unlockedMode, setUnlockedMode] = useState(null); // 'akademik' | 'organisasi' | null
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  
  // Tab state untuk Admin Edit Mode saja
  const [adminTab, setAdminTab] = useState("akademik"); 

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
  
  const isCurrentlyUnlocked = unlockedMode !== null || isEditMode;
  const currentViewMode = isEditMode ? adminTab : unlockedMode;

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
    <section className="py-32 bg-neutral-950 text-white border-t border-neutral-900">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-5xl font-black uppercase mb-16 italic tracking-tighter text-white/90 w-full text-center flex">
           <EditableText value={data.sectionTitles?.archiveTitle || "Arsip Digital HMS"} onChange={v=>updateDataText('sectionTitles', 'archiveTitle', v)} isEditMode={isEditMode} className="w-full text-center bg-transparent" />
        </h2>
        {!isCurrentlyUnlocked ? (
          <div className="max-w-lg mx-auto bg-neutral-900 p-12 rounded-[3rem] border border-neutral-800 shadow-2xl relative overflow-hidden flex flex-col items-center">
            <Lock size={72} className="mx-auto text-emerald-500 mb-8 opacity-60 animate-pulse"/>
            <h3 className="text-2xl font-black mb-4 uppercase italic w-full text-center flex">
               <EditableText value={data.sectionTitles?.archiveLockTitle || "Password Protected"} onChange={v=>updateDataText('sectionTitles', 'archiveLockTitle', v)} isEditMode={isEditMode} className="w-full text-center bg-transparent" />
            </h3>
            <p className="text-neutral-500 mb-10 text-sm leading-relaxed font-medium w-full text-center flex mb-4">
               <EditableText value={data.sectionTitles?.archiveLockDesc || "Database resmi modul, tugas, dan aset Teknik Sipil Untirta. Masukkan kode akses Mahasiswa atau Pengurus anda."} onChange={v=>updateDataText('sectionTitles', 'archiveLockDesc', v)} isEditMode={isEditMode} type="textarea" className="w-full text-center bg-transparent" />
            </p>
            <form onSubmit={handleUnlock} className="flex flex-col gap-4 relative z-10 w-full">
              <input type="text" placeholder="ACCESS CODE" className="bg-black border border-neutral-800 rounded-2xl px-6 py-5 text-center font-black tracking-[0.5em] uppercase outline-none focus:border-emerald-500 text-xl transition-all w-full" value={inputCode} onChange={e => setInputCode(e.target.value.toUpperCase())}/>
              <button type="submit" className="bg-emerald-600 hover:bg-emerald-500 w-full text-white py-5 rounded-2xl font-black uppercase tracking-widest transition-all shadow-lg flex justify-center items-center gap-3 active:scale-95">Open Vault <ChevronRight size={24}/></button>
            </form>
          </div>
        ) : (
          <div className="max-w-6xl mx-auto">
             
             {/* Admin Controls */}
             {isEditMode && (
               <div className="mb-12 p-8 bg-neutral-900 rounded-[2.5rem] border border-neutral-800 flex flex-col gap-8 shadow-2xl relative overflow-hidden">
                 <div className="absolute top-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-blue-500 to-emerald-500 opacity-50 left-0"></div>
                 
                 <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-b border-white/10 pb-8">
                   <div className="text-left flex flex-col items-start w-full md:w-1/2">
                     <p className="text-xs font-black text-emerald-500 uppercase tracking-[0.3em] mb-1 w-full flex">
                       <EditableText value={data.sectionTitles?.archiveOpenSubtitle || "Database Management"} onChange={v=>updateDataText('sectionTitles', 'archiveOpenSubtitle', v)} isEditMode={isEditMode} className="w-full bg-transparent" />
                     </p>
                     <h4 className="text-xl font-bold w-full flex text-white">
                       <EditableText value={data.sectionTitles?.archiveOpenTitle || "Pusat Kelola Berkas"} onChange={v=>updateDataText('sectionTitles', 'archiveOpenTitle', v)} isEditMode={isEditMode} className="w-full bg-transparent" />
                     </h4>
                   </div>
                   
                   <div className="flex bg-black p-1.5 rounded-2xl w-full md:w-auto shadow-inner border border-white/5">
                     <button onClick={() => setAdminTab('akademik')} className={`flex-1 md:w-40 py-3 rounded-xl font-black uppercase tracking-widest text-[10px] transition flex items-center justify-center gap-2 ${adminTab === 'akademik' ? 'bg-emerald-600 shadow-md text-white' : 'text-gray-500 hover:text-white'}`}><FileText size={14}/> Akademik</button>
                     <button onClick={() => setAdminTab('organisasi')} className={`flex-1 md:w-40 py-3 rounded-xl font-black uppercase tracking-widest text-[10px] transition flex items-center justify-center gap-2 ${adminTab === 'organisasi' ? 'bg-blue-600 shadow-md text-white' : 'text-gray-500 hover:text-white'}`}><ShieldCheck size={14}/> Organisasi</button>
                   </div>
                 </div>

                 <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex gap-4 items-center">
                      <div className="flex flex-col items-start gap-1">
                        <label className="text-[9px] uppercase font-black text-emerald-500 tracking-[0.2em] ml-2">Pass Akademik</label>
                        <input className="bg-black border border-emerald-900/50 text-xs px-5 py-3 rounded-xl outline-none focus:border-emerald-500 w-36 font-mono font-bold" placeholder="Akademik..." value={accessCode} onChange={e=>setIdentityPassword(e.target.value)}/>
                      </div>
                      <div className="flex flex-col items-start gap-1">
                        <label className="text-[9px] uppercase font-black text-blue-500 tracking-[0.2em] ml-2">Pass Organisasi</label>
                        <input className="bg-black border border-blue-900/50 text-xs px-5 py-3 rounded-xl outline-none focus:border-blue-500 w-36 font-mono font-bold" placeholder="Organisasi..." value={orgCode} onChange={e=>setOrgPassword(e.target.value)}/>
                      </div>
                    </div>
                    <button onClick={() => updateList('archives', [...(archives||[]), {id: Date.now(), title: `Aset ${currentViewMode}`, category: "General", link: "", archiveType: currentViewMode}])} className="w-full md:w-auto bg-white text-black px-8 py-4 rounded-xl font-black text-xs uppercase hover:bg-emerald-400 transition-all shadow-xl flex items-center justify-center gap-3">
                      <PlusCircle size={18}/> Tambah ke {currentViewMode}
                    </button>
                 </div>
               </div>
             )}

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
                          <h4 className="font-black truncate text-lg uppercase italic text-white/90 group-hover:text-white transition leading-none mb-3"><EditableText value={item.title} onChange={v=>{const l=[...archives]; const idx=l.findIndex(x=>x.id===item.id); l[idx].title=v;updateList('archives', l)}} isEditMode={isEditMode}/></h4>
                          <span className={`px-3 py-1 text-[9px] uppercase font-black tracking-widest rounded-md ${currentViewMode === 'organisasi' ? 'bg-blue-950 text-blue-400' : 'bg-emerald-950 text-emerald-400'}`}><EditableText value={item.category} onChange={v=>{const l=[...archives]; const idx=l.findIndex(x=>x.id===item.id); l[idx].category=v;updateList('archives', l)}} isEditMode={isEditMode}/></span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {isEditMode ? (
                          <div className="flex-1 flex gap-2 w-full"><input placeholder="GDrive URL..." value={item.link || ""} onChange={e=>{const l=[...archives]; const idx=l.findIndex(x=>x.id===item.id); l[idx].link=e.target.value;updateList('archives', l)}} className="flex-1 min-w-0 text-[10px] bg-black p-4 rounded-xl border border-neutral-800 focus:border-emerald-500 outline-none text-white"/><button onClick={()=>updateList('archives', archives.filter(i=>i.id!==item.id))} className="text-red-500 bg-red-500/10 px-4 py-4 rounded-xl hover:bg-red-500 hover:text-white transition"><Trash2 size={18}/></button></div>
                        ) : (
                          <a href={item.link || "#"} target="_blank" rel="noreferrer" className={`w-full text-white py-4 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-3 shadow-xl ${currentViewMode === 'organisasi' ? 'bg-blue-600 hover:bg-blue-500 hover:shadow-blue-900/50' : 'bg-emerald-600 hover:bg-emerald-500 hover:shadow-emerald-900/50'}`}>Akses Berkas <Download size={16}/></a>
                        )}
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
