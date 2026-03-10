import React, { useState, useEffect, useRef } from 'react';
import { 
  Building2, Users, BookOpen, Target, Megaphone, 
  Briefcase, Trophy, HeartHandshake, Menu, X, 
  Edit3, Save, LogIn, LogOut, Lock, Loader2, AlertTriangle,
  Image as ImageIcon, Calendar, Trash2, PlusCircle, PlayCircle, ExternalLink,
  Instagram, Twitter, Youtube, Info, Folder, FileText, Download, Key,
  ShoppingBag, Phone, Pin, UserPlus, CheckCircle, UploadCloud, Send, MessageSquare, Sparkles, User, ChevronRight, Newspaper, ShoppingCart, Camera, Archive, LayoutGrid, MapPin, Scale, GraduationCap, ClipboardList
} from 'lucide-react';

// --- 1. KONFIGURASI FIREBASE ---
const firebaseConfig = {
  apiKey: "AIzaSyARme9xrcY3hTilVDrFF9Mw0nijO7UU7ro",
  authDomain: "oprec-613ec.firebaseapp.com",
  databaseURL: "https://oprec-613ec-default-rtdb.firebaseio.com",
  projectId: "oprec-613ec",
  storageBucket: "oprec-613ec.firebasestorage.app",
  messagingSenderId: "539472474855",
  appId: "1:539472474855:web:ceb133adcd9a25341ee842",
  measurementId: "G-MQD7TL9X5S"
};

// --- 2. KONFIGURASI CLOUDINARY ---
const CLOUDINARY_CLOUD_NAME = "dwqx4adqo"; 
const CLOUDINARY_UPLOAD_PRESET = "hms_preset"; 

// --- 3. KOMPONEN SEO & VERIFIKASI GOOGLE (FIXED) ---
const SEOEngine = ({ name, title, desc, logo }) => {
  useEffect(() => {
    // Suntikan Google Site Verification (Metode Meta Tag)
    let metaVerify = document.querySelector("meta[name='google-site-verification']");
    if (!metaVerify) {
      metaVerify = document.createElement('meta');
      metaVerify.name = "google-site-verification";
      document.head.appendChild(metaVerify);
    }
    // Menggunakan ID dari google585b994216b0189c.html
    metaVerify.content = "585b994216b0189c";

    document.title = `${name} | ${title || 'Official Website'}`;
    
    const updateMeta = (n, c, isP = false) => {
      let el = document.querySelector(isP ? `meta[property='${n}']` : `meta[name='${n}']`);
      if (!el) {
        el = document.createElement('meta');
        if (isP) el.setAttribute('property', n);
        else el.setAttribute('name', n);
        document.head.appendChild(el);
      }
      el.setAttribute('content', c || "");
    };

    updateMeta('description', desc || "Website Resmi Himpunan Mahasiswa Sipil UNTIRTA.");
    updateMeta('og:title', name, true);
    updateMeta('og:description', desc, true);
    updateMeta('og:image', logo, true);
    updateMeta('og:type', 'website', true);

    let link = document.querySelector("link[rel~='icon']");
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.head.appendChild(link);
    }
    link.href = logo || "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ag/Logo_Untirta.png/1024px-Logo_Untirta.png";
  }, [name, title, desc, logo]);

  return null;
};

// --- FUNGSI KOMPRESI LOKAL ---
const compressImage = (file, maxWidth = 1000) => {
  return new Promise((resolve) => {
    if (!file.type.startsWith('image/')) { resolve(file); return; }
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const scaleFactor = maxWidth / img.width;
        canvas.width = Math.min(img.width, maxWidth);
        canvas.height = img.height * (canvas.width / img.width);
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        canvas.toBlob((blob) => {
          resolve(new File([blob], file.name.replace(/\.[^/.]+$/, "") + ".webp", { type: 'image/webp' }));
        }, 'image/webp', 0.8);
      };
    };
  });
};

const uploadFileToCloudinary = async (file) => {
  if (!file) return "-";
  const compressedFile = await compressImage(file);
  const formData = new FormData();
  formData.append('file', compressedFile);
  formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
  const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/auto/upload`, {
    method: 'POST', body: formData
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.error?.message || "Gagal upload.");
  return result.secure_url;
};

// --- DATA DEFAULT ---
const defaultData = {
  identity: { name: "HMS UNTIRTA", logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ag/Logo_Untirta.png/1024px-Logo_Untirta.png", archivePassword: "SIPILJAYA", oprecUrl: "", isOprecOpen: false, mabaUrl: "", waGroupUrl: "", isMabaOpen: false, secretUrl: "" },
  sectionTitles: { bphTitle: "Badan Pengurus Harian", bphSubtitle: "Executive Board", bpoTitle: "Badan Pengawas Organisasi", bpoSubtitle: "Supervisory Board", deptTitle: "Struktur Departemen", deptSubtitle: "Internal Org" },
  hero: { tagline: "PERIODE 2024 - 2025", title: "SOLIDARITAS TANPA BATAS", desc: "Situs Resmi Himpunan Mahasiswa Sipil Universitas Sultan Ageng Tirtayasa.", bgImage: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=2089&auto=format&fit=crop" },
  profile: { title: "Tentang Kami", desc: "Himpunan Mahasiswa Sipil adalah wadah perjuangan dan pembelajaran bagi mahasiswa Teknik Sipil.", img: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=2070&auto=format&fit=crop" },
  social: { tiktokUrl: "", caption: "Ikuti keseruan kegiatan kami!", instagram: "", twitter: "", youtube: "" },
  mading: [], merch: [], archives: [], surveys: [], gallery: [], topManagement: [], bpo: [], departments: []
};

// --- KOMPONEN PEMBANTU ---
const EditableText = ({ value, onChange, isEditMode, className, type = "text", placeholder = "Edit..." }) => {
  if (isEditMode) {
    if (type === "textarea") return <textarea onClick={e => e.stopPropagation()} value={value || ""} onChange={(e) => onChange(e.target.value)} className={`w-full bg-black/50 border border-emerald-500 rounded p-2 text-white ${className}`} rows={4}/>;
    return <input onClick={e => e.stopPropagation()} type="text" value={value || ""} onChange={(e) => onChange(e.target.value)} className={`w-full bg-black/50 border-b border-emerald-500 text-white px-1 ${className}`} placeholder={placeholder}/>;
  }
  return <span className={className}>{value}</span>;
};

const FileInput = ({ label, onChange, required, accept }) => (
  <div className="mb-3">
    <label className="block text-xs font-bold text-gray-500 mb-1 flex items-center gap-1"><FileText size={12} className="text-emerald-600"/> {label} {required && <span className="text-red-500">*</span>}</label>
    <input type="file" onChange={onChange} required={required} accept={accept} className="block w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 cursor-pointer border border-gray-200 rounded-lg"/>
  </div>
);

// --- KOMPONEN MABA SECTION ---
const MabaSection = ({ data, updateIdentity, isEditMode }) => {
  const [formData, setFormData] = useState({ nama: "", nim: "", wa: "", sekolah: "", alamat: "" });
  const [fotoFile, setFotoFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!data.identity.mabaUrl) { alert("Admin belum mengatur URL Database Maba."); return; }
    setIsSubmitting(true);
    try {
      const linkFoto = await uploadFileToCloudinary(fotoFile);
      const payload = { ...formData, link_foto: linkFoto };
      await fetch(data.identity.mabaUrl, { method: "POST", mode: "no-cors", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      setSubmitStatus("success"); setFormData({ nama: "", nim: "", wa: "", sekolah: "", alamat: "" }); setFotoFile(null);
    } catch (err) { alert("Error: " + err.message); } finally { setIsSubmitting(false); }
  };

  if (!data.identity.isMabaOpen && !isEditMode) return null;

  return (
    <section id="maba-portal" className="py-20 bg-neutral-900 text-white border-t border-neutral-800">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-12 items-center">
          <div className="lg:w-1/2 text-center lg:text-left">
            <span className="inline-block bg-yellow-500 text-black font-black px-4 py-1 text-[10px] rounded mb-6 animate-pulse tracking-widest uppercase">Pusat Data Mahasiswa Baru</span>
            <h2 className="text-4xl md:text-5xl font-black mb-6 leading-tight uppercase italic tracking-tighter">Portal Mahasiswa Baru</h2>
            <p className="text-gray-400 text-sm mb-10 leading-relaxed max-w-md">Pendataan resmi mahasiswa baru angkatan 2025. Seluruh data dijamin keamanannya oleh Himpunan.</p>
            {isEditMode && (
              <div className="bg-white/10 p-6 rounded-2xl border border-white/20 backdrop-blur-md">
                <p className="text-[10px] font-black text-yellow-400 uppercase tracking-widest mb-4">Config Maba Portal:</p>
                <div className="space-y-4">
                  <div><p className="text-[10px] text-gray-500 font-bold mb-1 uppercase">URL Google Script (POST):</p><input value={data.identity.mabaUrl || ""} onChange={e=>updateIdentity('mabaUrl', e.target.value)} className="w-full p-2 text-xs bg-black/50 border border-neutral-700 rounded text-white" placeholder="https://script.google.com/..."/></div>
                  <label className="flex items-center gap-3 cursor-pointer"><input type="checkbox" checked={data.identity.isMabaOpen} onChange={e=>updateIdentity('isMabaOpen', e.target.checked)}/><span className="text-sm font-bold uppercase">Aktifkan Formulir</span></label>
                </div>
              </div>
            )}
          </div>
          <div className="lg:w-1/2 w-full">
            <div className="bg-white text-neutral-900 p-8 rounded-[2.5rem] shadow-2xl border-t-[10px] border-yellow-500">
               {submitStatus === 'success' ? (
                 <div className="text-center py-10"><CheckCircle size={64} className="text-green-500 mx-auto mb-4"/><h3 className="text-2xl font-bold">Data Disimpan!</h3><button onClick={() => setSubmitStatus(null)} className="mt-4 text-blue-600 font-bold underline text-sm">Input data lain</button></div>
               ) : (
                 <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1"><label className="text-[10px] font-black uppercase text-gray-400">Nama Lengkap</label><input required className="w-full border-b-2 p-2 outline-none focus:border-yellow-500 bg-neutral-50 font-bold" value={formData.nama} onChange={e=>setFormData({...formData, nama:e.target.value})}/></div>
                      <div className="space-y-1"><label className="text-[10px] font-black uppercase text-gray-400">NIM</label><input required className="w-full border-b-2 p-2 outline-none focus:border-yellow-500 bg-neutral-50 font-bold" value={formData.nim} onChange={e=>setFormData({...formData, nim:e.target.value})}/></div>
                    </div>
                    <div className="space-y-1"><label className="text-[10px] font-black uppercase text-gray-400">No. WhatsApp</label><input required type="number" className="w-full border-b-2 p-2 outline-none focus:border-yellow-500 bg-neutral-50 font-bold" value={formData.wa} onChange={e=>setFormData({...formData, wa:e.target.value})}/></div>
                    <div className="space-y-1"><FileInput label="Pas Foto Formal" onChange={e => setFotoFile(e.target.files[0])} required accept="image/*" /></div>
                    <button disabled={isSubmitting} className="w-full bg-neutral-950 text-white font-black py-4 rounded-2xl flex justify-center items-center gap-2 uppercase tracking-widest mt-4 hover:bg-black transition shadow-xl disabled:bg-gray-400">
                      {isSubmitting ? <Loader2 className="animate-spin" size={20}/> : <Send size={20}/>} KIRIM BIODATA
                    </button>
                 </form>
               )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// --- KOMPONEN OPREC SECTION ---
const OprecSection = ({ data, updateIdentity, isEditMode }) => {
  const [formData, setFormData] = useState({ nama: "", nim: "", angkatan: "", pilihan1: "", alasan1: "", pilihan2: "", alasan2: "" });
  const [files, setFiles] = useState({ formOprec: null, khs: null, krs: null, transkrip: null });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const departmentsList = ["BUMH", "Dept Internal", "Dept Eksternal", "Dept Kaderisasi", "Dept Kesenian & Kerohanian", "Dept Kominfo", "Dept Peristek"];

  const handleFileChange = (e, key) => { if (e.target.files[0]) setFiles(prev => ({ ...prev, [key]: e.target.files[0] })); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!data.identity.oprecUrl) { alert("Backend Oprec belum disetel."); return; }
    setIsSubmitting(true);
    try {
      const linkForm = await uploadFileToCloudinary(files.formOprec);
      const linkKHS = await uploadFileToCloudinary(files.khs);
      const linkKRS = await uploadFileToCloudinary(files.krs);
      const linkTranskrip = await uploadFileToCloudinary(files.transkrip);
      const payload = { ...formData, link_form: linkForm, link_khs: linkKHS, link_krs: linkKRS, link_transkrip: linkTranskrip };
      await fetch(data.identity.oprecUrl, { method: "POST", mode: "no-cors", body: JSON.stringify(payload) });
      setSubmitStatus("success");
    } catch (err) { alert(err.message); } finally { setIsSubmitting(false); }
  };

  if (!data.identity.isOprecOpen && !isEditMode) return null;

  return (
    <section id="oprec" className="py-24 bg-emerald-950 text-white border-t border-emerald-900">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto bg-white text-neutral-900 p-12 rounded-[3.5rem] shadow-2xl relative">
          <div className="absolute top-0 right-10 -translate-y-1/2 bg-emerald-600 text-white px-6 py-2 rounded-full font-black text-xs uppercase tracking-widest italic">Open Recruitment</div>
          <h2 className="text-4xl md:text-5xl font-black mb-12 text-center text-emerald-950 uppercase italic tracking-tighter">Formulir Rekrutmen</h2>
          {isEditMode && (<div className="mb-10 p-6 bg-emerald-50 rounded-2xl border-2 border-dashed border-emerald-300"><p className="text-[10px] font-black uppercase text-emerald-800 mb-4">Oprec Configuration:</p><input value={data.identity.oprecUrl||""} onChange={e=>updateIdentity('oprecUrl', e.target.value)} className="w-full p-2 text-xs border rounded-lg bg-white" placeholder="https://script.google.com/... "/><label className="flex items-center gap-3 cursor-pointer mt-2"><input type="checkbox" checked={data.identity.isOprecOpen} onChange={e=>updateIdentity('isOprecOpen', e.target.checked)}/><span className="text-sm font-bold uppercase">Buka Pendaftaran Anggota Baru</span></label></div>)}
          {submitStatus === 'success' ? (
            <div className="text-center py-16"><CheckCircle size={80} className="text-emerald-500 mx-auto mb-6"/><h3 className="text-3xl font-black uppercase italic text-emerald-900">Pendaftaran Berhasil!</h3></div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-1"><label className="text-[10px] font-black uppercase text-gray-400">Nama Lengkap</label><input required className="w-full border-b-2 p-2 outline-none focus:border-emerald-600 bg-gray-50/50 font-bold" value={formData.nama} onChange={e=>setFormData({...formData, nama:e.target.value})}/></div>
                <div className="space-y-1"><label className="text-[10px] font-black uppercase text-gray-400">Pilihan Departemen</label><select required className="w-full border-b-2 p-2 outline-none bg-gray-50/50 font-bold" value={formData.pilihan1} onChange={e=>setFormData({...formData, pilihan1:e.target.value})}><option value="">Pilih...</option>{departmentsList.map(d=><option key={d} value={d}>{d}</option>)}</select></div>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4"><FileInput label="KHS PDF" onChange={e=>handleFileChange(e,'khs')} required accept=".pdf"/><FileInput label="KRS PDF" onChange={e=>handleFileChange(e,'krs')} required accept=".pdf"/><FileInput label="Transkrip" onChange={e=>handleFileChange(e,'transkrip')} required accept=".pdf"/><FileInput label="Form Oprec" onChange={e=>handleFileChange(e,'formOprec')} required accept=".pdf"/></div>
              <button disabled={isSubmitting} className="w-full bg-emerald-600 text-white font-black py-6 rounded-2xl flex justify-center items-center gap-4 uppercase tracking-widest text-lg hover:bg-emerald-700 transition-all shadow-xl active:scale-95 disabled:bg-gray-300">
                {isSubmitting ? <Loader2 className="animate-spin" size={32}/> : <CheckCircle size={32}/>} SUBMIT PENDAFTARAN
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

// --- KOMPONEN ARSIP DIGITAL ---
const ArchiveSection = ({ archives, isEditMode, accessCode, updateList, setIdentityPassword }) => {
  const [inputCode, setInputCode] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const handleUnlock = (e) => { e.preventDefault(); if (inputCode === accessCode || isEditMode) setUnlocked(true); else alert("Kode akses salah!"); };
  const isCurrentlyUnlocked = unlocked || isEditMode;

  return (
    <section className="py-32 bg-neutral-950 text-white border-t border-neutral-900">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-5xl font-black uppercase mb-16 italic tracking-tighter text-white/90">Arsip Digital HMS</h2>
        {!isCurrentlyUnlocked ? (
          <div className="max-w-lg mx-auto bg-neutral-900 p-12 rounded-[3rem] border border-neutral-800 shadow-2xl relative overflow-hidden">
            <Lock size={72} className="mx-auto text-emerald-500 mb-8 opacity-60 animate-pulse"/>
            <h3 className="text-2xl font-black mb-4 uppercase italic">Password Protected</h3>
            <p className="text-neutral-500 mb-10 text-sm leading-relaxed font-medium">Database resmi modul, tugas, dan bank soal Teknik Sipil Untirta. Masukkan kode akses angkatan Anda.</p>
            <form onSubmit={handleUnlock} className="flex flex-col gap-4 relative z-10">
              <input type="text" placeholder="ACCESS CODE" className="bg-black border border-neutral-800 rounded-2xl px-6 py-5 text-center font-black tracking-[0.5em] uppercase outline-none focus:border-emerald-500 text-xl transition-all" value={inputCode} onChange={e => setInputCode(e.target.value.toUpperCase())}/>
              <button type="submit" className="bg-emerald-600 hover:bg-emerald-500 text-white py-5 rounded-2xl font-black uppercase tracking-widest transition-all shadow-lg flex justify-center items-center gap-3 active:scale-95">Open Database <ChevronRight size={24}/></button>
            </form>
            {isEditMode && <div className="mt-8 p-3 bg-black/50 rounded-xl border border-emerald-500/30 font-mono text-[10px] text-emerald-400 uppercase tracking-widest italic">ADMIN: Current Password is "{accessCode}"</div>}
          </div>
        ) : (
          <div className="max-w-6xl mx-auto">
             {isEditMode && (
               <div className="mb-12 p-8 bg-black/50 rounded-[2.5rem] border border-emerald-500/20 flex flex-col md:flex-row items-center justify-between gap-8">
                 <div className="text-left">
                   <p className="text-xs font-black text-emerald-500 uppercase tracking-[0.3em] mb-1">Database Management</p>
                   <h4 className="text-xl font-bold">Pusat Kelola Berkas</h4>
                 </div>
                 <div className="flex gap-4">
                   <button onClick={() => updateList('archives', [...(archives||[]), {id: Date.now(), title: "Modul Baru", category: "General", link: ""}])} className="bg-emerald-600 px-8 py-3 rounded-full font-black text-xs uppercase hover:bg-emerald-500 transition-all shadow-xl flex items-center gap-2"><PlusCircle size={16}/> Tambah Berkas</button>
                   <input className="bg-black border border-neutral-800 text-xs px-5 py-2 rounded-full outline-none focus:border-emerald-500 w-32 font-mono" placeholder="Ganti Pass..." value={accessCode} onChange={e=>setIdentityPassword(e.target.value)}/>
                 </div>
               </div>
             )}
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {(archives || []).map((item, idx) => (
                  <div key={item.id} className="flex flex-col justify-between p-7 bg-neutral-900 rounded-[2rem] border border-neutral-800 hover:border-emerald-500 transition duration-500 group relative">
                    <div className="flex items-start gap-4 mb-8">
                      <div className="bg-emerald-500/10 p-4 rounded-2xl text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white transition duration-500"><Folder size={32}/></div>
                      <div className="text-left min-w-0">
                        <h4 className="font-black truncate text-lg uppercase italic text-white/90 group-hover:text-white transition leading-none mb-2"><EditableText value={item.title} onChange={v=>{const l=[...archives];l[idx].title=v;updateList('archives', l)}} isEditMode={isEditMode}/></h4>
                        <p className="text-[10px] text-neutral-500 uppercase font-black tracking-[0.2em]"><EditableText value={item.category} onChange={v=>{const l=[...archives];l[idx].category=v;updateList('archives', l)}} isEditMode={isEditMode}/></p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {isEditMode ? (
                        <div className="flex-1 flex gap-2"><input placeholder="GDrive URL..." value={item.link || ""} onChange={e=>{const l=[...archives];l[idx].link=e.target.value;updateList('archives', l)}} className="flex-1 text-[10px] bg-black p-3 rounded-xl border border-neutral-800 focus:border-emerald-500 outline-none text-white"/><button onClick={()=>updateList('archives', archives.filter(i=>i.id!==item.id))} className="text-red-500 bg-red-500/10 p-3 rounded-xl hover:bg-red-500 transition"><Trash2 size={18}/></button></div>
                      ) : (
                        <a href={item.link || "#"} target="_blank" rel="noreferrer" className="w-full bg-white text-black py-4 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-emerald-400 transition-all flex items-center justify-center gap-2">Download Module <Download size={14}/></a>
                      )}
                    </div>
                  </div>
                ))}
             </div>
          </div>
        )}
      </div>
    </section>
  );
};

// --- HMS STORE & MADING DIGITAL ---
const MadingAndStore = ({ data, updateList, isEditMode, handleUpload, setDetailModal }) => {
  return (
    <>
      {/* MADING DIGITAL */}
      <section id="mading" className="py-32 bg-white">
        <div className="container mx-auto px-6">
           <div className="flex flex-col md:flex-row justify-between items-center mb-24 gap-8">
             <div className="text-center md:text-left">
                <p className="text-emerald-600 font-black tracking-[0.5em] text-xs uppercase mb-3">Community Bulletin</p>
                <h2 className="text-6xl md:text-7xl font-black text-neutral-950 uppercase italic tracking-tighter leading-none">Mading Digital</h2>
             </div>
             {isEditMode && <button onClick={() => updateList('mading', [...(data.mading||[]), {id: Date.now(), title: "Berita Utama", desc: "Deskripsi singkat kegiatan.", img: "https://via.placeholder.com/800", category: "KEGIATAN"}])} className="bg-black text-white px-12 py-5 rounded-3xl font-black uppercase tracking-widest hover:bg-emerald-600 transition shadow-2xl flex items-center gap-4"><PlusCircle size={24}/> Tambah Informasi</button>}
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
             {(data.mading || []).map((item, idx) => (
               <div key={item.id} className="group cursor-pointer bg-neutral-50 rounded-[3rem] overflow-hidden border border-neutral-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500" onClick={()=>setDetailModal({open:true, item, type:'mading'})}>
                  <div className="h-72 relative overflow-hidden bg-neutral-200">
                    <img src={item.img} className="w-full h-full object-cover transition duration-1000 group-hover:scale-110" alt="News"/>
                    <div className="absolute top-8 left-8 bg-black text-white px-6 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest z-10 shadow-lg">
                      <EditableText value={item.category} onChange={v=>{const l=[...data.mading];l[idx].category=v;updateList('mading',l)}} isEditMode={isEditMode} />
                    </div>
                    {isEditMode && (
                      <div className="absolute inset-0 bg-emerald-950/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition z-20" onClick={e=>e.stopPropagation()}>
                         <label className="cursor-pointer bg-white text-black p-5 rounded-full shadow-2xl hover:scale-110 transition"><Camera size={28}/><input type="file" className="hidden" onChange={e=>handleUpload(e, 'mading', 'img', item.id)}/></label>
                         <button onClick={()=>updateList('mading', data.mading.filter(m=>m.id!==item.id))} className="ml-5 bg-red-600 text-white p-5 rounded-full hover:scale-110 transition"><Trash2 size={28}/></button>
                      </div>
                    )}
                  </div>
                  <div className="p-12">
                    <h3 className="text-3xl font-black uppercase italic tracking-tighter mb-5 leading-tight group-hover:text-emerald-600 transition duration-300"><EditableText value={item.title} onChange={v=>{const l=[...data.mading];l[idx].title=v;updateList('mading',l)}} isEditMode={isEditMode} /></h3>
                    <p className="text-gray-500 text-base line-clamp-3 leading-relaxed font-medium mb-10"><EditableText value={item.desc} onChange={v=>{const l=[...data.mading];l[idx].desc=v;updateList('mading',l)}} isEditMode={isEditMode} type="textarea" /></p>
                    <div className="flex items-center gap-3 text-emerald-600 font-black text-xs uppercase tracking-widest group-hover:gap-6 transition-all duration-500">Selengkapnya <ChevronRight size={18}/></div>
                  </div>
               </div>
             ))}
           </div>
        </div>
      </section>

      {/* HMS STORE & MERCH */}
      <section className="py-32 bg-neutral-950 text-white border-y border-white/10">
        <div className="container mx-auto px-6 text-center">
          <div className="flex flex-col items-center mb-24">
            <div className="w-24 h-24 bg-emerald-600 rounded-[2rem] flex items-center justify-center mb-10 shadow-[0_0_50px_rgba(16,185,129,0.3)]"><ShoppingCart size={48}/></div>
            <h2 className="text-6xl md:text-8xl font-black uppercase italic tracking-tighter mb-8 leading-none">HMS Merch Store</h2>
            <p className="text-neutral-500 max-w-2xl text-xl font-medium leading-relaxed italic">Katalog resmi atribut dan perlengkapan Himpunan Mahasiswa Sipil Untirta.</p>
            {isEditMode && <button onClick={() => updateList('merch', [...(data.merch||[]), {id: Date.now(), name: "Nama Produk", price: "Rp 0", img: "https://via.placeholder.com/600", wa: "628xxx"}])} className="mt-12 bg-white text-black px-12 py-5 rounded-full font-black uppercase tracking-widest text-xs flex items-center gap-4 hover:bg-emerald-500 hover:text-white transition shadow-2xl active:scale-95"><PlusCircle size={20}/> Tambah Katalog Produk</button>}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
            {(data.merch || []).map((item, idx) => (
              <div key={item.id} className="group text-left">
                <div className="aspect-[4/5] bg-neutral-900 rounded-[3rem] mb-8 relative overflow-hidden border border-white/5 shadow-2xl">
                  <img src={item.img} className="w-full h-full object-cover transition duration-1000 group-hover:scale-110 grayscale group-hover:grayscale-0" alt="Item"/>
                  {isEditMode && (
                    <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center gap-5 opacity-0 group-hover:opacity-100 transition z-20">
                       <label className="cursor-pointer bg-white text-black px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest hover:scale-110 transition shadow-2xl">Ganti Foto <input type="file" className="hidden" onChange={e=>handleUpload(e, 'merch', 'img', item.id)}/></label>
                       <button onClick={()=>updateList('merch', data.merch.filter(m=>m.id!==item.id))} className="text-red-500 font-black text-xs uppercase hover:underline">Hapus Katalog</button>
                    </div>
                  )}
                  <div className="absolute bottom-8 left-8 right-8 opacity-0 group-hover:opacity-100 translate-y-6 group-hover:translate-y-0 transition-all duration-700">
                     {!isEditMode && <button onClick={()=>window.open(`https://wa.me/${item.wa}?text=Halo HMS Store, saya tertarik dengan ${item.name}`, '_blank')} className="w-full bg-emerald-600 text-white py-5 rounded-2xl font-black uppercase text-[11px] tracking-widest shadow-2xl shadow-emerald-950/50 hover:bg-emerald-50 transition">Pesan Sekarang</button>}
                  </div>
                </div>
                <div className="px-6 text-center md:text-left">
                  <h3 className="text-2xl font-black uppercase italic tracking-tighter mb-2 block text-white/90 leading-none"><EditableText value={item.name} onChange={v=>{const l=[...data.merch];l[idx].name=v;updateList('merch',l)}} isEditMode={isEditMode} /></h3>
                  <p className="text-emerald-500 font-black text-sm tracking-widest block mb-6 leading-none"><EditableText value={item.price} onChange={v=>{const l=[...data.merch];l[idx].price=v;updateList('merch',l)}} isEditMode={isEditMode} /></p>
                  {isEditMode && <div className="space-y-2"><p className="text-[9px] text-gray-500 font-black uppercase">No. WhatsApp Pemesanan:</p><input placeholder="628xxxxxxxx (WA)" value={item.wa} onChange={e=>{const l=[...data.merch];l[idx].wa=e.target.value;updateList('merch',l)}} className="w-full bg-black border border-neutral-800 text-[11px] p-3 rounded-xl text-white font-mono focus:border-emerald-500 outline-none" /></div>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

// --- APP UTAMA ---
export default function App() {
  const [data, setData] = useState(defaultData);
  const [user, setUser] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [firebaseInstance, setFirebaseInstance] = useState(null);
  
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: "", pass: "" });
  const [detailModal, setDetailModal] = useState({ open: false, item: null, type: null });

  useEffect(() => {
    const initFirebase = async () => {
      const scripts = [
        'https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js',
        'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth-compat.js',
        'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore-compat.js'
      ];
      const loadScript = (srcUrl) => new Promise((res, rej) => {
        const s = document.createElement('script'); s.src = srcUrl; s.onload = res; s.onerror = rej; document.head.appendChild(s);
      });
      try {
        // PERBAIKAN: Menggunakan variabel s (bukan src) agar tidak terjadi ReferenceError
        for (const scriptUrl of scripts) await loadScript(scriptUrl);
        const fb = window.firebase;
        if (!fb.apps.length) fb.initializeApp(firebaseConfig);
        const auth = fb.auth(); const db = fb.firestore();
        setFirebaseInstance({ auth, db });
        auth.onAuthStateChanged((u) => { setUser(u); fetchData(db); });
      } catch (err) { console.error("Firebase Init Failed", err); setLoading(false); }
    };
    initFirebase();
  }, []);

  const fetchData = async (db) => {
    try {
      const snap = await db.collection("website_content").doc("main_data").get();
      if (snap.exists) setData({ ...defaultData, ...snap.data() });
      else { await db.collection("website_content").doc("main_data").set(defaultData); setData(defaultData); }
    } catch (err) { console.error("Fetch Data Error", err); setData(defaultData); } finally { setLoading(false); }
  };

  const handleSave = async () => {
    if (!firebaseInstance) return;
    setLoading(true);
    try {
      await firebaseInstance.db.collection("website_content").doc("main_data").set(data);
      alert("✅ Sinkronisasi Database Selesai! Seluruh Data Website Telah Ter-update.");
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

  if (loading) return <div className="h-screen flex items-center justify-center bg-black text-emerald-500 font-black animate-pulse uppercase tracking-[0.5em] italic">HMS System Booting...</div>;

  return (
    <div className="min-h-screen bg-white font-sans text-neutral-900 pb-24 flex flex-col overflow-x-hidden">
      <SEOEngine name={data.identity.name} title={data.hero.title} desc={data.hero.desc} logo={data.identity.logoUrl} />

      {/* PORTAL ADMIN LOGIN */}
      {showLoginModal && (
        <div className="fixed inset-0 z-[400] flex items-center justify-center p-4 bg-black/98 backdrop-blur-3xl">
          <form className="bg-white p-12 md:p-16 rounded-[4rem] w-full max-w-md shadow-2xl relative" onSubmit={async (e)=>{
            e.preventDefault();
            try { await firebaseInstance.auth.signInWithEmailAndPassword(loginForm.email, loginForm.pass); setShowLoginModal(false); }
            catch(err){ alert("Akses Ditolak! Cek Kredensial Admin."); }
          }}>
            <button type="button" onClick={()=>setShowLoginModal(false)} className="absolute top-10 right-10 text-gray-300 hover:text-red-500 transition"><X size={32}/></button>
            <div className="flex justify-center mb-10 text-emerald-600"><Lock size={80} strokeWidth={1.5}/></div>
            <h3 className="text-3xl font-black mb-10 text-center uppercase tracking-tighter">Portal Otoritas Admin</h3>
            <div className="space-y-5">
               <input required type="email" placeholder="Admin ID" className="w-full border-2 border-neutral-100 p-5 rounded-[1.5rem] outline-none focus:border-emerald-500 bg-neutral-50 font-medium" onChange={e=>setLoginForm({...loginForm, email:e.target.value})}/>
               <input required type="password" placeholder="Passkey" className="w-full border-2 border-neutral-100 p-5 rounded-[1.5rem] outline-none focus:border-emerald-500 bg-neutral-50 font-medium" onChange={e=>setLoginForm({...loginForm, pass:e.target.value})}/>
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
            <div className="relative group cursor-pointer">
              <img src={data.identity.logoUrl} className="h-14 w-14 bg-white rounded-full p-1 shadow-2xl shadow-emerald-500/20" alt="Logo"/>
              {isEditMode && <label className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition"><Camera size={16}/><input type="file" className="hidden" onChange={(e) => handleUploadGeneric(e, 'identity', 'logoUrl')} /></label>}
            </div>
            {isEditMode ? <input value={data.identity.name} onChange={e=>updateIdentity('name', e.target.value)} className="bg-transparent border-b-2 border-emerald-500 font-black uppercase italic text-2xl w-48 outline-none"/> : <span className="text-3xl font-black tracking-tighter uppercase italic drop-shadow-xl">{data.identity.name}</span>}
          </div>
          <div className="flex gap-6">
            {!user ? (
              <button onClick={() => setShowLoginModal(true)} className="bg-emerald-600 text-white px-10 py-3 rounded-full text-xs font-black uppercase tracking-widest hover:bg-emerald-500 transition-all shadow-xl active:scale-95">Admin Portal</button>
            ) : (
              <div className="flex gap-4">
                <button onClick={() => setIsEditMode(!isEditMode)} className="bg-white/10 border-2 border-white/10 px-8 py-3 rounded-full text-[11px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all">{isEditMode ? "Tutup Editor" : "Buka Editor"}</button>
                <button onClick={() => firebaseInstance.auth.signOut()} className="text-red-500 bg-red-500/10 p-4 rounded-full hover:bg-red-500 transition"><LogOut size={20}/></button>
              </div>
            )}
          </div>
        </div>
      </nav>

      <main className="flex-grow">
        {/* HERO SECTION */}
        <section className="relative h-screen flex items-center justify-center text-white bg-black overflow-hidden">
          <img src={data.hero.bgImage} className="absolute inset-0 w-full h-full object-cover opacity-60 scale-105" alt="Hero"/>
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black"></div>
          <div className="relative z-10 text-center px-6 max-w-6xl">
            <div className="inline-block px-10 py-2 border-2 border-emerald-500 text-emerald-400 text-[11px] font-black tracking-[0.6em] mb-14 rounded-full uppercase bg-emerald-900/10 backdrop-blur-lg">
              <EditableText value={data.hero.tagline} onChange={v=>setData({...data, hero:{...data.hero, tagline:v}})} isEditMode={isEditMode} className="text-center bg-transparent outline-none"/>
            </div>
            <h1 className="text-7xl md:text-[10rem] font-black block mb-12 leading-none tracking-tighter uppercase italic drop-shadow-[0_10px_50px_rgba(0,0,0,0.5)]">
              <EditableText value={data.hero.title} onChange={v=>setData({...data, hero:{...data.hero, title:v}})} isEditMode={isEditMode} className="w-full text-center bg-transparent outline-none"/>
            </h1>
            <p className="text-2xl md:text-3xl opacity-80 max-w-4xl mx-auto leading-relaxed font-semibold italic mb-16">
               <EditableText value={data.hero.desc} onChange={v=>setData({...data, hero:{...data.hero, desc:v}})} isEditMode={isEditMode} type="textarea" className="bg-transparent text-center outline-none w-full"/>
            </p>
            {isEditMode && <label className="cursor-pointer bg-emerald-600 px-12 py-5 rounded-[2rem] text-sm font-black uppercase tracking-[0.3em] inline-flex items-center gap-4 hover:bg-emerald-500 transition-all shadow-[0_0_50px_rgba(16,185,129,0.4)] active:scale-95"><Camera size={24}/> Update Foto Banner <input type="file" className="hidden" onChange={e => handleUploadGeneric(e, 'hero', 'bgImage')}/></label>}
          </div>
        </section>

        {/* PROFILE SECTION */}
        <section className="py-56 bg-white">
          <div className="container mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-32 items-center">
            <div className="relative group">
               <div className="absolute -inset-10 bg-emerald-500/5 rounded-[5rem] -z-10 group-hover:bg-emerald-500/15 transition duration-[2000ms]"></div>
               <img src={data.profile.img} className="rounded-[5rem] shadow-[0_50px_100px_rgba(0,0,0,0.15)] h-[850px] w-full object-cover grayscale-0 group-hover:grayscale transition duration-[2000ms] group-hover:scale-[1.02]" alt="Profile"/>
               {isEditMode && (<label className="absolute inset-0 bg-emerald-950/60 rounded-[5rem] flex items-center justify-center cursor-pointer opacity-0 hover:opacity-100 transition duration-700 backdrop-blur-sm"><span className="bg-white text-black px-12 py-5 rounded-[2rem] text-xs font-black uppercase tracking-widest shadow-2xl">Ganti Foto Profil</span><input type="file" className="hidden" onChange={e => handleUploadGeneric(e, 'profile', 'img')} /></label>)}
            </div>
            <div className="text-left">
              <p className="text-emerald-600 font-black text-xs uppercase tracking-[0.5em] mb-6 italic">About Our Legacy</p>
              <h2 className="text-7xl md:text-8xl font-black mb-16 text-neutral-900 border-l-[25px] border-emerald-600 pl-16 uppercase tracking-tighter leading-none italic drop-shadow-sm">
                <EditableText value={data.profile.title} onChange={v=>setData({...data, profile:{...data.profile, title:v}})} isEditMode={isEditMode} />
              </h2>
              <div className="text-gray-500 text-3xl leading-relaxed font-semibold mb-16 italic opacity-80">
                 <EditableText value={data.profile.desc} onChange={v=>setData({...data, profile:{...data.profile, desc:v}})} isEditMode={isEditMode} type="textarea" />
              </div>
              <div className="flex gap-10">
                 <div className="flex flex-col"><span className="text-5xl font-black text-emerald-600">20+</span><span className="text-[10px] font-black uppercase text-gray-400 tracking-widest mt-2 italic">Tahun Berdiri</span></div>
                 <div className="flex flex-col"><span className="text-5xl font-black text-emerald-600">500+</span><span className="text-[10px] font-black uppercase text-gray-400 tracking-widest mt-2 italic">Anggota Aktif</span></div>
              </div>
            </div>
          </div>
        </section>

        {/* BPH SECTION */}
        <section className="py-40 bg-neutral-50">
          <div className="container mx-auto px-6 md:px-12 text-center">
            <div className="max-w-4xl mx-auto mb-32">
               <p className="text-emerald-600 font-black tracking-[0.6em] text-xs uppercase mb-4 italic">Backbone of HMS</p>
               <h2 className="text-7xl font-black text-neutral-900 uppercase italic tracking-tighter leading-none">Badan Pengurus Harian</h2>
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
        <MadingAndStore data={data} updateList={updateList} isEditMode={isEditMode} handleUpload={handleUploadGeneric} setDetailModal={setDetailModal} />

        {/* ARSIP & PORTALS */}
        <ArchiveSection archives={data.archives} isEditMode={isEditMode} accessCode={data.identity.archivePassword} updateList={updateList} setIdentityPassword={(val) => setData({...data, identity: {...data.identity, archivePassword: val}})} />
        <MabaSection data={data} updateIdentity={updateIdentity} isEditMode={isEditMode} />
        <OprecSection data={data} updateIdentity={updateIdentity} isEditMode={isEditMode} />
      </main>

      {/* FLOATING ACTION SAVE */}
      {isEditMode && (
        <div className="fixed bottom-12 right-12 z-[300] flex flex-col items-end gap-6">
           <div className="bg-emerald-600 text-white px-8 py-3 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-2xl animate-bounce">Auto-Sync Database Ready</div>
           <button onClick={handleSave} className="bg-black text-white px-14 py-8 rounded-[3rem] font-black shadow-[0_0_80px_rgba(0,0,0,0.3)] hover:bg-emerald-600 transition-all hover:scale-105 active:scale-90 flex items-center gap-6 uppercase tracking-[0.4em] text-sm border-2 border-emerald-500/20">
             <Save size={32} className="text-emerald-500"/> Synchronize All Core Data
           </button>
        </div>
      )}

      {/* FOOTER */}
      <footer className="bg-black text-white py-48 text-center border-t border-emerald-900/50 mt-auto relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent"></div>
        <div className="container mx-auto px-6">
          <img src={data.identity.logoUrl} className="h-32 w-32 mx-auto mb-16 bg-white rounded-full p-3 grayscale hover:grayscale-0 transition duration-1000 shadow-[0_0_60px_rgba(255,255,255,0.05)]" alt="Footer Logo"/>
          
          {isEditMode ? (
            <div className="flex flex-col items-center gap-8 max-w-md mx-auto">
              <p className="text-[12px] text-emerald-500 uppercase tracking-[0.5em] font-black italic">Secret Gateway Editor:</p>
              <input value={data.identity.secretUrl || ""} onChange={e => updateIdentity('secretUrl', e.target.value)} placeholder="https://external-secret-link.com" className="bg-transparent border-b-2 border-emerald-900 text-white text-base p-5 text-center w-full outline-none focus:border-emerald-500 font-mono transition duration-700" />
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