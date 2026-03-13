import React, { useState, useEffect } from 'react';
import { 
  Building2, Users, BookOpen, Target, Megaphone, 
  Briefcase, Trophy, HeartHandshake, Menu, X, 
  Edit3, Save, LogIn, LogOut, Lock, Loader2, AlertTriangle,
  Image as ImageIcon, Calendar, Trash2, PlusCircle, PlayCircle, ExternalLink,
  Instagram, Twitter, Youtube, Info, Folder, FileText, Download, Key,
  ShoppingBag, Phone, Pin, UserPlus, CheckCircle, UploadCloud, Send, MessageSquare, MessageCircle, Sparkles, User, ChevronRight, Newspaper, ShoppingCart, Camera, Archive, LayoutGrid, MapPin, Scale, GraduationCap, ClipboardList
} from 'lucide-react';

import { auth, db } from './firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { signInWithEmailAndPassword, onAuthStateChanged, signOut } from 'firebase/auth';

import { uploadFileToCloudinary } from './utils/imageUtils';

import SEOEngine from './components/SEOEngine';
import EditableText from './components/ui/EditableText';
import MabaSection from './components/MabaSection';
import OprecSection from './components/OprecSection';
import ArchiveSection from './components/ArchiveSection';
import MadingAndStore from './components/MadingAndStore';
import MagazineSection from './components/MagazineSection';
import MedpartSection from './components/MedpartSection';

// --- DATA DEFAULT ---
const defaultData = {
  identity: { 
    name: "HMS UNTIRTA", 
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ag/Logo_Untirta.png/1024px-Logo_Untirta.png", 
    archivePassword: "SIPILJAYA", 
    orgPassword: "KOMINFOJAYA",
    googleVerifyId: "nihYa42GKBoxQBRqlO4WMxMFCRNpny9rS7-dO3LoDGQ",
    oprecUrl: "", 
    isOprecOpen: false, 
    mabaUrl: "", 
    waGroupUrl: "", 
    isMabaOpen: false, 
    secretUrl: "",
    medpartWa: "628xxxxxxxxxx"
  },
  sectionTitles: { bphTitle: "Badan Pengurus Harian", bphSubtitle: "Executive Board", bpoTitle: "Badan Pengawas Organisasi", bpoSubtitle: "Supervisory Board", deptTitle: "Struktur Departemen", deptSubtitle: "Internal Org" },
  hero: { tagline: "PERIODE 2024 - 2025", title: "SOLIDARITAS TANPA BATAS", desc: "Situs Resmi Himpunan Mahasiswa Sipil Universitas Sultan Ageng Tirtayasa.", bgImage: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=2089&auto=format&fit=crop" },
  profile: { title: "Tentang Kami", desc: "Himpunan Mahasiswa Sipil adalah wadah perjuangan dan pembelajaran bagi calon insinyur masa depan.", img: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=2070&auto=format&fit=crop" },
  social: { tiktokUrl: "", caption: "Ikuti keseruan kegiatan kami di media sosial!", instagram: "", whatsapp: "", youtube: "" },
  mading: [], merch: [], archives: [], surveys: [], gallery: [], topManagement: [], bpo: [], departments: []
};

// --- APP UTAMA ---
export default function App() {
  const [data, setData] = useState(defaultData);
  const [user, setUser] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: "", pass: "" });
  const [detailModal, setDetailModal] = useState({ open: false, item: null, type: null });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => { 
      setUser(u); 
      fetchData(); 
    });
    return () => unsubscribe();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const docRef = doc(db, "website_content", "main_data");
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        setData({ ...defaultData, ...snap.data() });
      } else { 
        await setDoc(docRef, defaultData); 
        setData(defaultData); 
      }
    } catch (err) { 
      console.error("Fetch Data Error", err); 
      setData(defaultData); 
    } finally { 
      setLoading(false); 
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const docRef = doc(db, "website_content", "main_data");
      await setDoc(docRef, data);
      alert("✅ Sinkronisasi Database Berhasil! Seluruh Data Website Telah Ter-update.");
      setIsEditMode(false);
    } catch (err) { alert("Sinkronisasi Gagal: " + err.message); } finally { setLoading(false); }
  };

  const handleUploadGeneric = async (e, section, field, id = null) => {
    const file = e.target.files[0];
    if (!file) return;
    setIsUploading(true);
    try {
      const url = await uploadFileToCloudinary(file);
      if (id !== null) {
        const list = [...data[section]];
        const idx = list.findIndex(i => i.id === id);
        if (idx !== -1) { list[idx][field] = url; setData({ ...data, [section]: list }); }
      } else {
        if (['identity', 'hero', 'profile'].includes(section)) setData({ ...data, [section]: { ...data[section], [field]: url } });
      }
      alert("✅ Media Berhasil Diunggah!");
    } catch (err) { alert("Cloudinary Error: " + err.message); } finally { setIsUploading(false); }
  };

  const updateList = (section, newList) => setData({ ...data, [section]: newList });
  const updateIdentity = (field, value) => setData({...data, identity: {...data.identity, [field]: value}});
  const updateDataText = (section, field, value) => setData(prev => ({ ...prev, [section]: { ...(prev[section] || {}), [field]: value } }));

  if (loading) return <div className="h-screen flex items-center justify-center bg-black text-emerald-500 font-black animate-pulse uppercase tracking-[0.5em] italic">HMS System Engine Booting...</div>;

  return (
    <div className="min-h-screen bg-white font-sans text-neutral-900 pb-24 flex flex-col overflow-x-hidden">
      <SEOEngine 
        name={data.identity.name} 
        title={data.hero.title} 
        desc={data.hero.desc} 
        logo={data.identity.logoUrl} 
        verifyId={data.identity.googleVerifyId}
      />

      {/* PORTAL ADMIN LOGIN */}
      {showLoginModal && (
        <div className="fixed inset-0 z-[400] flex items-center justify-center p-4 bg-black/98 backdrop-blur-3xl">
          <form className="bg-white p-12 md:p-16 rounded-[4rem] w-full max-w-md shadow-[0_0_100px_rgba(0,0,0,0.5)] relative" onSubmit={async (e)=>{
            e.preventDefault();
            try { await signInWithEmailAndPassword(auth, loginForm.email, loginForm.pass); setShowLoginModal(false); }
            catch(err){ alert("Akses Ditolak! Cek Kredensial Admin."); }
          }}>
            <button type="button" onClick={()=>setShowLoginModal(false)} className="absolute top-10 right-10 text-gray-300 hover:text-red-500 transition"><X size={32}/></button>
            <div className="flex justify-center mb-10 text-emerald-600"><Lock size={80} strokeWidth={1.5}/></div>
            <h3 className="text-3xl font-black mb-10 text-center uppercase tracking-tighter">Portal Otoritas Admin</h3>
            <div className="space-y-5">
               <input required type="email" placeholder="Admin ID" className="w-full border-2 border-neutral-100 p-5 rounded-[1.5rem] outline-none focus:border-emerald-500 bg-neutral-50 font-medium font-bold" onChange={e=>setLoginForm({...loginForm, email:e.target.value})}/>
               <input required type="password" placeholder="Passkey" className="w-full border-2 border-neutral-100 p-5 rounded-[1.5rem] outline-none focus:border-emerald-500 bg-neutral-50 font-medium font-bold" onChange={e=>setLoginForm({...loginForm, pass:e.target.value})}/>
            </div>
            <button className="w-full bg-emerald-600 text-white py-6 rounded-3xl font-black mt-12 uppercase tracking-[0.3em] text-sm hover:bg-emerald-500 transition shadow-2xl active:scale-95 shadow-emerald-900/20">Masuk Dashboard</button>
          </form>
        </div>
      )}

      {/* GLOBAL DETAIL MODAL */}
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

      {/* NAVBAR */}
      <nav className="fixed w-full z-[200] bg-black/95 backdrop-blur-xl text-white py-6 border-b border-emerald-900/30">
        <div className="container mx-auto px-6 md:px-12 flex justify-between items-center">
          <div className="flex items-center gap-6">
            <div className="relative group cursor-pointer" onClick={() => window.scrollTo({top:0, behavior:'smooth'})}>
              <img src={data.identity.logoUrl} className="h-12 w-12 bg-white rounded-full p-1 shadow-2xl shadow-emerald-500/20" alt="Logo Utama Himpunan Mahasiswa Sipil FT Untirta"/>
              {isEditMode && <label className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition"><Camera size={16}/><input type="file" className="hidden" onChange={(e) => handleUploadGeneric(e, 'identity', 'logoUrl')} /></label>}
            </div>
            {isEditMode ? <input value={data.identity.name} onChange={e=>updateIdentity('name', e.target.value)} className="bg-transparent border-b-2 border-emerald-500 font-black uppercase italic text-xl w-40 outline-none"/> : <span className="text-2xl font-black tracking-tighter uppercase italic drop-shadow-xl hidden md:block">{data.identity.name}</span>}
          </div>

          <div className="hidden lg:flex items-center gap-8 font-black text-[10px] uppercase tracking-[0.2em] text-neutral-400 mt-1">
            <a href="#mading" className="hover:text-emerald-400 transition">Mading</a>
            <a href="#magazine" className="hover:text-emerald-400 transition">E-Magazine</a>
            <a href="#archive" className="hover:text-emerald-400 transition">Arsip</a>
            <a href="#medpart" className="hover:text-emerald-400 transition">Medpart</a>
            {data.identity.isMabaOpen && <a href="#maba-portal" className="text-blue-400 hover:text-blue-300 transition flex items-center gap-1">Maba <Sparkles size={12}/></a>}
            {data.identity.isOprecOpen && <a href="#oprec" className="text-yellow-400 hover:text-yellow-300 transition flex items-center gap-1">Oprec <Target size={12}/></a>}
          </div>

          <div className="flex gap-4 md:gap-6">
            {!user ? (
              <button onClick={() => setShowLoginModal(true)} className="bg-emerald-600 text-white px-10 py-3 rounded-full text-xs font-black uppercase tracking-widest hover:bg-emerald-500 transition-all shadow-xl active:scale-95">Admin Portal</button>
            ) : (
              <div className="flex gap-4">
                <button onClick={() => setIsEditMode(!isEditMode)} className="bg-white/10 border-2 border-white/10 px-8 py-3 rounded-full text-[11px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all">{isEditMode ? "Exit Editor" : "Open Editor"}</button>
                <button onClick={() => signOut(auth)} className="text-red-500 bg-red-500/10 p-4 rounded-full hover:bg-red-500 transition shadow-lg"><LogOut size={20}/></button>
              </div>
            )}
          </div>
        </div>
      </nav>

      <main className="flex-grow flex flex-col items-center">
        {/* HERO SECTION */}
        <section className="relative h-screen w-full flex items-center justify-center text-white bg-black overflow-hidden">
          <img src={data.hero.bgImage} className="absolute inset-0 w-full h-full object-cover opacity-60 scale-105" alt="Latar Belakang Universitas Sultan Ageng Tirtayasa Teknik Sipil"/>
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black"></div>
          <div className="relative z-10 text-center px-6 max-w-6xl">
            <div className="inline-block px-10 py-2 border-2 border-emerald-500 text-emerald-400 text-[11px] font-black tracking-[0.6em] mb-14 rounded-full uppercase bg-emerald-900/10 backdrop-blur-lg">
              <EditableText value={data.hero.tagline} onChange={v=>setData({...data, hero:{...data.hero, tagline:v}})} isEditMode={isEditMode} className="text-center bg-transparent outline-none"/>
            </div>
            <h1 className="text-6xl md:text-8xl lg:text-[10rem] font-black block mb-12 leading-none tracking-tighter uppercase italic drop-shadow-[0_10px_50px_rgba(0,0,0,0.5)]">
              <EditableText value={data.hero.title} onChange={v=>setData({...data, hero:{...data.hero, title:v}})} isEditMode={isEditMode} className="w-full text-center bg-transparent outline-none"/>
            </h1>
            <p className="text-2xl md:text-3xl opacity-80 max-w-4xl mx-auto leading-relaxed font-semibold italic mb-16">
               <EditableText value={data.hero.desc} onChange={v=>setData({...data, hero:{...data.hero, desc:v}})} isEditMode={isEditMode} type="textarea" className="bg-transparent text-center outline-none w-full"/>
            </p>
            {isEditMode && <label className="cursor-pointer bg-emerald-600 px-12 py-5 rounded-[2rem] text-sm font-black uppercase tracking-[0.3em] inline-flex items-center gap-4 hover:bg-emerald-500 transition-all shadow-[0_0_50px_rgba(16,185,129,0.4)] active:scale-95"><Camera size={24}/> Update Foto Atmosfer <input type="file" className="hidden" onChange={e => handleUploadGeneric(e, 'hero', 'bgImage')}/></label>}
          </div>
        </section>

        {/* PROFILE SECTION */}
        <section className="py-24 md:py-56 bg-white w-full">
          <div className="container mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-32 items-center">
            <div className="relative group mx-auto w-full max-w-[600px] lg:max-w-none">
               <div className="absolute -inset-6 md:-inset-10 bg-emerald-500/5 rounded-[3rem] md:rounded-[5rem] -z-10 group-hover:bg-emerald-500/15 transition duration-[2000ms]"></div>
               <img src={data.profile.img} className="rounded-[3rem] md:rounded-[5rem] shadow-[0_50px_100px_rgba(0,0,0,0.15)] h-[450px] md:h-[850px] w-full object-cover grayscale-0 group-hover:grayscale transition duration-[2000ms] group-hover:scale-[1.02]" alt="Profil Organisasi Himpunan Mahasiswa Sipil FT Untirta"/>
               {isEditMode && (<label className="absolute inset-0 bg-emerald-950/60 rounded-[3rem] md:rounded-[5rem] flex items-center justify-center cursor-pointer opacity-0 hover:opacity-100 transition duration-700 backdrop-blur-sm"><span className="bg-white text-black px-12 py-5 rounded-[2rem] text-xs font-black uppercase tracking-widest shadow-2xl">Ganti Foto Profil</span><input type="file" className="hidden" onChange={e => handleUploadGeneric(e, 'profile', 'img')} /></label>)}
            </div>
            <div className="text-left">
              <p className="text-emerald-600 font-black text-xs uppercase tracking-[0.5em] mb-6 italic">
                <EditableText value={data.profile.subtitle || "About Our Legacy"} onChange={v=>updateDataText('profile', 'subtitle', v)} isEditMode={isEditMode} />
              </p>
              <h2 className="text-5xl md:text-6xl lg:text-8xl font-black mb-10 md:mb-16 text-neutral-900 border-l-[15px] md:border-l-[25px] border-emerald-600 pl-8 md:pl-16 uppercase tracking-tighter leading-none italic drop-shadow-sm flex w-full">
                <EditableText value={data.profile.title} onChange={v=>updateDataText('profile', 'title', v)} isEditMode={isEditMode} className="w-full" />
              </h2>
              <div className="text-gray-500 text-3xl leading-relaxed font-semibold mb-16 italic opacity-80 w-full flex">
                 <EditableText value={data.profile.desc} onChange={v=>updateDataText('profile', 'desc', v)} isEditMode={isEditMode} type="textarea" className="w-full" />
              </div>
              <div className="flex gap-10">
                 <div className="flex flex-col">
                   <span className="text-5xl font-black text-emerald-600"><EditableText value={data.profile.stat1Value || "20+"} onChange={v=>updateDataText('profile', 'stat1Value', v)} isEditMode={isEditMode} className="w-24 text-center"/></span>
                   <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest mt-2 italic"><EditableText value={data.profile.stat1Label || "Tahun Berdiri"} onChange={v=>updateDataText('profile', 'stat1Label', v)} isEditMode={isEditMode} className="w-32 text-center block"/></span>
                 </div>
                 <div className="flex flex-col">
                   <span className="text-5xl font-black text-emerald-600"><EditableText value={data.profile.stat2Value || "500+"} onChange={v=>updateDataText('profile', 'stat2Value', v)} isEditMode={isEditMode} className="w-24 text-center"/></span>
                   <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest mt-2 italic"><EditableText value={data.profile.stat2Label || "Anggota Aktif"} onChange={v=>updateDataText('profile', 'stat2Label', v)} isEditMode={isEditMode} className="w-32 text-center block"/></span>
                 </div>
              </div>
            </div>
          </div>
        </section>

        {/* BPH SECTION */}
        <section className="py-40 bg-neutral-50">
          <div className="container mx-auto px-6 md:px-12 text-center">
            <div className="max-w-4xl mx-auto mb-32 flex flex-col items-center">
               <p className="text-emerald-600 font-black tracking-[0.6em] text-xs uppercase mb-4 italic text-center w-full">
                 <EditableText value={data.sectionTitles?.bphSubtitle || "Backbone of HMS"} onChange={v=>updateDataText('sectionTitles', 'bphSubtitle', v)} isEditMode={isEditMode} className="text-center w-full" />
               </p>
               <h2 className="text-7xl font-black text-neutral-900 uppercase italic tracking-tighter leading-none text-center w-full flex">
                 <EditableText value={data.sectionTitles?.bphTitle || "Badan Pengurus Harian"} onChange={v=>updateDataText('sectionTitles', 'bphTitle', v)} isEditMode={isEditMode} className="text-center w-full block" />
               </h2>
               {isEditMode && <button onClick={() => updateList('topManagement', [...(data.topManagement||[]), {id: Date.now(), name: "Nama Pejabat", role: "Jabatan Inti", bio: "", img: "https://via.placeholder.com/600"}])} className="mt-14 bg-emerald-600 text-white p-8 rounded-[2.5rem] shadow-2xl hover:bg-emerald-500 transition-all hover:scale-110 active:scale-90 shadow-emerald-900/20"><PlusCircle size={40}/></button>}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-16">
              {(data.topManagement||[]).map((member, idx) => (
                <div key={member.id} className="bg-white rounded-[4rem] overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.08)] border border-neutral-100 group hover:-translate-y-6 transition duration-700 cursor-pointer" onClick={()=>setDetailModal({open:true, item:member, type:'tm'})}>
                  <div className="relative h-[450px] overflow-hidden bg-neutral-200">
                    <img src={member.img} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition duration-[1500ms] scale-110 group-hover:scale-100" alt={member.name}/>
                    {isEditMode && (
                      <div className="absolute inset-0 bg-emerald-950/80 backdrop-blur-md flex flex-col items-center justify-center gap-6 opacity-0 group-hover:opacity-100 transition duration-500 z-30" onClick={e=>e.stopPropagation()}>
                        <label className="cursor-pointer bg-white text-black px-10 py-4 rounded-3xl text-[11px] font-black uppercase tracking-widest hover:bg-emerald-500 hover:text-white transition shadow-2xl">Ganti Foto <input type="file" className="hidden" onChange={(e) => handleUploadGeneric(e, 'topManagement', 'img', member.id)} /></label>
                        <button onClick={() => updateList('topManagement', data.topManagement.filter(m => m.id !== member.id))} className="text-red-500 bg-black/40 px-10 py-4 rounded-3xl text-[11px] font-black uppercase tracking-widest hover:bg-red-600 transition">Hapus Data</button>
                      </div>
                    )}
                  </div>
                  <div className="p-12 text-center">
                    <EditableText value={member.role} onChange={v=>{const l=[...data.topManagement];l[idx].role=v;updateList('topManagement',l)}} isEditMode={isEditMode} className="text-emerald-600 font-black text-[12px] uppercase tracking-[0.4em] mb-4 block italic"/>
                    <EditableText value={member.name} onChange={v=>{const l=[...data.topManagement];l[idx].name=v;updateList('topManagement',l)}} isEditMode={isEditMode} className="text-3xl font-black text-neutral-900 uppercase italic tracking-tighter leading-tight block"/>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* MENU MADING & STORE */}
        <MadingAndStore data={data} updateList={updateList} updateDataText={updateDataText} isEditMode={isEditMode} handleUpload={handleUploadGeneric} setDetailModal={setDetailModal} />

        {/* E-MAGAZINE BOOKCASE */}
        <MagazineSection data={data} updateDataText={updateDataText} isEditMode={isEditMode} />

        {/* ARSIP & PORTALS */}
        <ArchiveSection 
          data={data} 
          archives={data.archives} 
          updateDataText={updateDataText} 
          isEditMode={isEditMode} 
          accessCode={data.identity.archivePassword} 
          orgCode={data.identity.orgPassword}
          updateList={updateList} 
          setIdentityPassword={(val) => setData({...data, identity: {...data.identity, archivePassword: val}})}
          setOrgPassword={(val) => setData({...data, identity: {...data.identity, orgPassword: val}})} 
        />
        <MedpartSection data={data} updateIdentity={updateIdentity} updateDataText={updateDataText} updateList={updateList} isEditMode={isEditMode} />
        <MabaSection data={data} updateIdentity={updateIdentity} updateDataText={updateDataText} isEditMode={isEditMode} />
        <OprecSection data={data} updateIdentity={updateIdentity} updateDataText={updateDataText} isEditMode={isEditMode} />
      </main>

      {/* FLOATING ACTION SAVE */}
      {isEditMode && (
        <div className="fixed bottom-12 right-12 z-[300] flex flex-col items-end gap-6">
           <div className="bg-emerald-600 text-white px-8 py-3 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-2xl animate-pulse">Auto-Sync Database Ready</div>
           <button onClick={handleSave} className="bg-black text-white px-14 py-8 rounded-[3rem] font-black shadow-[0_0_80px_rgba(0,0,0,0.3)] hover:bg-emerald-600 transition-all hover:scale-105 active:scale-90 flex items-center gap-6 uppercase tracking-[0.4em] text-sm border-2 border-emerald-500/20">
             <Save size={32} className="text-emerald-500"/> Synchronize All Core Data
           </button>
        </div>
      )}

      {/* FOOTER */}
      <footer className="bg-black text-white py-24 md:py-48 text-center border-t border-emerald-900/50 mt-auto relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent"></div>
        <div className="container mx-auto px-6">
          <img src={data.identity.logoUrl} className="h-32 w-32 mx-auto mb-8 bg-white rounded-full p-3 grayscale hover:grayscale-0 transition duration-1000 shadow-[0_0_60px_rgba(255,255,255,0.05)]" alt="Footer Logo"/>
          
          <div className="flex justify-center gap-8 mb-16">
            <a href={data.social?.instagram || "#"} target="_blank" rel="noreferrer" className="text-neutral-600 hover:text-emerald-500 transition-colors hover:scale-110"><Instagram size={28}/></a>
            <a href={data.social?.tiktokUrl || "#"} target="_blank" rel="noreferrer" className="text-neutral-600 hover:text-emerald-500 transition-colors hover:scale-110">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"/></svg>
            </a>
            <a href={data.social?.youtube || "#"} target="_blank" rel="noreferrer" className="text-neutral-600 hover:text-emerald-500 transition-colors hover:scale-110"><Youtube size={28}/></a>
            <a href={data.social?.whatsapp || "#"} target="_blank" rel="noreferrer" className="text-neutral-600 hover:text-emerald-500 transition-colors hover:scale-110"><MessageCircle size={28}/></a>
          </div>
          
          {isEditMode ? (
            <div className="flex flex-col items-center gap-8 max-w-md mx-auto">
              <p className="text-[12px] text-emerald-500 uppercase tracking-[0.5em] font-black italic">Settings & Links Editor:</p>
              <div className="w-full space-y-3 text-left">
                {/* Social Settings */}
                <div className="flex items-center bg-neutral-900 rounded-xl px-4 border border-neutral-800">
                  <Instagram size={16} className="text-gray-500 mr-3"/>
                  <input value={data.social?.instagram || ""} onChange={e => setData({...data, social: {...data.social, instagram: e.target.value}})} placeholder="URL Instagram" className="bg-transparent text-white text-[11px] py-3 outline-none flex-1 font-mono" />
                </div>
                <div className="flex items-center bg-neutral-900 rounded-xl px-4 border border-neutral-800">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-500 mr-3"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"/></svg>
                  <input value={data.social?.tiktokUrl || ""} onChange={e => setData({...data, social: {...data.social, tiktokUrl: e.target.value}})} placeholder="URL TikTok" className="bg-transparent text-white text-[11px] py-3 outline-none flex-1 font-mono" />
                </div>
                <div className="flex items-center bg-neutral-900 rounded-xl px-4 border border-neutral-800">
                  <Youtube size={16} className="text-gray-500 mr-3"/>
                  <input value={data.social?.youtube || ""} onChange={e => setData({...data, social: {...data.social, youtube: e.target.value}})} placeholder="URL YouTube" className="bg-transparent text-white text-[11px] py-3 outline-none flex-1 font-mono" />
                </div>
                <div className="flex items-center bg-neutral-900 rounded-xl px-4 border border-neutral-800">
                  <MessageCircle size={16} className="text-gray-500 mr-3"/>
                  <input value={data.social?.whatsapp || ""} onChange={e => setData({...data, social: {...data.social, whatsapp: e.target.value}})} placeholder="URL WhatsApp Channel" className="bg-transparent text-white text-[11px] py-3 outline-none flex-1 font-mono" />
                </div>
                <div className="h-px w-full bg-neutral-800 my-4"></div>
                {/* Gateway & SEO */}
                <div className="flex items-center bg-neutral-900 rounded-xl px-4 border border-neutral-800">
                  <span className="text-[10px] font-black text-gray-500 uppercase mr-3">Google Verify:</span>
                  <input value={data.identity.googleVerifyId || ""} onChange={e => updateIdentity('googleVerifyId', e.target.value)} placeholder="Google Search Console ID" className="bg-transparent text-white text-xs py-3 outline-none flex-1 font-mono" />
                </div>
                <div className="flex items-center bg-neutral-900 rounded-xl px-4 border border-neutral-800">
                  <span className="text-[10px] font-black text-gray-500 uppercase mr-3">Secret Link:</span>
                  <input value={data.identity.secretUrl || ""} onChange={e => updateIdentity('secretUrl', e.target.value)} placeholder="https://external-link.com" className="bg-transparent text-white text-xs py-3 outline-none flex-1 font-mono" />
                </div>
              </div>
              <p className="font-black uppercase tracking-[0.8em] text-[10px] mt-20 text-neutral-800">&copy; {new Date().getFullYear()} {data.identity.name} | SOLIDARITAS TANPA BATAS</p>
            </div>
          ) : (
            <a href={data.identity.secretUrl || "#"} target={data.identity.secretUrl ? "_blank" : "_self"} rel="noreferrer" className={`font-black uppercase tracking-[0.8em] text-[10px] block mt-20 transition-all duration-1000 ${data.identity.secretUrl ? 'hover:text-emerald-500 cursor-pointer hover:tracking-[1em]' : 'text-neutral-800 cursor-default pointer-events-none'}`}>
              &copy; {new Date().getFullYear()} {data.identity.name} | SIPIL JAYA!
            </a>
          )}
        </div>
      </footer>

      {/* SYNC OVERLAY */}
      {isUploading && (
        <div className="fixed inset-0 z-[600] bg-black/98 backdrop-blur-3xl flex flex-col items-center justify-center text-white p-12 text-center">
          <div className="relative mb-20 scale-150">
            <Loader2 className="animate-spin text-emerald-500" size={120} strokeWidth={1} />
            <div className="absolute inset-0 flex items-center justify-center">
              <UploadCloud className="text-white animate-pulse" size={40} />
            </div>
          </div>
          <p className="font-black uppercase tracking-[1em] text-4xl italic mb-6 ml-[1em]">CLOUDSYNC</p>
          <p className="text-emerald-500/60 text-xs font-black uppercase tracking-[0.5em] max-w-xl leading-loose">Optimizing high-resolution assets & anchoring metadata to Firebase persistent storage.</p>
        </div>
      )}
    </div>
  );
}