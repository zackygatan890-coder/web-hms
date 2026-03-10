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

// --- FUNGSI KOMPRESI LOKAL (TAMENG BANDWIDTH) ---
const compressImage = (file, maxWidth = 1000) => {
  return new Promise((resolve) => {
    // Jangan kompres jika bukan gambar (misal PDF)
    if (!file.type.startsWith('image/')) {
      resolve(file);
      return;
    }
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

// Fungsi Upload General untuk Form (Bisa PDF atau Gambar)
const uploadFileToCloudinary = async (file) => {
  if (!file) return "-";
  const compressedFile = await compressImage(file);
  const formData = new FormData();
  formData.append('file', compressedFile);
  formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

  // Menggunakan endpoint 'auto' agar Cloudinary mau menerima PDF (jika preset diizinkan)
  const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/auto/upload`, {
    method: 'POST', body: formData
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.error?.message || "Gagal upload ke Cloudinary.");
  return result.secure_url;
};

// --- DATA DEFAULT ---
const defaultData = {
  identity: { name: "HMS UNTIRTA", logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ag/Logo_Untirta.png/1024px-Logo_Untirta.png", archivePassword: "SIPILJAYA", oprecUrl: "", isOprecOpen: false, mabaUrl: "", waGroupUrl: "", isMabaOpen: false, secretUrl: "" },
  sectionTitles: { bphTitle: "Badan Pengurus Harian", bphSubtitle: "Executive Board", bpoTitle: "Badan Pengawas Organisasi", bpoSubtitle: "Supervisory Board", deptTitle: "Struktur Departemen", deptSubtitle: "Internal Org" },
  hero: { tagline: "PERIODE 2024 - 2025", title: "SOLIDARITAS TANPA BATAS", desc: "Mengokohkan pondasi kekeluargaan untuk mencetak insinyur sipil yang berintegritas dan profesional.", bgImage: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=2089&auto=format&fit=crop" },
  profile: { title: "Tentang Kami", desc: "Himpunan Mahasiswa Sipil adalah wadah perjuangan dan pembelajaran. Kami bukan sekadar organisasi, kami adalah laboratorium karakter bagi calon pemimpin pembangunan masa depan.", img: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=2070&auto=format&fit=crop" },
  social: { tiktokUrl: "https://www.tiktok.com/@tulusm/video/7253572688846769413", caption: "Ikuti keseruan kegiatan kami di media sosial Official HMS!", instagram: "https://instagram.com", twitter: "https://twitter.com", youtube: "https://youtube.com" },
  mading: [], merch: [], archives: [], surveys: [], gallery: [], topManagement: [], bpo: [], departments: []
};

// --- KOMPONEN PEMBANTU ---
const EditableText = ({ value, onChange, isEditMode, className, type = "text", placeholder = "Edit..." }) => {
  if (isEditMode) {
    if (type === "textarea") return <textarea onClick={e => e.stopPropagation()} value={value || ""} onChange={(e) => onChange(e.target.value)} className={`w-full bg-black/50 border border-emerald-500 rounded p-2 text-white focus:ring-2 ring-emerald-400 ${className}`} rows={4}/>;
    return <input onClick={e => e.stopPropagation()} type="text" value={value || ""} onChange={(e) => onChange(e.target.value)} className={`w-full bg-black/50 border-b border-emerald-500 text-white px-1 ${className}`} placeholder={placeholder}/>;
  }
  return <span className={className}>{value}</span>;
};

const SimpleTikTokEmbed = ({ url }) => {
  const videoId = url?.match(/video\/(\d+)/)?.[1];
  if (!videoId) return <div className="h-[500px] bg-neutral-800 flex flex-col items-center justify-center text-gray-500 border border-neutral-700 rounded-xl p-4 text-center"><AlertTriangle size={48} className="mb-4 text-yellow-500" /><p className="font-bold">Link TikTok tidak valid.</p></div>;
  return (<div className="bg-black rounded-xl overflow-hidden shadow-2xl relative w-full max-w-[325px] h-[580px]"><iframe src={`https://www.tiktok.com/embed/v2/${videoId}`} style={{ width: '100%', height: '100%', border: 'none' }} title="TikTok" allow="encrypted-media;"></iframe></div>);
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
    if (!data.identity.mabaUrl) { alert("Admin belum mengatur URL Database Maba (Google Script)."); return; }
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
          <div className="lg:w-1/2">
            <span className="inline-block bg-yellow-500 text-black font-bold px-3 py-1 text-xs rounded mb-4 animate-pulse">{data.identity.isMabaOpen ? "DATA ENTRY MAHASISWA BARU" : "DATA ENTRY DITUTUP"}</span>
            <h2 className="text-4xl md:text-5xl font-black mb-6 leading-tight">SELAMAT DATANG<br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-300">KELUARGA BARU</span></h2>
            <p className="text-gray-400 text-sm mb-8 leading-relaxed">Wajib bagi seluruh mahasiswa baru Teknik Sipil untuk mengisi data diri.</p>
            {isEditMode && (
              <div className="bg-white/10 p-6 rounded-2xl border border-white/20 backdrop-blur-md relative z-20">
                 <div className="absolute -top-3 left-6 bg-yellow-600 text-black text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">Config Maba</div>
                <div className="space-y-3 mt-2">
                  <div><p className="font-bold text-yellow-400 text-xs mb-1">1. URL Google Script:</p><input value={data.identity.mabaUrl || ""} onChange={e=>updateIdentity('mabaUrl', e.target.value)} className="w-full p-2 text-xs bg-black/50 border border-neutral-600 rounded-lg text-white font-mono" placeholder="Paste link script /exec..."/></div>
                  <div><p className="font-bold text-yellow-400 text-xs mb-1">2. Link Grup WhatsApp:</p><input value={data.identity.waGroupUrl || ""} onChange={e=>updateIdentity('waGroupUrl', e.target.value)} className="w-full p-2 text-xs bg-black/50 border border-neutral-600 rounded-lg text-white" placeholder="https://chat.whatsapp.com/..."/></div>
                  <label className="flex items-center gap-3 cursor-pointer mt-2"><input type="checkbox" className="w-4 h-4" checked={data.identity.isMabaOpen} onChange={e=>updateIdentity('isMabaOpen', e.target.checked)}/><span className="text-sm font-bold text-white">Buka Portal Maba</span></label>
                </div>
              </div>
            )}
          </div>
          <div className="lg:w-1/2 w-full">
            <div className="bg-white text-neutral-900 p-8 rounded-3xl shadow-2xl border-4 border-yellow-500">
               {submitStatus === 'success' ? (
                 <div className="text-center py-12"><div className="w-20 h-20 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4"><CheckCircle size={40}/></div><h3 className="text-2xl font-bold">Data Tersimpan!</h3><p className="text-gray-500 mb-6">Terima kasih telah melakukan pendataan.</p>{data.identity.waGroupUrl ? (<a href={data.identity.waGroupUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-xl font-black text-lg transition"><MessageSquare size={24}/> GABUNG GRUP WA</a>) : (<p className="text-red-500 text-sm font-bold">Link Grup belum disetting admin.</p>)}<button onClick={() => setSubmitStatus(null)} className="block mt-6 text-gray-400 text-xs hover:text-black mx-auto underline">Input data lagi</button></div>
               ) : (
                 <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="flex items-center gap-2 border-b-2 border-yellow-100 pb-2 mb-4"><GraduationCap className="text-yellow-600" size={24}/><h3 className="font-bold text-lg text-yellow-800">Biodata Mahasiswa Baru</h3></div>
                    <div className="grid grid-cols-2 gap-4"><div className="space-y-1"><label className="text-xs font-bold text-gray-500">Nama Lengkap</label><input required className="w-full border p-2 rounded-lg bg-gray-50 focus:ring-2 ring-yellow-400 outline-none" value={formData.nama} onChange={e=>setFormData({...formData, nama:e.target.value})}/></div><div className="space-y-1"><label className="text-xs font-bold text-gray-500">NIM</label><input className="w-full border p-2 rounded-lg bg-gray-50 focus:ring-2 ring-yellow-400 outline-none" value={formData.nim} onChange={e=>setFormData({...formData, nim:e.target.value})}/></div></div>
                    <div className="space-y-1"><label className="text-xs font-bold text-gray-500">Nomor WhatsApp (Aktif)</label><input required type="number" className="w-full border p-2 rounded-lg bg-gray-50 focus:ring-2 ring-yellow-400 outline-none" value={formData.wa} onChange={e=>setFormData({...formData, wa:e.target.value})}/></div>
                    <div className="space-y-1"><label className="text-xs font-bold text-gray-500">Asal Sekolah</label><input required className="w-full border p-2 rounded-lg bg-gray-50 focus:ring-2 ring-yellow-400 outline-none" value={formData.sekolah} onChange={e=>setFormData({...formData, sekolah:e.target.value})}/></div>
                    <div className="space-y-1"><label className="text-xs font-bold text-gray-500">Alamat Domisili</label><textarea required className="w-full border p-2 rounded-lg bg-gray-50 focus:ring-2 ring-yellow-400 outline-none h-20" value={formData.alamat} onChange={e=>setFormData({...formData, alamat:e.target.value})}/></div>
                    <div className="space-y-1"><FileInput label="Pas Foto Formal (Wajib)" onChange={e => {if(e.target.files[0]) setFotoFile(e.target.files[0])}} required accept="image/*" /></div>
                    <button disabled={isSubmitting} className="w-full bg-neutral-900 hover:bg-neutral-800 text-white font-bold py-4 rounded-xl transition flex items-center justify-center gap-2">{isSubmitting ? <Loader2 className="animate-spin"/> : <Send size={18}/>} {isSubmitting ? "Mengirim..." : "KIRIM DATA"}</button>
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
  const [files, setFiles] = useState({ formOprec: null, khs: null, krs: null, transkrip: null, portofolio: null });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [uploadProgress, setUploadProgress] = useState("");
  const departmentsList = ["BUMH", "Dept Internal", "Dept Eksternal", "Dept Kaderisasi", "Dept Kesenian & Kerohanian", "Dept Kominfo", "Dept Peristek"];

  const handleFileChange = (e, key) => { if (e.target.files[0]) setFiles(prev => ({ ...prev, [key]: e.target.files[0] })); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!data.identity.isOprecOpen && !isEditMode) return;
    if (!data.identity.oprecUrl) { alert("Script URL Google Form belum diisi admin!"); return; }
    if (formData.pilihan1 === formData.pilihan2) { alert("Pilihan 1 dan 2 tidak boleh sama!"); return; }
    if (!files.formOprec || !files.khs || !files.krs || !files.transkrip) { alert("Lengkapi PDF wajib!"); return; }

    setIsSubmitting(true);
    setUploadProgress("Mengupload berkas ke Cloudinary...");
    try {
      // Peringatan: Ini akan gagal jika Preset Cloudinary tidak diset untuk menerima tipe RAW/PDF
      const linkForm = await uploadFileToCloudinary(files.formOprec);
      const linkKHS = await uploadFileToCloudinary(files.khs);
      const linkKRS = await uploadFileToCloudinary(files.krs);
      const linkTranskrip = await uploadFileToCloudinary(files.transkrip);
      let linkPortofolio = "-";
      if (files.portofolio) linkPortofolio = await uploadFileToCloudinary(files.portofolio);

      setUploadProgress("Menyimpan ke Database...");
      const payload = { ...formData, link_form: linkForm, link_khs: linkKHS, link_krs: linkKRS, link_transkrip: linkTranskrip, link_portofolio: linkPortofolio };
      await fetch(data.identity.oprecUrl, { method: "POST", mode: "no-cors", body: JSON.stringify(payload) });
      
      setSubmitStatus("success"); 
    } catch (err) { 
      alert("Error: " + err.message + "\n(Pastikan Upload Preset Cloudinary mengizinkan upload tipe RAW/PDF)"); 
    } finally { 
      setIsSubmitting(false); setUploadProgress(""); 
    }
  };

  if (!data.identity.isOprecOpen && !isEditMode) return null;

  return (
    <section id="oprec" className="py-20 bg-emerald-900 text-white">
      <div className="container mx-auto px-6">
        <div className="max-w-5xl mx-auto bg-white text-neutral-900 p-8 md:p-12 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
          {isEditMode && (<div className="mb-10 p-6 bg-neutral-100 rounded-2xl border-2 border-dashed border-emerald-500 relative z-20"><div className="absolute -top-3 left-6 bg-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">Admin Control Panel</div><div className="space-y-4 pt-2"><div><p className="text-xs font-bold text-neutral-500 mb-2 uppercase flex items-center gap-2"><Key size={14}/> URL Google Apps Script (Backend)</p><input value={data.identity.oprecUrl||""} onChange={e=>updateIdentity('oprecUrl', e.target.value)} className="w-full p-3 text-xs border border-gray-300 rounded-lg font-mono bg-white focus:ring-2 ring-emerald-500 outline-none text-emerald-700" placeholder="Tempel URL Script..."/></div><div className="flex items-center justify-between bg-white p-4 rounded-xl border border-gray-200 shadow-sm"><span className="text-sm font-bold text-neutral-800">Status Pendaftaran:</span><label className="relative inline-flex items-center cursor-pointer"><input type="checkbox" className="sr-only peer" checked={data.identity.isOprecOpen} onChange={e=>updateIdentity('isOprecOpen', e.target.checked)}/><div className="w-14 h-7 bg-gray-300 peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-emerald-600"></div><span className="ml-3 text-sm font-black uppercase text-emerald-700">{data.identity.isOprecOpen ? 'DIBUKA' : 'DITUTUP'}</span></label></div></div></div>)}
          <h2 className="text-4xl font-black mb-8 text-center text-emerald-800 tracking-tight uppercase">Formulir Rekrutmen</h2>
          {submitStatus === 'success' ? (
            <div className="text-center py-12"><div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6"><CheckCircle size={40} className="text-emerald-600" /></div><h3 className="text-2xl font-bold mb-2">Pendaftaran Berhasil!</h3><button onClick={() => { setSubmitStatus(null); setFormData({ nama: "", nim: "", angkatan: "", pilihan1: "", alasan1: "", pilihan2: "", alasan2: "" }); setFiles({}); }} className="text-emerald-600 font-bold underline">Daftar Kembali</button></div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-4"><div className="flex items-center gap-2 border-b-2 border-emerald-100 pb-2 mb-4"><User className="text-emerald-600" size={20}/><h4 className="font-bold text-emerald-800 uppercase tracking-wider text-sm">Data Diri</h4></div><div className="grid grid-cols-1 md:grid-cols-2 gap-6"><div className="space-y-1"><label className="text-xs font-bold text-gray-500">Nama Lengkap</label><input required className="border border-gray-300 p-3 rounded-xl w-full bg-gray-50 focus:ring-2 ring-emerald-500 outline-none" value={formData.nama} onChange={e=>setFormData({...formData, nama:e.target.value})}/></div><div className="space-y-1"><label className="text-xs font-bold text-gray-500">NIM</label><input required className="border border-gray-300 p-3 rounded-xl w-full bg-gray-50 focus:ring-2 ring-emerald-500 outline-none" value={formData.nim} onChange={e=>setFormData({...formData, nim:e.target.value})}/></div></div><div className="space-y-1"><label className="text-xs font-bold text-gray-500">Angkatan</label><select required className="border border-gray-300 p-3 rounded-xl w-full bg-gray-50 focus:ring-2 ring-emerald-500 outline-none" value={formData.angkatan} onChange={e=>setFormData({...formData, angkatan:e.target.value})}><option value="">Pilih Angkatan...</option><option value="2022">2022</option><option value="2023">2023</option><option value="2024">2024</option></select></div></div>
              <div className="space-y-4"><div className="flex items-center gap-2 border-b-2 border-emerald-100 pb-2 mb-4"><Target className="text-emerald-600" size={20}/><h4 className="font-bold text-emerald-800 uppercase tracking-wider text-sm">Pilihan Departemen</h4></div><div className="bg-emerald-50/50 p-6 rounded-2xl border border-emerald-100"><div className="space-y-1 mb-4"><label className="text-xs font-bold text-emerald-700">Pilihan 1 (Prioritas)</label><select required className="border border-emerald-200 p-3 rounded-xl w-full bg-white focus:ring-2 ring-emerald-500 outline-none" value={formData.pilihan1} onChange={e=>setFormData({...formData, pilihan1:e.target.value})}><option value="">Pilih Departemen...</option>{departmentsList.map(d => <option key={d} value={d}>{d}</option>)}</select></div><div className="space-y-1"><label className="text-xs font-bold text-gray-500">Alasan Pilihan 1</label><textarea required className="border border-gray-300 p-3 rounded-xl w-full bg-white focus:ring-2 ring-emerald-500 outline-none h-24" value={formData.alasan1} onChange={e=>setFormData({...formData, alasan1:e.target.value})}></textarea></div></div><div className="bg-gray-50 p-6 rounded-2xl border border-gray-200"><div className="space-y-1 mb-4"><label className="text-xs font-bold text-gray-600">Pilihan 2 (Alternatif)</label><select required className="border p-3 rounded-xl w-full bg-white focus:ring-2 outline-none border-gray-300 ring-emerald-500" value={formData.pilihan2} onChange={e=>setFormData({...formData, pilihan2:e.target.value})}><option value="">Pilih Departemen...</option>{departmentsList.map(d => <option key={d} value={d} disabled={d === formData.pilihan1}>{d}</option>)}</select></div><div className="space-y-1"><label className="text-xs font-bold text-gray-500">Alasan Pilihan 2</label><textarea required className="border border-gray-300 p-3 rounded-xl w-full bg-white focus:ring-2 ring-emerald-500 outline-none h-24" value={formData.alasan2} onChange={e=>setFormData({...formData, alasan2:e.target.value})}></textarea></div></div></div>
              <div className="space-y-4"><div className="flex items-center gap-2 border-b-2 border-emerald-100 pb-2 mb-4"><Folder className="text-emerald-600" size={20}/><h4 className="font-bold text-emerald-800 uppercase tracking-wider text-sm">Berkas Administrasi (PDF)</h4></div><div className="grid grid-cols-1 md:grid-cols-2 gap-6"><FileInput label="Formulir Oprec (PDF)" onChange={e => handleFileChange(e, 'formOprec')} required accept="application/pdf" /><FileInput label="KHS Terbaru (PDF)" onChange={e => handleFileChange(e, 'khs')} required accept="application/pdf" /><FileInput label="KRS Terbaru (PDF)" onChange={e => handleFileChange(e, 'krs')} required accept="application/pdf" /><FileInput label="Transkrip Nilai (PDF)" onChange={e => handleFileChange(e, 'transkrip')} required accept="application/pdf" /></div></div>
              <button type="submit" disabled={isSubmitting} className="w-full bg-emerald-600 text-white py-5 rounded-2xl font-black hover:bg-emerald-700 transition flex items-center justify-center gap-3 disabled:bg-gray-300">
                {isSubmitting ? <Loader2 className="animate-spin" size={24}/> : <Send size={24}/>} {isSubmitting ? `Proses: ${uploadProgress}` : "KIRIM PENDAFTARAN"}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

// --- KOMPONEN ARSIP ---
const ArchiveSection = ({ archives, isEditMode, accessCode, updateList, setIdentityPassword }) => {
  const [inputCode, setInputCode] = useState("");
  const [unlocked, setUnlocked] = useState(false);

  const handleUnlock = (e) => {
    e.preventDefault();
    if (inputCode === accessCode || isEditMode) {
      setUnlocked(true);
    } else {
      alert("Kode akses salah!");
    }
  };

  const isCurrentlyUnlocked = unlocked || isEditMode;

  return (
    <section className="py-24 bg-neutral-900 text-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-black uppercase mb-4">Arsip Digital</h2>
          <p className="text-neutral-400">
            Bank tugas dan modul pembelajaran. 
            {isEditMode && (
              <span className="text-emerald-400 font-bold ml-2">
                (Password: <input className="text-black ml-1 px-2 py-1 rounded outline-none w-24 text-xs" value={accessCode} onChange={e => setIdentityPassword(e.target.value)} placeholder="Ganti pass"/>)
              </span>
            )}
          </p>
        </div>

        {!isCurrentlyUnlocked ? (
          <div className="max-w-md mx-auto bg-neutral-800 p-8 rounded-3xl text-center border border-neutral-700">
            <Lock size={48} className="mx-auto text-emerald-500 mb-6"/>
            <h3 className="text-xl font-bold mb-2">Area Terbatas</h3>
            <p className="text-sm text-neutral-400 mb-6">Masukkan kode akses angkatan untuk membuka arsip.</p>
            <form onSubmit={handleUnlock} className="flex gap-2">
              <input 
                type="text" 
                placeholder="Masukkan Kode..." 
                className="flex-1 bg-black/50 border border-neutral-600 rounded-xl px-4 py-3 text-center font-bold tracking-widest uppercase focus:border-emerald-500 outline-none" 
                value={inputCode} 
                onChange={e => setInputCode(e.target.value.toUpperCase())}
              />
              <button type="submit" className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 rounded-xl font-bold"><ChevronRight/></button>
            </form>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto animate-fade-in">
             {isEditMode && (
               <div className="mb-8 text-center">
                 <button onClick={() => updateList('archives', [...(archives||[]), {id: Date.now(), title: "Modul Baru", category: "Umum", link: ""}])} className="bg-emerald-600 px-6 py-2 rounded-full font-bold text-sm flex items-center gap-2 mx-auto hover:bg-emerald-500 transition">
                   <PlusCircle size={16}/> Tambah Modul
                 </button>
               </div>
             )}
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(archives || []).length === 0 && !isEditMode && <p className="col-span-full text-center text-gray-500 italic">Belum ada arsip yang diunggah.</p>}
                {(archives || []).map((item, idx) => (
                  <div key={item.id} className="flex items-center justify-between p-4 bg-neutral-800 rounded-2xl border border-neutral-700 hover:border-emerald-500 transition">
                    <div className="flex items-center gap-4 overflow-hidden">
                      <div className="bg-emerald-500/10 p-3 rounded-xl text-emerald-500"><Folder size={20}/></div>
                      <div className="min-w-0">
                        <h4 className="font-bold truncate"><EditableText value={item.title} onChange={v=>{const l=[...archives];l[idx].title=v;updateList('archives', l)}} isEditMode={isEditMode}/></h4>
                        <p className="text-xs text-neutral-500 uppercase tracking-wider"><EditableText value={item.category} onChange={v=>{const l=[...archives];l[idx].category=v;updateList('archives', l)}} isEditMode={isEditMode}/></p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {isEditMode ? (
                        <input placeholder="Link GDrive..." value={item.link || ""} onChange={e=>{const l=[...archives];l[idx].link=e.target.value;updateList('archives', l)}} className="text-xs bg-black p-2 rounded border border-neutral-600 w-32 outline-none focus:border-emerald-500"/>
                      ) : (
                        <a href={item.link || "#"} target="_blank" rel="noreferrer" className="bg-white text-black px-4 py-2 rounded-xl text-xs font-bold hover:bg-emerald-400 transition">Buka</a>
                      )}
                      {isEditMode && <button onClick={()=>updateList('archives', archives.filter(i=>i.id!==item.id))} className="text-red-500 p-2 hover:bg-red-500/20 rounded-lg transition"><Trash2 size={16}/></button>}
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

// --- APP UTAMA ---
const App = () => {
  const [data, setData] = useState(defaultData);
  const [user, setUser] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [firebaseInstance, setFirebaseInstance] = useState(null);
  
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalType, setModalType] = useState(null);

  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  useEffect(() => {
    document.title = `${data.identity.name} | Web Resmi`;
    let link = document.querySelector("link[rel~='icon']");
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.getElementsByTagName('head')[0].appendChild(link);
    }
    link.href = data.identity.logoUrl || "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ag/Logo_Untirta.png/1024px-Logo_Untirta.png";
  }, [data.identity.name, data.identity.logoUrl]);

  useEffect(() => {
    const loadFirebase = async () => {
      const scripts = [
        'https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js',
        'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth-compat.js',
        'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore-compat.js'
      ];
      const loadScript = (src) => new Promise((res, rej) => {
        const s = document.createElement('script'); s.src = src; s.onload = res; s.onerror = rej; document.head.appendChild(s);
      });

      try {
        for (const src of scripts) await loadScript(src);
        const fb = window.firebase;
        if (!fb.apps.length) fb.initializeApp(firebaseConfig);
        const auth = fb.auth(); const db = fb.firestore();
        setFirebaseInstance({ auth, db }); 
        
        auth.onAuthStateChanged((u) => { 
          setUser(u); 
          fetchData(db); 
        });
      } catch (err) { 
        console.error("Firebase Init Error:", err); 
        setLoading(false); 
      }
    };
    loadFirebase();
  }, []);

  const fetchData = async (db) => {
    try {
      const docSnap = await db.collection("website_content").doc("main_data").get();
      if (docSnap.exists) {
        setData({ ...defaultData, ...docSnap.data() });
      } else { 
        await db.collection("website_content").doc("main_data").set(defaultData); 
        setData(defaultData); 
      }
    } catch (err) { 
      console.error("Firestore Fetch Error:", err); 
      setData(defaultData); 
    } finally { 
      setLoading(false); 
    }
  };

  const handleSave = async () => {
    if (!firebaseInstance) return;
    setLoading(true);
    try {
      await firebaseInstance.db.collection("website_content").doc("main_data").set(data);
      alert("✅ Seluruh Data Website Berhasil Disimpan di Firestore!");
      setIsEditMode(false);
    } catch (err) { 
      alert("Gagal Simpan: " + err.message); 
    } finally { 
      setLoading(false); 
    }
  };

  const handleUpload = async (e, section, field, id = null) => {
    const file = e.target.files[0];
    if (!file) return;
    setIsUploading(true);

    try {
      const secureUrl = await uploadFileToCloudinary(file);

      if (id !== null) {
        const newList = [...data[section]];
        const idx = newList.findIndex(i => i.id === id);
        if (idx !== -1) { newList[idx][field] = secureUrl; setData({ ...data, [section]: newList }); }
      } else {
        if (section === 'identity') setData({ ...data, identity: { ...data.identity, [field]: secureUrl } });
        else if (section === 'hero') setData({ ...data, hero: { ...data.hero, [field]: secureUrl } });
        else if (section === 'profile') setData({ ...data, profile: { ...data.profile, [field]: secureUrl } });
      }
      alert("✅ Gambar terupload ke Cloudinary! JANGAN LUPA KLIK SIMPAN PERUBAHAN!");
    } catch (err) { 
      alert("Cloudinary Error: " + err.message); 
    } finally { 
      setIsUploading(false); 
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!firebaseInstance) return;
    setLoginLoading(true);
    try {
      await firebaseInstance.auth.signInWithEmailAndPassword(loginEmail, loginPassword);
      setShowLoginModal(false);
      setLoginEmail("");
      setLoginPassword("");
    } catch (err) {
      alert("Login Gagal: Periksa kembali email dan password Anda. (" + err.message + ")");
    } finally {
      setLoginLoading(false);
    }
  };

  const updateList = (section, newList) => setData({ ...data, [section]: newList });
  const openModal = (item, type) => { setSelectedItem(item); setModalType(type); setModalOpen(true); };
  const updateIdentity = (field, value) => setData({...data, identity: {...data.identity, [field]: value}});

  if (loading) return <div className="h-screen flex items-center justify-center bg-black text-emerald-500 font-black animate-pulse uppercase tracking-[0.5em]">INITIALIZING DUAL-CLOUD...</div>;

  return (
    <div className="min-h-screen bg-white font-sans text-neutral-900 pb-24 flex flex-col">
      {/* POPUP MODAL LOGIN */}
      {showLoginModal && (
        <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <form onSubmit={handleLoginSubmit} className="bg-white p-10 rounded-[2.5rem] w-full max-w-sm shadow-2xl relative">
            <button type="button" onClick={() => setShowLoginModal(false)} className="absolute top-4 right-4 bg-gray-100 hover:bg-red-100 hover:text-red-600 p-2 rounded-full transition"><X size={16}/></button>
            <div className="flex justify-center mb-6 text-emerald-600">
              <Lock size={48} />
            </div>
            <h3 className="text-2xl font-black mb-8 text-center uppercase tracking-tighter text-neutral-900">Akses Admin</h3>
            <div className="space-y-4">
              <input 
                required 
                type="email" 
                placeholder="Email Admin" 
                className="w-full border-2 border-neutral-100 p-4 rounded-xl outline-none focus:border-emerald-500 transition bg-neutral-50" 
                value={loginEmail}
                onChange={e => setLoginEmail(e.target.value)}
              />
              <input 
                required 
                type="password" 
                placeholder="Password" 
                className="w-full border-2 border-neutral-100 p-4 rounded-xl outline-none focus:border-emerald-500 transition bg-neutral-50" 
                value={loginPassword}
                onChange={e => setLoginPassword(e.target.value)}
              />
            </div>
            <button 
              type="submit" 
              disabled={loginLoading}
              className="w-full bg-emerald-600 text-white py-4 rounded-xl font-black mt-8 hover:bg-emerald-700 transition uppercase tracking-widest text-sm flex justify-center items-center"
            >
              {loginLoading ? <Loader2 className="animate-spin" size={20}/> : "Login"}
            </button>
          </form>
        </div>
      )}

      {/* POPUP MODAL DETAIL */}
      {modalOpen && selectedItem && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm" onClick={() => setModalOpen(false)}>
          <div className="bg-white w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl relative" onClick={e => e.stopPropagation()}>
            <button onClick={() => setModalOpen(false)} className="absolute top-4 right-4 z-10 bg-black/50 text-white p-2 rounded-full hover:bg-red-500 transition"><X size={20}/></button>
            <div className="h-64 bg-gray-200 relative">
              <img src={selectedItem.img || selectedItem.url || selectedItem.headImg} className="w-full h-full object-cover" alt="Detail"/>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
              <div className="absolute bottom-6 left-8 text-white">
                <h3 className="text-3xl font-black uppercase leading-tight">{modalType === 'mading' ? selectedItem.title : modalType === 'gallery' ? (selectedItem.title || "Dokumentasi") : modalType === 'tm' || modalType === 'bpo' ? selectedItem.name : selectedItem.title}</h3>
                <p className="text-emerald-300 font-bold tracking-widest text-xs mt-2 uppercase">{modalType === 'mading' ? selectedItem.category : modalType === 'gallery' ? selectedItem.date : modalType === 'tm' || modalType === 'bpo' ? selectedItem.role : "Detail"}</p>
              </div>
            </div>
            <div className="p-8 max-h-[50vh] overflow-y-auto">
              {modalType === 'mading' && (<div className="prose prose-sm max-w-none"><p className="text-gray-500 text-sm font-bold mb-2">Informasi Lengkap:</p><div className="text-gray-800 leading-relaxed text-lg whitespace-pre-wrap">{selectedItem.detail || selectedItem.desc}</div></div>)}
              {modalType === 'gallery' && (<div><p className="text-gray-500 text-xs font-bold uppercase mb-2">Cerita Kegiatan:</p><p className="text-gray-700 leading-relaxed">{selectedItem.story || "Belum ada cerita."}</p></div>)}
              {(modalType === 'tm' || modalType === 'bpo') && (<div><h4 className="font-bold text-lg mb-2 flex items-center gap-2"><Users size={18} className="text-emerald-600"/> Biografi Singkat</h4><p className="text-gray-600 leading-relaxed text-sm whitespace-pre-wrap">{selectedItem.bio}</p></div>)}
              {modalType === 'dept' && (<div className="space-y-6"><div><p className="text-xs font-bold text-gray-400 uppercase mb-1">Nama Lengkap</p><p className="font-bold text-xl">{selectedItem.full}</p></div><div><h4 className="font-bold text-lg mb-2 flex items-center gap-2"><Target size={18} className="text-emerald-600"/> Program Kerja Unggulan</h4><p className="text-gray-600 leading-relaxed text-sm whitespace-pre-wrap">{selectedItem.program}</p></div></div>)}
            </div>
          </div>
        </div>
      )}

      {/* NAVBAR */}
      <nav className="fixed w-full z-50 bg-black/95 backdrop-blur-md text-white py-4 border-b border-emerald-900/50">
        <div className="container mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="relative group cursor-pointer">
              <img src={data.identity.logoUrl} className="h-10 w-10 bg-white rounded-full p-1" alt="Logo"/>
              {isEditMode && <label className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition"><Camera size={12}/><input type="file" className="hidden" onChange={(e) => handleUpload(e, 'identity', 'logoUrl')} /></label>}
            </div>
            {isEditMode ? <input value={data.identity.name} onChange={e=>setData({...data, identity:{...data.identity, name:e.target.value}})} className="bg-transparent border-b border-emerald-500 font-black uppercase w-32 outline-none"/> : <span className="text-xl font-black tracking-tighter uppercase italic">{data.identity.name}</span>}
          </div>
          <div className="flex gap-4">
            {!user ? (
              <button onClick={() => setShowLoginModal(true)} className="bg-emerald-600 text-white px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-emerald-500 transition shadow-lg shadow-emerald-900/20">Admin</button>
            ) : (
              <div className="flex gap-2">
                <button onClick={() => setIsEditMode(!isEditMode)} className="bg-white/10 border border-white/20 px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest">{isEditMode ? "View" : "Edit"}</button>
                <button onClick={() => firebaseInstance.auth.signOut()} className="text-red-500 p-2"><LogOut size={18}/></button>
              </div>
            )}
          </div>
        </div>
      </nav>

      <main className="flex-grow">
        {/* HERO */}
        <section className="relative h-[85vh] flex items-center justify-center text-white bg-black overflow-hidden pt-16">
          <img src={data.hero.bgImage} className="absolute inset-0 w-full h-full object-cover opacity-50 scale-105" alt="Hero"/>
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black"></div>
          <div className="relative z-10 text-center px-6 max-w-4xl">
            <div className="inline-block px-6 py-1 border border-emerald-500 text-emerald-400 text-xs font-bold tracking-[0.3em] mb-8 rounded-full uppercase bg-emerald-900/20 backdrop-blur-sm">
              <EditableText value={data.hero.tagline} onChange={v=>setData({...data, hero:{...data.hero, tagline:v}})} isEditMode={isEditMode} className="bg-transparent text-center" />
            </div>
            <h1 className="text-6xl md:text-8xl font-black block mb-6 leading-none tracking-tight uppercase italic drop-shadow-2xl">
              <EditableText value={data.hero.title} onChange={v=>setData({...data, hero:{...data.hero, title:v}})} isEditMode={isEditMode} className="bg-transparent text-center w-full" />
            </h1>
            <p className="text-lg md:text-xl opacity-80 max-w-2xl mx-auto leading-relaxed font-medium">
               <EditableText value={data.hero.desc} onChange={v=>setData({...data, hero:{...data.hero, desc:v}})} isEditMode={isEditMode} type="textarea" className="bg-transparent text-center w-full" />
            </p>
            {isEditMode && (
              <div className="mt-8">
                <label className="cursor-pointer bg-emerald-600 px-6 py-2 rounded-full text-[10px] font-bold uppercase flex items-center gap-2 mx-auto w-fit"><Camera size={14}/> Ganti Banner <input type="file" className="hidden" onChange={e => handleUpload(e, 'hero', 'bgImage')} /></label>
              </div>
            )}
          </div>
        </section>

        {/* PROFILE */}
        <section className="py-32 bg-white">
          <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
            <div className="relative">
               <div className="absolute -inset-4 bg-emerald-500/10 rounded-[3rem] -z-10"></div>
               <img src={data.profile.img} className="rounded-[2.5rem] shadow-2xl h-[500px] w-full object-cover" alt="Profile"/>
               {isEditMode && (<label className="absolute inset-0 bg-black/40 rounded-[2.5rem] flex items-center justify-center cursor-pointer opacity-0 hover:opacity-100 transition"><span className="bg-white text-black px-4 py-2 rounded-full text-xs font-bold">Ganti Foto</span><input type="file" className="hidden" onChange={e => handleUpload(e, 'profile', 'img')} /></label>)}
            </div>
            <div>
              <h2 className="text-5xl font-black mb-8 text-neutral-900 border-l-[12px] border-emerald-600 pl-8 uppercase tracking-tighter">
                <EditableText value={data.profile.title} onChange={v=>setData({...data, profile:{...data.profile, title:v}})} isEditMode={isEditMode} />
              </h2>
              <div className="text-gray-600 text-xl leading-relaxed">
                 <EditableText value={data.profile.desc} onChange={v=>setData({...data, profile:{...data.profile, desc:v}})} isEditMode={isEditMode} type="textarea" />
              </div>
            </div>
          </div>
        </section>

        {/* BPH & BPO */}
        <section className="py-32 bg-neutral-50">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-16">
              <div>
                <div className="text-center mb-12">
                  <p className="text-emerald-600 font-black tracking-[0.4em] text-xs uppercase mb-2"><EditableText value={data.sectionTitles?.bphSubtitle || "Executive Board"} onChange={v=>setData({...data, sectionTitles:{...data.sectionTitles, bphSubtitle:v}})} isEditMode={isEditMode}/></p>
                  <h2 className="text-4xl font-black text-neutral-900 uppercase tracking-tighter"><EditableText value={data.sectionTitles?.bphTitle || "Badan Pengurus Harian"} onChange={v=>setData({...data, sectionTitles:{...data.sectionTitles, bphTitle:v}})} isEditMode={isEditMode}/></h2>
                  {isEditMode && <button onClick={() => updateList('topManagement', [...(data.topManagement||[]), {id: Date.now(), role: "Jabatan", name: "Nama", bio: "Bio", img: "https://via.placeholder.com/400"}])} className="mt-4 bg-emerald-600 text-white px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 mx-auto"><PlusCircle size={14}/> Tambah Staff BPH</button>}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  {(data.topManagement||[]).map((member, idx) => (
                    <div key={member.id} onClick={() => openModal(member, 'tm')} className="bg-white rounded-[2rem] overflow-hidden shadow-xl border border-neutral-100 group transition-all hover:-translate-y-2 cursor-pointer">
                      <div className="relative h-64"><img src={member.img} className="w-full h-full object-cover" alt={member.name}/>
                        {isEditMode && (<div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition z-30" onClick={e=>e.stopPropagation()}><label className="cursor-pointer bg-white text-black px-3 py-1 rounded-full text-[10px] font-bold"><Camera size={12}/> <input type="file" className="hidden" onChange={(e) => handleUpload(e, 'topManagement', 'img', member.id)} /></label><button onClick={(e) => { e.stopPropagation(); updateList('topManagement', data.topManagement.filter(m => m.id !== member.id)); }} className="ml-2 bg-red-600 text-white p-2 rounded-full"><Trash2 size={12}/></button></div>)}
                      </div>
                      <div className="p-6 text-center">
                        <EditableText value={member.role} onChange={v => { const l=[...data.topManagement];l[idx].role=v;updateList('topManagement', l) }} isEditMode={isEditMode} className="text-emerald-600 font-bold text-[10px] uppercase tracking-widest mb-1 block"/>
                        <EditableText value={member.name} onChange={v => { const l=[...data.topManagement];l[idx].name=v;updateList('topManagement', l) }} isEditMode={isEditMode} className="text-lg font-black text-neutral-900 block leading-tight uppercase"/>
                        {isEditMode && <textarea className="w-full mt-2 text-xs p-2 border" placeholder="Edit Bio..." value={member.bio} onClick={e=>e.stopPropagation()} onChange={e=>{const l=[...data.topManagement];l[idx].bio=e.target.value;updateList('topManagement', l)}}/>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <div className="text-center mb-12">
                  <p className="text-emerald-600 font-black tracking-[0.4em] text-xs uppercase mb-2"><EditableText value={data.sectionTitles?.bpoSubtitle || "Supervisory Board"} onChange={v=>setData({...data, sectionTitles:{...data.sectionTitles, bpoSubtitle:v}})} isEditMode={isEditMode}/></p>
                  <h2 className="text-4xl font-black text-neutral-900 uppercase tracking-tighter"><EditableText value={data.sectionTitles?.bpoTitle || "Badan Pengawas Organisasi"} onChange={v=>setData({...data, sectionTitles:{...data.sectionTitles, bpoTitle:v}})} isEditMode={isEditMode}/></h2>
                  {isEditMode && <button onClick={() => updateList('bpo', [...(data.bpo||[]), {id: Date.now(), role: "Pengawas", name: "Nama", bio: "Bio", img: "https://via.placeholder.com/400"}])} className="mt-4 bg-emerald-600 text-white px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 mx-auto"><PlusCircle size={14}/> Tambah BPO</button>}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  {(data.bpo || []).map((member, idx) => (
                    <div key={member.id} onClick={() => openModal(member, 'bpo')} className="bg-white rounded-[2rem] overflow-hidden shadow-xl border-l-4 border-emerald-500 group transition-all hover:-translate-y-2 cursor-pointer">
                      <div className="relative h-48"><img src={member.img} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" alt={member.name}/>
                        {isEditMode && (<div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition z-30" onClick={e=>e.stopPropagation()}><label className="cursor-pointer bg-white text-black px-3 py-1 rounded-full text-[10px] font-bold"><Camera size={12}/> <input type="file" className="hidden" onChange={(e) => handleUpload(e, 'bpo', 'img', member.id)} /></label><button onClick={(e) => { e.stopPropagation(); updateList('bpo', data.bpo.filter(m => m.id !== member.id)); }} className="ml-2 bg-red-600 text-white p-2 rounded-full"><Trash2 size={12}/></button></div>)}
                      </div>
                      <div className="p-6 text-center">
                        <EditableText value={member.role} onChange={v => { const l=[...data.bpo];l[idx].role=v;updateList('bpo', l) }} isEditMode={isEditMode} className="text-emerald-600 font-bold text-[10px] uppercase tracking-widest mb-1 block"/>
                        <EditableText value={member.name} onChange={v => { const l=[...data.bpo];l[idx].name=v;updateList('bpo', l) }} isEditMode={isEditMode} className="text-lg font-black text-neutral-900 block leading-tight uppercase"/>
                        {isEditMode && <textarea className="w-full mt-2 text-xs p-2 border" placeholder="Edit Bio..." value={member.bio} onClick={e=>e.stopPropagation()} onChange={e=>{const l=[...data.bpo];l[idx].bio=e.target.value;updateList('bpo', l)}}/>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* DEPARTEMENTS */}
        <section className="py-32 bg-white">
          <div className="container mx-auto px-6">
            <div className="flex items-end justify-between mb-20">
              <div>
                <p className="text-emerald-600 font-black tracking-[0.4em] text-xs uppercase mb-2"><EditableText value={data.sectionTitles?.deptSubtitle || "Internal Org"} onChange={v=>setData({...data, sectionTitles:{...data.sectionTitles, deptSubtitle:v}})} isEditMode={isEditMode}/></p>
                <h2 className="text-5xl font-black text-neutral-900 uppercase tracking-tighter"><EditableText value={data.sectionTitles?.deptTitle || "Struktur Departemen"} onChange={v=>setData({...data, sectionTitles:{...data.sectionTitles, deptTitle:v}})} isEditMode={isEditMode}/></h2>
              </div>
              {isEditMode && <button onClick={() => updateList('departments', [...(data.departments||[]), {id: Date.now(), title: "NEW", full: "New Dept", program: "None", headName: "Head", headImg: "https://via.placeholder.com/400"}])} className="bg-emerald-600 text-white p-4 rounded-full shadow-2xl hover:bg-emerald-700 transition"><PlusCircle size={24}/></button>}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              {(data.departments||[]).map((dept, idx) => (
                <div key={dept.id} onClick={() => openModal(dept, 'dept')} className="flex flex-col md:flex-row bg-neutral-950 rounded-[2.5rem] overflow-hidden shadow-2xl hover:shadow-emerald-900/20 transition-all border border-neutral-800 cursor-pointer group">
                  <div className="md:w-1/3 relative overflow-hidden"><img src={dept.headImg} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" alt={dept.headName}/>
                    {isEditMode && (<div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition z-30" onClick={e=>e.stopPropagation()}><label className="cursor-pointer bg-white text-black px-3 py-1 rounded-full text-[10px] font-bold"><Camera size={12}/><input type="file" className="hidden" onChange={(e) => handleUpload(e, 'departments', 'headImg', dept.id)} /></label></div>)}
                  </div>
                  <div className="md:w-2/3 p-12 flex flex-col justify-between text-white">
                    <div>
                      <div className="flex justify-between items-start mb-6">
                        <EditableText value={dept.title} onChange={v => { const l=[...data.departments];l[idx].title=v;updateList('departments', l) }} isEditMode={isEditMode} className="text-4xl font-black tracking-tighter text-emerald-500 uppercase"/>
                        {isEditMode && <button onClick={(e) => { e.stopPropagation(); updateList('departments', data.departments.filter(d => d.id !== dept.id)); }} className="text-red-500 hover:text-white p-2"><Trash2 size={20}/></button>}
                      </div>
                      <EditableText value={dept.full} onChange={v => { const l=[...data.departments];l[idx].full=v;updateList('departments', l) }} isEditMode={isEditMode} className="text-xl font-bold block mb-6 text-neutral-200 uppercase tracking-wide"/>
                      {isEditMode && <textarea className="w-full text-xs p-2 bg-neutral-800 text-white mt-2" placeholder="Program Kerja..." value={dept.program} onClick={e=>e.stopPropagation()} onChange={e=>{const l=[...data.departments];l[idx].program=e.target.value;updateList('departments', l)}}/>}
                    </div>
                    <div className="mt-10 pt-8 border-t border-white/10">
                      <p className="text-[10px] font-bold text-emerald-500 mb-2 uppercase tracking-widest">Kepala Departemen</p>
                      <EditableText value={dept.headName} onChange={v => { const l=[...data.departments];l[idx].headName=v;updateList('departments', l) }} isEditMode={isEditMode} className="font-black text-2xl uppercase tracking-tight"/>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FORMS: MABA & OPREC */}
        <MabaSection data={data} updateIdentity={updateIdentity} isEditMode={isEditMode} />
        <OprecSection data={data} updateIdentity={updateIdentity} isEditMode={isEditMode} />

        {/* SURVEY SECTION */}
        <section className="py-24 bg-white border-t border-neutral-100">
          <div className="container mx-auto px-6">
            <div className="flex justify-between items-end mb-12">
              <div><h2 className="text-4xl font-black text-neutral-900 uppercase">Pusat Survei</h2><p className="text-gray-500 mt-2">Suara Anda menentukan arah gerak himpunan kami.</p></div>
              {isEditMode && <button onClick={() => updateList('surveys', [...(data.surveys||[]), {id: Date.now(), title: "Nama Survei", desc: "Deskripsi", link: ""}])} className="bg-emerald-600 text-white p-3 rounded-full"><PlusCircle/></button>}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {(data.surveys || []).map((item, idx) => (
                <div key={item.id} className="bg-neutral-50 rounded-3xl p-8 border border-neutral-200 shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mb-6"><ClipboardList size={28} /></div>
                    <h3 className="font-black text-xl mb-3 text-neutral-900 leading-tight"><EditableText value={item.title} onChange={v=>{const l=[...data.surveys];l[idx].title=v;updateList('surveys', l)}} isEditMode={isEditMode}/></h3>
                    <p className="text-sm text-gray-500 mb-8"><EditableText value={item.desc} onChange={v=>{const l=[...data.surveys];l[idx].desc=v;updateList('surveys', l)}} isEditMode={isEditMode} type="textarea"/></p>
                  </div>
                  <div className="mt-auto">
                    {isEditMode ? (
                      <div className="space-y-3"><input placeholder="Link GForm..." value={item.link || ""} onChange={e=>{const l=[...data.surveys];l[idx].link=e.target.value;updateList('surveys', l)}} className="w-full text-xs p-2 border border-emerald-300 rounded bg-emerald-50"/><button onClick={()=>updateList('surveys', data.surveys.filter(i=>i.id!==item.id))} className="w-full text-red-500 text-xs font-bold py-2 border border-red-200 rounded">Hapus</button></div>
                    ) : (<a href={item.link || "#"} target="_blank" rel="noreferrer" className="w-full bg-neutral-900 hover:bg-emerald-600 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 uppercase tracking-wider text-sm shadow-md">Isi Survei <ExternalLink size={16}/></a>)}
                  </div>
                </div>
              ))}
              {(data.surveys || []).length === 0 && !isEditMode && <div className="col-span-full text-center py-12 text-gray-400 border-2 border-dashed border-gray-200 rounded-3xl">Belum ada survei aktif.</div>}
            </div>
          </div>
        </section>

        {/* MADING SECTION */}
        <section id="mading" className="py-24 bg-neutral-100">
          <div className="container mx-auto px-6">
            <div className="flex justify-between items-end mb-12">
              <div><h2 className="text-4xl font-black text-neutral-900 uppercase">Mading Digital</h2></div>
              {isEditMode && <button onClick={() => updateList('mading', [...(data.mading||[]), {id: Date.now(), title: "New Info", date: "Date", category: "Info", desc: "Deskripsi", img: "https://via.placeholder.com/400"}])} className="bg-emerald-600 text-white p-3 rounded-full"><PlusCircle/></button>}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {(data.mading || []).map((item, idx) => (
                <div key={item.id} onClick={() => openModal(item, 'mading')} className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition cursor-pointer group relative">
                  <div className="h-64 relative bg-gray-200"><img src={item.img} className="w-full h-full object-cover" alt="Mading"/>
                    <div className="absolute top-4 left-4 bg-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase z-40"><EditableText value={item.category} onChange={v=>{const l=[...data.mading];l[idx].category=v;updateList('mading', l)}} isEditMode={isEditMode} /></div>
                    {isEditMode && (<div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 z-30" onClick={e=>e.stopPropagation()}><label className="cursor-pointer bg-white text-black px-4 py-2 rounded-full text-xs font-bold"><Camera size={14}/><input type="file" className="hidden" onChange={(e) => handleUpload(e, 'mading', 'img', item.id)} /></label></div>)}
                  </div>
                  <div className="p-6">
                    <p className="text-xs text-gray-400 mb-2 flex items-center gap-1"><Calendar size={12}/> <EditableText value={item.date} onChange={v=>{const l=[...data.mading];l[idx].date=v;updateList('mading', l)}} isEditMode={isEditMode}/></p>
                    <h3 className="font-bold text-xl mb-2 leading-tight group-hover:text-emerald-600 transition"><EditableText value={item.title} onChange={v=>{const l=[...data.mading];l[idx].title=v;updateList('mading', l)}} isEditMode={isEditMode}/></h3>
                    <p className="text-sm text-gray-500 line-clamp-2"><EditableText value={item.desc} onChange={v=>{const l=[...data.mading];l[idx].desc=v;updateList('mading', l)}} isEditMode={isEditMode}/></p>
                    {isEditMode && <button onClick={(e)=>{e.stopPropagation(); updateList('mading', data.mading.filter(i=>i.id!==item.id))}} className="mt-4 text-red-500 text-xs font-bold uppercase flex items-center gap-1"><Trash2 size={12}/> Hapus</button>}
                    {isEditMode && <textarea className="w-full text-xs p-2 bg-gray-100 mt-2" placeholder="Detail Mading (Muncul di Popup)..." value={item.detail || ""} onClick={e=>e.stopPropagation()} onChange={e=>{const l=[...data.mading];l[idx].detail=e.target.value;updateList('mading', l)}}/>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* MERCH STORE */}
        <section className="py-24 bg-white">
          <div className="container mx-auto px-6">
            <div className="flex justify-between items-end mb-12">
              <div><h2 className="text-4xl font-black text-neutral-900 uppercase">HMS Store</h2></div>
              {isEditMode && <button onClick={() => updateList('merch', [...(data.merch||[]), {id: Date.now(), name: "Item", price: "Rp 0", img: "https://via.placeholder.com/400", waNumber: ""}])} className="bg-emerald-600 text-white p-3 rounded-full"><PlusCircle/></button>}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {(data.merch || []).map((item, idx) => (
                <div key={item.id} className="group">
                  <div className="aspect-square bg-gray-100 rounded-3xl mb-4 relative overflow-hidden"><img src={item.img} className="w-full h-full object-cover transition duration-500 group-hover:scale-105" alt={item.name}/>
                    {isEditMode && (<label className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition z-20" onClick={e=>e.stopPropagation()}><span className="text-white text-xs font-bold border border-white px-2 py-1 rounded">Upload</span><input type="file" className="hidden" onChange={(e) => handleUpload(e, 'merch', 'img', item.id)} /></label>)}
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-bold text-neutral-900 leading-tight"><EditableText value={item.name} onChange={v=>{const l=[...data.merch];l[idx].name=v;updateList('merch', l)}} isEditMode={isEditMode}/></h3>
                    <p className="text-emerald-600 font-bold"><EditableText value={item.price} onChange={v=>{const l=[...data.merch];l[idx].price=v;updateList('merch', l)}} isEditMode={isEditMode}/></p>
                    {isEditMode ? (<input placeholder="No WA (62...)" value={item.waNumber || ""} onChange={e=>{const l=[...data.merch];l[idx].waNumber=e.target.value;updateList('merch', l)}} className="w-full text-xs p-1 border rounded bg-gray-50"/>) : (<button onClick={() => window.open(`https://wa.me/${item.waNumber||""}?text=Halo saya mau beli ${item.name}`, '_blank')} className="w-full bg-neutral-900 text-white py-2 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-emerald-600 transition flex items-center justify-center gap-2"><Phone size={12}/> Beli Sekarang</button>)}
                    {isEditMode && <button onClick={() => updateList('merch', data.merch.filter(i=>i.id!==item.id))} className="text-red-500 text-xs hover:underline">Hapus</button>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ARCHIVE */}
        <ArchiveSection 
          archives={data.archives} 
          isEditMode={isEditMode} 
          accessCode={data.identity.archivePassword} 
          updateList={updateList} 
          setIdentityPassword={(val) => setData({...data, identity: {...data.identity, archivePassword: val}})} 
        />

        {/* GALLERY */}
        <section className="py-32 bg-neutral-50">
          <div className="container mx-auto px-6">
            <div className="flex justify-between items-end mb-16">
              <div><p className="text-emerald-600 font-black tracking-[0.4em] text-xs uppercase mb-2">Dokumentasi</p><h2 className="text-5xl font-black text-neutral-900 uppercase tracking-tighter">Galeri Kegiatan</h2></div>
              {isEditMode && <button onClick={() => updateList('gallery', [...(data.gallery||[]), { id: Date.now(), title: "Kegiatan Baru", url: "", date: "2024", story: "" }])} className="bg-emerald-600 text-white p-4 rounded-full shadow-xl hover:bg-emerald-500 transition"><PlusCircle/></button>}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {(data.gallery || []).map((item, idx) => (
                <div key={item.id} onClick={() => openModal(item, 'gallery')} className="bg-white rounded-[2rem] overflow-hidden shadow-xl border border-neutral-100 group cursor-pointer">
                  <div className="h-64 relative bg-neutral-200">
                    {item.url ? <img src={item.url} className="w-full h-full object-cover transition group-hover:scale-110 duration-500" alt="Gall" /> : <div className="flex items-center justify-center h-full"><ImageIcon className="text-neutral-400" size={48}/></div>}
                    <div className="absolute top-4 left-4 bg-emerald-600/90 text-white text-xs font-bold px-3 py-1 rounded-full uppercase z-40"><EditableText value={item.date} onChange={v=>{const l=[...data.gallery];l[idx].date=v;updateList('gallery', l)}} isEditMode={isEditMode} /></div>
                    {isEditMode && (<div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition p-6" onClick={e=>e.stopPropagation()}>
                      <label className="cursor-pointer bg-emerald-600 px-4 py-2 rounded-full text-xs font-bold text-white mb-2"><Camera size={14}/> Upload Gambar<input type="file" className="hidden" onChange={e => handleUpload(e, 'gallery', 'url', item.id)} /></label>
                      <button onClick={(e) => { e.stopPropagation(); updateList('gallery', data.gallery.filter(g => g.id !== item.id))}} className="text-red-400 bg-red-900/50 px-4 py-2 rounded-full text-xs font-bold">Hapus Item</button>
                    </div>)}
                  </div>
                  <div className="p-8">
                    <EditableText value={item.title} onChange={v => { const l=[...data.gallery];l[idx].title=v;updateList('gallery', l) }} isEditMode={isEditMode} className="font-bold text-xl uppercase tracking-tight text-neutral-800 w-full block"/>
                    {isEditMode && <textarea className="w-full mt-2 text-xs p-2 bg-gray-100" placeholder="Cerita Singkat Kegiatan..." value={item.story} onClick={e=>e.stopPropagation()} onChange={e=>{const l=[...data.gallery];l[idx].story=e.target.value;updateList('gallery', l)}}/>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SOCIAL SECTION */}
        <section className="py-24 bg-neutral-950 text-white">
          <div className="container mx-auto px-6 flex flex-col lg:flex-row items-center justify-between gap-16">
            <div className="lg:w-1/2">
              <h2 className="text-5xl font-black mb-8 flex items-center gap-6 tracking-tighter uppercase"><PlayCircle className="text-emerald-500" size={64}/> Pojok Kreasi</h2>
              <p className="text-2xl text-neutral-400 mb-12 font-medium italic leading-relaxed"><EditableText value={data.social?.caption} onChange={v=>setData({...data, social:{...data.social, caption:v}})} isEditMode={isEditMode} type="textarea"/></p>
              <div className="flex gap-6 mt-8">
                {data.social?.instagram && <a href={data.social.instagram} target="_blank" rel="noreferrer" className="p-4 bg-neutral-800 rounded-full hover:bg-emerald-600 text-white transition-all transform hover:scale-110"><Instagram size={32}/></a>}
                {data.social?.twitter && <a href={data.social.twitter} target="_blank" rel="noreferrer" className="p-4 bg-neutral-800 rounded-full hover:bg-emerald-600 text-white transition-all transform hover:scale-110"><Twitter size={32}/></a>}
                {data.social?.youtube && <a href={data.social.youtube} target="_blank" rel="noreferrer" className="p-4 bg-neutral-800 rounded-full hover:bg-emerald-600 text-white transition-all transform hover:scale-110"><Youtube size={32}/></a>}
              </div>
              {isEditMode && (<div className="mt-8 p-6 bg-neutral-900 border border-emerald-500/50 rounded-2xl"><p className="text-xs font-bold text-emerald-500 mb-4 uppercase">Edit Link Sosmed:</p><div className="space-y-3"><input value={data.social?.instagram||""} onChange={e=>setData({...data, social:{...data.social, instagram:e.target.value}})} className="w-full bg-black p-3 text-xs border border-neutral-700" placeholder="IG"/><input value={data.social?.youtube||""} onChange={e=>setData({...data, social:{...data.social, youtube:e.target.value}})} className="w-full bg-black p-3 text-xs border border-neutral-700" placeholder="YT"/><input value={data.social?.tiktokUrl||""} onChange={e=>setData({...data, social:{...data.social, tiktokUrl:e.target.value}})} className="w-full bg-black p-3 text-xs border border-neutral-700" placeholder="Link TikTok Video"/></div></div>)}
            </div>
            <div className="lg:w-1/2 flex justify-center w-full relative"><SimpleTikTokEmbed url={data.social?.tiktokUrl} /></div>
          </div>
        </section>

      </main>

      {/* FLOATING SAVE BUTTON */}
      {isEditMode && (
        <div className="fixed bottom-10 right-10 z-[100] flex gap-4">
           <button onClick={handleSave} className="bg-emerald-600 text-white px-10 py-5 rounded-full font-black flex items-center gap-3 shadow-2xl hover:bg-emerald-500 transition animate-pulse uppercase tracking-widest text-xs">
             <Save size={20}/> Simpan Semua Data (Firebase)
           </button>
        </div>
      )}

      {/* LOADING OVERLAY UNTUK UPLOAD */}
      {isUploading && (
        <div className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-md flex flex-col items-center justify-center text-white">
          <Loader2 className="animate-spin text-emerald-500 mb-4" size={64} />
          <p className="font-black uppercase tracking-[0.3em] text-xl">Upload ke Cloudinary...</p>
          <p className="text-xs text-neutral-500 mt-2 italic">Menyimpan file ke server eksternal.</p>
        </div>
      )}

      <footer className="bg-black text-white py-20 text-center border-t border-emerald-900/50 mt-auto">
        <div className="container mx-auto px-6">
          <img src={data.identity.logoUrl} className="h-16 w-16 mx-auto mb-6 bg-white rounded-full p-2" alt="Logo"/>
          
          {/* FITUR TOMBOL RAHASIA */}
          {isEditMode ? (
            <div className="flex flex-col items-center gap-2 mt-4">
              <p className="text-[10px] text-emerald-500 uppercase tracking-widest font-bold">Edit Link Rahasia Footer:</p>
              <input 
                value={data.identity.secretUrl || ""} 
                onChange={e => setData({...data, identity: {...data.identity, secretUrl: e.target.value}})}
                placeholder="https://link-eksternal.com"
                className="bg-black border border-emerald-500 text-white text-xs p-2 rounded text-center w-64 outline-none focus:ring-1 focus:ring-emerald-400"
              />
              <p className="font-black uppercase tracking-[0.5em] text-xs mt-2 text-gray-600 cursor-not-allowed">&copy; {new Date().getFullYear()} {data.identity.name} | SIPIL JAYA!</p>
            </div>
          ) : (
            <a 
              href={data.identity.secretUrl || "#"} 
              target={data.identity.secretUrl ? "_blank" : "_self"} 
              rel="noreferrer" 
              className={`font-black uppercase tracking-[0.5em] text-xs block mt-4 ${data.identity.secretUrl ? 'cursor-pointer hover:text-emerald-400 transition duration-300' : 'cursor-default pointer-events-none'}`}
              title={data.identity.secretUrl ? "Secret Link" : ""}
            >
              &copy; {new Date().getFullYear()} {data.identity.name} | SIPIL JAYA!
            </a>
          )}

        </div>
      </footer>
    </div>
  );
};

export default App;