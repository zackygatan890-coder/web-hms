import React, { useState, Suspense, lazy } from 'react';
import { 
  Building2, Users, BookOpen, Target, Megaphone, 
  Briefcase, Trophy, HeartHandshake, Menu, X, 
  Edit3, Save, LogIn, LogOut, Lock, Loader2, AlertTriangle,
  Image as ImageIcon, Calendar, Trash2, PlusCircle, PlayCircle, ExternalLink,
  Instagram, Twitter, Youtube, Info, Folder, FileText, Download, Key,
  ShoppingBag, Phone, Pin, UserPlus, CheckCircle, UploadCloud, Send, MessageSquare, MessageCircle, Sparkles, User, ChevronRight, Newspaper, ShoppingCart, Camera, Archive, LayoutGrid, MapPin, Scale, GraduationCap, ClipboardList
} from 'lucide-react';

import { auth, db } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';

import { uploadFileToCloudinary } from '../utils/imageUtils';

import EditableText from '../components/ui/EditableText';
const MabaSection = lazy(() => import('../components/MabaSection'));
const OprecSection = lazy(() => import('../components/OprecSection'));
const ArchiveSection = lazy(() => import('../components/ArchiveSection'));
const MadingAndStore = lazy(() => import('../components/MadingAndStore'));
const MagazineSection = lazy(() => import('../components/MagazineSection'));
const MedpartSection = lazy(() => import('../components/MedpartSection'));

export default function AdminDashboard({ data, setData, user }) {
  const [isEditMode, setIsEditMode] = useState(true);
  const [loading, setLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  
  const [loginForm, setLoginForm] = useState({ email: "", pass: "" });
  const [detailModal, setDetailModal] = useState({ open: false, item: null, type: null });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      const docRef = doc(db, "website_content", "main_data");
      await setDoc(docRef, data);
      alert("✅ Sinkronisasi Database Berhasil! Seluruh Data Website Telah Ter-update.");
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

  // Jika belum login, tampilkan portal login
  if (!user) {
    return (
      <div className="min-h-screen bg-neutral-900 flex items-center justify-center p-4">
        <form className="bg-white p-12 md:p-16 rounded-[4rem] w-full max-w-md shadow-[0_0_100px_rgba(30,30,30,0.5)] relative" onSubmit={async (e)=>{
          e.preventDefault();
          try { await signInWithEmailAndPassword(auth, loginForm.email, loginForm.pass); }
          catch(err){ alert("Akses Ditolak! Cek Kredensial Admin."); }
        }}>
          <div className="flex justify-center mb-10 text-emerald-600"><Lock size={80} strokeWidth={1.5}/></div>
          <h3 className="text-3xl font-black mb-10 text-center uppercase tracking-tighter">Portal Otoritas Admin</h3>
          <div className="space-y-5">
              <input required type="email" placeholder="Admin ID" className="w-full border-2 border-neutral-100 p-5 rounded-[1.5rem] outline-none focus:border-emerald-500 bg-neutral-50 font-medium font-bold" onChange={e=>setLoginForm({...loginForm, email:e.target.value})}/>
              <input required type="password" placeholder="Passkey" className="w-full border-2 border-neutral-100 p-5 rounded-[1.5rem] outline-none focus:border-emerald-500 bg-neutral-50 font-medium font-bold" onChange={e=>setLoginForm({...loginForm, pass:e.target.value})}/>
          </div>
          <button className="w-full bg-emerald-600 text-white py-6 rounded-3xl font-black mt-12 uppercase tracking-[0.3em] text-sm hover:bg-emerald-500 transition shadow-2xl active:scale-95 shadow-emerald-900/20">Masuk Dashboard</button>
          <div className="mt-6 text-center">
             <a href="/" className="text-sm font-bold text-gray-400 hover:text-emerald-500 underline transition">Back to Public Web</a>
          </div>
        </form>
      </div>
    );
  }

  // Jika sudah login, tampilkan dashboard (ui yang hampir sama dengan app.jsx edit mode)
  return (
    <div className="min-h-screen bg-gray-50 border-8 border-emerald-500 font-sans text-neutral-900 pb-24 flex flex-col overflow-x-hidden relative">
      <div className="absolute top-0 left-0 bg-emerald-500 text-white px-4 py-1 font-black text-xs uppercase z-[1000] tracking-widest rounded-br-xl shadow-lg">EDIT MODE (ADMIN)</div>
      
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
      <nav className="w-full z-[200] bg-black/95 backdrop-blur-xl text-white py-4 md:py-6 border-b border-emerald-900/30 transition-all shadow-xl sticky top-0">
        <div className="container mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-4">
             <span className="text-xl md:text-2xl font-black tracking-tighter uppercase italic drop-shadow-xl text-emerald-500">HMS Control Panel</span>
          </div>
          <div className="flex gap-4">
            <button onClick={() => window.location.href = '/'} className="bg-white/10 px-8 py-3 rounded-full text-[11px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all">Lihat Web Publik</button>
            <button onClick={() => signOut(auth)} className="text-red-500 bg-red-500/10 p-4 rounded-full hover:bg-red-500 transition shadow-lg hover:text-white"><LogOut size={20}/></button>
          </div>
        </div>
      </nav>

      <main className="flex-grow flex flex-col items-center">
        {/* HERO SECTION */}
        <section className="relative w-full flex items-center justify-center text-white bg-black overflow-hidden py-32 rounded-b-[4rem] mb-12 shadow-2xl">
          <img src={data.hero.bgImage} className="absolute inset-0 w-full h-full object-cover opacity-30" alt="Hero background"/>
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black"></div>
          <div className="relative z-10 text-center px-6 max-w-6xl">
            <div className="inline-block px-10 py-2 border-2 border-emerald-500 text-emerald-400 text-[11px] font-black tracking-[0.6em] mb-14 rounded-full uppercase bg-emerald-900/10 backdrop-blur-lg">
              <EditableText value={data.hero.tagline} onChange={v=>setData({...data, hero:{...data.hero, tagline:v}})} isEditMode={isEditMode} className="text-center bg-transparent outline-none"/>
            </div>
            <h1 className="text-4xl md:text-6xl font-black block mb-8 leading-none tracking-tighter uppercase italic text-center w-full">
              <EditableText value={data.hero.title} onChange={v=>setData({...data, hero:{...data.hero, title:v}})} isEditMode={isEditMode} className="w-full text-center bg-transparent outline-none"/>
            </h1>
            <p className="text-lg md:text-2xl opacity-80 max-w-4xl mx-auto leading-relaxed font-semibold italic mb-12 w-full flex">
               <EditableText value={data.hero.desc} onChange={v=>setData({...data, hero:{...data.hero, desc:v}})} isEditMode={isEditMode} type="textarea" className="bg-transparent text-center outline-none w-full"/>
            </p>
            <label className="cursor-pointer bg-emerald-600 px-12 py-5 rounded-[2rem] text-sm font-black uppercase tracking-[0.3em] inline-flex items-center gap-4 hover:bg-emerald-500 transition-all shadow-[0_0_50px_rgba(16,185,129,0.4)] active:scale-95"><Camera size={24}/> Update Foto Background Hero <input type="file" className="hidden" onChange={e => handleUploadGeneric(e, 'hero', 'bgImage')}/></label>
          </div>
        </section>

        {/* LOGO & NAMA */}
        <section className="py-12 bg-white w-full rounded-[4rem] max-w-6xl mx-auto mb-12 shadow-lg border border-neutral-100 flex flex-col md:flex-row items-center justify-center gap-12 px-8">
            <div className="relative group cursor-pointer w-48 h-48 bg-neutral-100 rounded-full flex-shrink-0 flex items-center justify-center overflow-hidden border-4 border-emerald-500">
              <img src={data.identity.logoUrl} className="h-32 w-32 object-contain" alt="Logo"/>
              <label className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition z-10 text-white font-bold text-xs"><Camera size={24} className="mb-2"/>Update Logo<input type="file" className="hidden" onChange={(e) => handleUploadGeneric(e, 'identity', 'logoUrl')} /></label>
            </div>
            <div className="flex-1 max-w-md w-full">
               <p className="text-xs uppercase font-black tracking-widest text-emerald-500 mb-2">Nama Himpunan / Brand</p>
               <input value={data.identity.name} onChange={e=>updateIdentity('name', e.target.value)} className="w-full bg-neutral-50 border-2 border-neutral-200 p-4 rounded-2xl font-black uppercase italic text-2xl outline-none focus:border-emerald-500"/>
            </div>
        </section>

        {/* PROFILE SECTION */}
        <section className="py-12 bg-white w-full rounded-[4rem] max-w-6xl mx-auto mb-12 shadow-lg border border-neutral-100 px-8 md:px-16 overflow-hidden relative">
          <p className="text-xs font-black uppercase tracking-widest text-emerald-500 bg-emerald-50 inline-block px-4 py-2 rounded-full mb-8">Section: Tentang Kami</p>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div className="relative group w-full">
               <img src={data.profile.img} className="rounded-3xl shadow-xl h-[400px] w-full object-cover" alt="Profile"/>
               <label className="absolute inset-0 bg-emerald-950/60 rounded-3xl flex flex-col items-center justify-center cursor-pointer opacity-0 hover:opacity-100 transition duration-300 backdrop-blur-sm z-10"><span className="bg-white text-black px-8 py-4 rounded-xl text-xs font-black uppercase tracking-widest shadow-2xl flex items-center gap-2"><Camera size={18}/> Ganti Foto Profil</span><input type="file" className="hidden" onChange={e => handleUploadGeneric(e, 'profile', 'img')} /></label>
            </div>
            <div className="text-left w-full space-y-6">
              <div>
                <p className="text-xs uppercase font-bold text-gray-500 mb-1">Subtitle</p>
                <div className="bg-neutral-50 p-2 rounded-xl border-b-2 border-emerald-500">
                  <EditableText value={data.profile.subtitle || "About Our Legacy"} onChange={v=>updateDataText('profile', 'subtitle', v)} isEditMode={isEditMode} className="w-full text-emerald-600 font-black text-xs uppercase tracking-[0.4em] italic"/>
                </div>
              </div>
              <div>
                <p className="text-xs uppercase font-bold text-gray-500 mb-1">Title</p>
                <div className="bg-neutral-50 p-2 rounded-xl border-b-2 border-emerald-500">
                  <EditableText value={data.profile.title} onChange={v=>updateDataText('profile', 'title', v)} isEditMode={isEditMode} className="w-full text-3xl font-black uppercase tracking-tighter leading-none italic text-neutral-900" />
                </div>
              </div>
              <div>
                <p className="text-xs uppercase font-bold text-gray-500 mb-1">Description</p>
                <div className="bg-neutral-50 p-4 rounded-xl border-b-2 border-emerald-500">
                   <EditableText value={data.profile.desc} onChange={v=>updateDataText('profile', 'desc', v)} isEditMode={isEditMode} type="textarea" className="w-full text-gray-600 text-lg leading-relaxed font-semibold italic" />
                </div>
              </div>
              <div className="flex gap-10">
                 <div className="flex flex-col bg-neutral-50 p-4 rounded-xl border border-neutral-100 relative">
                   <span className="text-3xl font-black text-emerald-600 "><EditableText value={data.profile.stat1Value || "20+"} onChange={v=>updateDataText('profile', 'stat1Value', v)} isEditMode={isEditMode} className="w-24"/></span>
                   <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest mt-2 italic flex"><EditableText value={data.profile.stat1Label || "Tahun Berdiri"} onChange={v=>updateDataText('profile', 'stat1Label', v)} isEditMode={isEditMode} className="w-32"/></span>
                 </div>
                 <div className="flex flex-col bg-neutral-50 p-4 rounded-xl border border-neutral-100 relative">
                   <span className="text-3xl font-black text-emerald-600"><EditableText value={data.profile.stat2Value || "500+"} onChange={v=>updateDataText('profile', 'stat2Value', v)} isEditMode={isEditMode} className="w-24"/></span>
                   <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest mt-2 italic flex"><EditableText value={data.profile.stat2Label || "Anggota Aktif"} onChange={v=>updateDataText('profile', 'stat2Label', v)} isEditMode={isEditMode} className="w-32"/></span>
                 </div>
              </div>
            </div>
          </div>
        </section>

        {/* BPH SECTION */}
        <section className="py-12 bg-white w-full rounded-[4rem] max-w-6xl mx-auto mb-12 shadow-lg border border-neutral-100 px-8 md:px-16 overflow-hidden">
           <p className="text-xs font-black uppercase tracking-widest text-emerald-500 bg-emerald-50 inline-block px-4 py-2 rounded-full mb-8">Section: Badan Pengurus Harian</p>
           
           <div className="max-w-2xl mx-auto mb-16 flex flex-col items-center bg-neutral-50 p-8 rounded-3xl border border-neutral-100">
               <p className="text-emerald-600 font-black tracking-[0.4em] text-xs uppercase mb-4 italic text-center w-full">
                 <EditableText value={data.sectionTitles?.bphSubtitle || "Backbone of HMS"} onChange={v=>updateDataText('sectionTitles', 'bphSubtitle', v)} isEditMode={isEditMode} className="text-center w-full bg-white px-2 rounded border border-neutral-200" />
               </p>
               <h2 className="text-3xl font-black text-neutral-900 uppercase italic tracking-tighter leading-none text-center w-full flex">
                 <EditableText value={data.sectionTitles?.bphTitle || "Badan Pengurus Harian"} onChange={v=>updateDataText('sectionTitles', 'bphTitle', v)} isEditMode={isEditMode} className="text-center w-full flex block bg-white px-2 rounded border border-neutral-200" />
               </h2>
           </div>

           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {(data.topManagement||[]).map((member, idx) => (
                <div key={member.id} className="bg-neutral-50 rounded-3xl overflow-hidden border border-neutral-200 group relative">
                  <div className="relative h-64 bg-neutral-200">
                    <img src={member.img} className="w-full h-full object-cover" alt={member.name}/>
                    <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition z-10">
                        <label className="cursor-pointer bg-white text-black px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl flex items-center gap-2"><Camera size={14}/> Ganti Foto <input type="file" className="hidden" onChange={(e) => handleUploadGeneric(e, 'topManagement', 'img', member.id)} /></label>
                        <button onClick={() => updateList('topManagement', data.topManagement.filter(m => m.id !== member.id))} className="text-red-500 bg-red-100 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2"><Trash2 size={14}/> Hapus Data</button>
                    </div>
                  </div>
                  <div className="p-6">
                    <p className="text-xs uppercase font-bold text-gray-500 mb-1">Jabatan</p>
                    <EditableText value={member.role} onChange={v=>{const l=[...data.topManagement];l[idx].role=v;updateList('topManagement',l)}} isEditMode={isEditMode} className="text-emerald-600 font-black text-[10px] uppercase tracking-[0.2em] mb-4 block italic w-full bg-white p-2 rounded border border-neutral-200"/>
                    <p className="text-xs uppercase font-bold text-gray-500 mb-1">Nama Pejabat</p>
                    <EditableText value={member.name} onChange={v=>{const l=[...data.topManagement];l[idx].name=v;updateList('topManagement',l)}} isEditMode={isEditMode} className="text-xl font-black text-neutral-900 uppercase italic tracking-tighter leading-tight block w-full bg-white p-2 rounded border border-neutral-200"/>
                  </div>
                </div>
              ))}
              
              <div className="bg-neutral-50 rounded-3xl overflow-hidden border-2 border-dashed border-emerald-300 flex items-center justify-center min-h-[300px]">
                 <button onClick={() => updateList('topManagement', [...(data.topManagement||[]), {id: Date.now(), name: "Nama Pejabat", role: "Jabatan Inti", bio: "", img: "https://via.placeholder.com/600"}])} className="text-emerald-600 flex flex-col items-center justify-center hover:scale-110 active:scale-95 transition">
                    <PlusCircle size={48} className="mb-4"/>
                    <span className="font-black uppercase tracking-widest text-xs">Tambah Pejabat Baru</span>
                 </button>
              </div>
           </div>
        </section>

        <Suspense fallback={<div className="py-32 flex justify-center text-emerald-500 animate-pulse font-black tracking-widest uppercase text-sm">Memuat Komponen Dashboard Admin...</div>}>
          <div className="w-full max-w-[85rem] mx-auto space-y-12">
            <MadingAndStore data={data} updateList={updateList} updateDataText={updateDataText} isEditMode={isEditMode} handleUpload={handleUploadGeneric} setDetailModal={setDetailModal} />
            <MagazineSection data={data} updateDataText={updateDataText} isEditMode={isEditMode} />
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
            <MedpartSection data={data} />
            <MabaSection data={data} forcePreview={true} />
            <OprecSection data={data} forcePreview={true} />
          </div>
        </Suspense>

        {/* PORTAL MABA & OPREC CONFIGURATION */}
        <section className="mt-16 w-full max-w-4xl mx-auto bg-neutral-900 py-16 px-12 rounded-[4rem] text-white shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 w-full h-1 bg-gradient-to-r from-blue-500 to-emerald-500 left-0"></div>
            <p className="text-[12px] text-blue-400 uppercase tracking-[0.5em] font-black italic mb-8 block text-center">Form Integrations (Maba & Oprec):</p>
            <div className="space-y-8">
              {/* Maba Mgt */}
              <div className="bg-black/50 p-6 rounded-3xl border border-neutral-800">
                <h4 className="font-black uppercase tracking-widest text-emerald-500 mb-4 flex items-center gap-2"><Sparkles size={18}/> Maba Form Config</h4>
                <div className="space-y-4">
                  <label className="flex items-center gap-3 cursor-pointer select-none">
                    <input type="checkbox" className="w-5 h-5 accent-emerald-500" checked={data.identity.isMabaOpen} onChange={e=>updateIdentity('isMabaOpen', e.target.checked)}/>
                    <span className="text-sm font-bold uppercase tracking-widest">Buka Portal Maba</span>
                  </label>
                  <input value={data.identity.mabaUrl || ""} onChange={e=>updateIdentity('mabaUrl', e.target.value)} className="w-full bg-neutral-900 border border-neutral-800 p-4 rounded-xl text-xs text-white outline-none focus:border-blue-500 font-mono" placeholder="Backend Script URL (Maba)..."/>
                  <input value={data.identity.mabaCpWa || ""} onChange={e=>updateIdentity('mabaCpWa', e.target.value)} className="w-full bg-neutral-900 border border-neutral-800 p-4 rounded-xl text-xs text-white outline-none focus:border-blue-500 font-mono" placeholder="No. WA CP Maba (Format: 628...)"/>
                </div>
              </div>

              {/* Oprec Mgt */}
              <div className="bg-black/50 p-6 rounded-3xl border border-neutral-800">
                <h4 className="font-black uppercase tracking-widest text-emerald-500 mb-4 flex items-center gap-2"><Target size={18}/> Oprec Form Config</h4>
                <div className="space-y-4">
                  <label className="flex items-center gap-3 cursor-pointer select-none">
                    <input type="checkbox" className="w-5 h-5 accent-emerald-500" checked={data.identity.isOprecOpen} onChange={e=>updateIdentity('isOprecOpen', e.target.checked)}/>
                    <span className="text-sm font-bold uppercase tracking-widest">Buka Open Recruitment</span>
                  </label>
                  <input value={data.identity.oprecUrl || ""} onChange={e=>updateIdentity('oprecUrl', e.target.value)} className="w-full bg-neutral-900 border border-neutral-800 p-4 rounded-xl text-xs text-white outline-none focus:border-blue-500 font-mono" placeholder="Backend Script URL (Oprec)..."/>
                  <input value={data.identity.oprecFormUrl || ""} onChange={e=>updateIdentity('oprecFormUrl', e.target.value)} className="w-full bg-neutral-900 border border-neutral-800 p-4 rounded-xl text-xs text-white outline-none focus:border-emerald-500 font-mono" placeholder="URL Berkas / Google Drive (Format PDF Oprec)..."/>
                </div>
              </div>
            </div>
        </section>
        
        {/* FOOTER SETTINGS */}
        <section className="mt-16 w-full max-w-4xl mx-auto mb-32 bg-black py-16 px-12 rounded-[4rem] text-white shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-yellow-500 to-blue-500 left-0"></div>
            <p className="text-[12px] text-emerald-500 uppercase tracking-[0.5em] font-black italic mb-8 block text-center">Settings & Links Khusus Admin (Footer Web Publik):</p>
            <div className="space-y-4">
              <div className="flex items-center bg-neutral-900 rounded-2xl px-6 border border-neutral-800">
                  <Instagram size={20} className="text-gray-500 mr-4"/>
                  <input value={data.social?.instagram || ""} onChange={e => setData({...data, social: {...data.social, instagram: e.target.value}})} placeholder="URL Instagram" className="bg-transparent text-white py-4 outline-none flex-1 font-mono text-sm" />
              </div>
              <div className="flex items-center bg-neutral-900 rounded-2xl px-6 border border-neutral-800">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-500 mr-4"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"/></svg>
                  <input value={data.social?.tiktokUrl || ""} onChange={e => setData({...data, social: {...data.social, tiktokUrl: e.target.value}})} placeholder="URL TikTok" className="bg-transparent text-white py-4 outline-none flex-1 font-mono text-sm" />
              </div>
              <div className="flex items-center bg-neutral-900 rounded-2xl px-6 border border-neutral-800">
                  <Youtube size={20} className="text-gray-500 mr-4"/>
                  <input value={data.social?.youtube || ""} onChange={e => setData({...data, social: {...data.social, youtube: e.target.value}})} placeholder="URL YouTube" className="bg-transparent text-white py-4 outline-none flex-1 font-mono text-sm" />
              </div>
              <div className="flex items-center bg-neutral-900 rounded-2xl px-6 border border-neutral-800">
                  <MessageCircle size={20} className="text-gray-500 mr-4"/>
                  <input value={data.social?.whatsapp || ""} onChange={e => setData({...data, social: {...data.social, whatsapp: e.target.value}})} placeholder="URL WhatsApp Channel" className="bg-transparent text-white py-4 outline-none flex-1 font-mono text-sm" />
              </div>
              <div className="h-px w-full bg-neutral-800 my-8"></div>
              <div className="flex items-center bg-neutral-900 rounded-2xl px-6 border border-neutral-800">
                  <span className="text-[10px] font-black text-gray-500 uppercase mr-4 w-28 line-clamp-2">Google Verify ID:</span>
                  <input value={data.identity.googleVerifyId || ""} onChange={e => updateIdentity('googleVerifyId', e.target.value)} placeholder="Google Search Console ID" className="bg-transparent text-white py-4 outline-none flex-1 font-mono text-sm" />
              </div>
              <div className="flex items-center bg-neutral-900 rounded-2xl px-6 border border-neutral-800">
                  <span className="text-[10px] font-black text-gray-500 uppercase mr-4 w-28 line-clamp-2">Secret Link:</span>
                  <input value={data.identity.secretUrl || ""} onChange={e => updateIdentity('secretUrl', e.target.value)} placeholder="https://external-link.com" className="bg-transparent text-emerald-400 py-4 outline-none flex-1 font-mono text-sm font-bold" />
              </div>
            </div>
        </section>

      </main>

      {/* FLOATING ACTION SAVE */}
      <div className="fixed bottom-12 right-12 z-[300] flex flex-col items-end gap-6 pointer-events-none">
          <div className="bg-emerald-600 text-white px-8 py-3 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-2xl animate-pulse pointer-events-auto">Admin Controls Ready</div>
          <button onClick={handleSave} className="bg-black text-white px-14 py-8 rounded-[3rem] font-black shadow-[0_20px_80px_rgba(16,185,129,0.5)] hover:bg-emerald-600 transition-all hover:scale-105 active:scale-95 flex items-center gap-6 uppercase tracking-[0.4em] text-sm border-2 border-emerald-500 pointer-events-auto cursor-pointer">
            <Save size={32} className="text-emerald-500"/> Publish Perubahan ke Web
          </button>
      </div>

      {/* SYNC OVERLAY */}
      {isUploading || loading ? (
        <div className="fixed inset-0 z-[600] bg-black/98 backdrop-blur-3xl flex flex-col items-center justify-center text-white p-12 text-center">
          <div className="relative mb-20 scale-150">
            <Loader2 className="animate-spin text-emerald-500" size={120} strokeWidth={1} />
            <div className="absolute inset-0 flex items-center justify-center">
              {isUploading ? <UploadCloud className="text-white animate-pulse" size={40} /> : <Save className="text-white" size={40} />}
            </div>
          </div>
          <p className="font-black uppercase tracking-[1em] text-4xl italic mb-6 ml-[1em]">SYSTEM SYNC</p>
          <p className="text-emerald-500/60 text-xs font-black uppercase tracking-[0.5em] max-w-xl leading-loose">Menyinkronkan data dengan Firebase Persistent Storage. Jangan tutup halaman ini.</p>
        </div>
      ) : null}
    </div>
  );
}
