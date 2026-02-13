import React, { useState, useEffect, useRef } from 'react';
// Menggunakan import dari CDN untuk memastikan ketersediaan library di lingkungan preview
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';
import { 
  Building2, Users, BookOpen, Target, Megaphone, 
  Briefcase, Trophy, HeartHandshake, Menu, X, 
  Edit3, Save, LogIn, LogOut, Lock, Loader2, AlertTriangle,
  Image as ImageIcon, Calendar, Trash2, PlusCircle, PlayCircle, ExternalLink,
  Instagram, Twitter, Youtube, Info, Folder, FileText, Download, Key,
  ShoppingBag, Phone, Pin, UserPlus, CheckCircle, UploadCloud, Send, MessageSquare, Sparkles, User, ChevronRight, Newspaper, ShoppingCart, Camera, Archive, LayoutGrid, MapPin, Scale, GraduationCap
} from 'lucide-react';

// --- 1. KONFIGURASI SUPABASE ---
const supabaseConfig = {
  url: 'https://uxqgqaamkuwzxzwiygfz.supabase.co',
  anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV4cWdxYWFta3V3enh6d2l5Z2Z6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA3ODgwNzgsImV4cCI6MjA4NjM2NDA3OH0.ObYQbsLBjmGzIeN7MoGjMkQMfnQoPw18ZPw4RRVIBo8'
};

// --- DATA DEFAULT ---
const defaultData = {
  identity: { 
    name: "HMS UNTIRTA", 
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ag/Logo_Untirta.png/1024px-Logo_Untirta.png", 
    archivePassword: "SIPILJAYA", 
    oprecUrl: "", 
    isOprecOpen: false,
    mabaUrl: "", 
    waGroupUrl: "", 
    isMabaOpen: false
  },
  sectionTitles: {
    bphTitle: "Badan Pengurus Harian",
    bphSubtitle: "Executive Board",
    bpoTitle: "Badan Pengawas Organisasi",
    bpoSubtitle: "Supervisory Board",
    deptTitle: "Struktur Departemen",
    deptSubtitle: "Internal Org"
  },
  hero: { 
    tagline: "PERIODE 2024 - 2025", 
    title: "SOLIDARITAS TANPA BATAS", 
    desc: "Mengokohkan pondasi kekeluargaan untuk mencetak insinyur sipil yang berintegritas dan profesional.", 
    bgImage: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=2089&auto=format&fit=crop" 
  },
  profile: { 
    title: "Tentang Kami", 
    desc: "Himpunan Mahasiswa Sipil adalah wadah perjuangan dan pembelajaran. Kami bukan sekadar organisasi, kami adalah laboratorium karakter bagi calon pemimpin pembangunan masa depan.", 
    img: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=2070&auto=format&fit=crop" 
  },
  social: { 
    tiktokUrl: "https://www.tiktok.com/@tulusm/video/7253572688846769413", 
    caption: "Ikuti keseruan kegiatan kami di media sosial Official HMS!", 
    instagram: "https://instagram.com", 
    twitter: "https://twitter.com", 
    youtube: "https://youtube.com" 
  },
  mading: [
    { id: 1, date: "12 Feb 2024", category: "Lomba", title: "Lomba Beton Nasional", desc: "Ikuti kompetisi beton tingkat nasional...", img: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=2070&auto=format&fit=crop", detail: "Detail lengkap lomba ada di sini..." }
  ], 
  merch: [
    { id: 1, name: "Hoodie Official HMS", price: "150000", desc: "Bahan Cotton Fleece tebal.", img: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=1974&auto=format&fit=crop", waNumber: "62812345678" }
  ], 
  archives: [
    { id: 1, title: "Modul Mekanika Fluida", category: "Semester 3", link: "https://drive.google.com" }
  ], 
  gallery: [
    { id: 1, title: "Kunjungan Industri", date: "Jan 2024", url: "https://images.unsplash.com/photo-1541888946425-d81bb19480c5?q=80&w=2070&auto=format&fit=crop", story: "Kunjungan ke proyek jembatan..." }
  ],
  topManagement: [
    { id: 'tm1', role: "Ketua Umum", name: "Nama Ketua", bio: "Mahasiswa angkatan 2021...", img: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=800&auto=format&fit=crop" }
  ],
  bpo: [
    { id: 'bp1', role: "Koordinator", name: "Nama Koordinator", bio: "Mengawasi kinerja organisasi...", img: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=800&auto=format&fit=crop" }
  ],
  departments: [
    { id: 1, title: "INTERNAL", full: "Departemen Internal", program: "Upgrading Pengurus.", headName: "KaDept Internal", headImg: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop" }
  ]
};

// --- KOMPONEN PEMBANTU ---
const EditableText = ({ value, onChange, isEditMode, className, type = "text", placeholder = "Edit..." }) => {
  if (isEditMode) {
    if (type === "textarea") {
      return <textarea onClick={e => e.stopPropagation()} value={value || ""} onChange={(e) => onChange(e.target.value)} className={`w-full bg-white/10 border border-emerald-500 rounded p-2 text-inherit focus:ring-2 ring-emerald-400 ${className}`} rows={4}/>;
    }
    return <input onClick={e => e.stopPropagation()} type="text" value={value || ""} onChange={(e) => onChange(e.target.value)} className={`w-full bg-white/10 border-b border-emerald-500 text-inherit px-1 ${className}`} placeholder={placeholder}/>;
  }
  return <span className={className}>{value}</span>;
};

const SimpleTikTokEmbed = ({ url }) => {
  const videoId = url?.match(/video\/(\d+)/)?.[1];
  if (!videoId) return <div className="h-[500px] bg-neutral-800 flex flex-col items-center justify-center text-gray-500 border border-neutral-700 rounded-xl p-4 text-center"><AlertTriangle size={48} className="mb-4 text-yellow-500" /><p className="font-bold">Link TikTok tidak valid.</p></div>;
  return (
    <div className="bg-black rounded-xl overflow-hidden shadow-2xl relative w-full max-w-[325px] h-[580px]">
      <iframe src={`https://www.tiktok.com/embed/v2/${videoId}`} style={{ width: '100%', height: '100%', border: 'none' }} title="TikTok" allow="encrypted-media;"></iframe>
    </div>
  );
};

const FileInput = ({ label, onChange, required, accept }) => (
  <div className="mb-3">
    <label className="block text-xs font-bold text-gray-500 mb-1 flex items-center gap-1">
      <FileText size={12} className="text-emerald-600"/> {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input 
      type="file" 
      onChange={onChange} 
      required={required}
      accept={accept}
      className="block w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 cursor-pointer border border-gray-200 rounded-lg"
    />
  </div>
);

// --- MABA DATA SECTION (RESTORED) ---
const MabaSection = ({ data, update, isEditMode, supabase }) => {
  const [formData, setFormData] = useState({ nama: "", nim: "", wa: "", sekolah: "", alamat: "" });
  const [fotoFile, setFotoFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const uploadFoto = async () => {
    if (!fotoFile || !supabase) return "-";
    const cleanName = formData.nama.trim().replace(/[^a-zA-Z0-9 ]/g, '').replace(/\s+/g, '_');
    const fileExt = fotoFile.name.split('.').pop();
    const fileName = `MABA_${formData.nim}_${cleanName}.${fileExt}`;
    // Reuse bucket 'oprec_files' karena sudah public
    const { data: uploadData, error } = await supabase.storage.from('oprec_files').upload(fileName, fotoFile, { upsert: true });
    if (error) throw new Error("Gagal upload foto");
    const { data: urlData } = supabase.storage.from('oprec_files').getPublicUrl(uploadData.path);
    return urlData.publicUrl;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!data.identity.mabaUrl) { alert("Admin belum mengatur URL Database Maba."); return; }
    
    setIsSubmitting(true);
    try {
      const linkFoto = await uploadFoto();
      const payload = { ...formData, link_foto: linkFoto };
      
      await fetch(data.identity.mabaUrl, { 
        method: "POST", mode: "no-cors", 
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload) 
      });
      
      setSubmitStatus("success");
      setFormData({ nama: "", nim: "", wa: "", sekolah: "", alamat: "" });
      setFotoFile(null);
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!data.identity.isMabaOpen && !isEditMode) return null;

  return (
    <section id="maba-portal" className="py-20 bg-neutral-900 text-white border-t border-neutral-800">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-12 items-center">
          
          <div className="lg:w-1/2">
            <span className="inline-block bg-yellow-500 text-black font-bold px-3 py-1 text-xs rounded mb-4 animate-pulse">
               {data.identity.isMabaOpen ? "DATA ENTRY MAHASISWA BARU" : "DATA ENTRY DITUTUP"}
            </span>
            <h2 className="text-4xl md:text-5xl font-black mb-6 leading-tight">
              SELAMAT DATANG<br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-300">KELUARGA BARU</span>
            </h2>
            <p className="text-gray-400 text-sm mb-8 leading-relaxed">
              Wajib bagi seluruh mahasiswa baru Teknik Sipil untuk mengisi data diri guna keperluan administrasi himpunan dan angkatan.
            </p>
            
            {/* ADMIN CONFIG MABA */}
            {isEditMode && (
              <div className="bg-white/10 p-6 rounded-2xl border border-white/20 backdrop-blur-md relative z-20">
                 <div className="absolute -top-3 left-6 bg-yellow-600 text-black text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">Config Maba</div>
                <div className="space-y-3 mt-2">
                  <div>
                    <p className="font-bold text-yellow-400 text-xs mb-1">1. URL Google Script (Database Maba):</p>
                    <input 
                      value={data.identity.mabaUrl || ""} 
                      onChange={e=>update('mabaUrl', e.target.value)} 
                      className="w-full p-2 text-xs bg-black/50 border border-neutral-600 rounded-lg text-white font-mono mb-4" 
                      placeholder="Paste link script /exec di sini..."
                    />
                  </div>
                  <div>
                    <p className="font-bold text-yellow-400 text-xs mb-1">2. Link Invite Grup WhatsApp:</p>
                    <input 
                      value={data.identity.waGroupUrl || ""} 
                      onChange={e=>update('waGroupUrl', e.target.value)} 
                      className="w-full p-2 text-xs bg-black/50 border border-neutral-600 rounded-lg text-white" 
                      placeholder="https://chat.whatsapp.com/..."
                    />
                  </div>
                  <label className="flex items-center gap-3 cursor-pointer mt-2">
                    <input type="checkbox" className="w-4 h-4" checked={data.identity.isMabaOpen} onChange={e=>update('isMabaOpen', e.target.checked)}/>
                    <span className="text-sm font-bold text-white">Buka Portal Maba</span>
                  </label>
                </div>
              </div>
            )}
          </div>

          <div className="lg:w-1/2 w-full">
            <div className="bg-white text-neutral-900 p-8 rounded-3xl shadow-2xl border-4 border-yellow-500">
               {submitStatus === 'success' ? (
                 <div className="text-center py-12">
                   <div className="w-20 h-20 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4"><CheckCircle size={40}/></div>
                   <h3 className="text-2xl font-bold">Data Tersimpan!</h3>
                   <p className="text-gray-500 mb-6">Terima kasih telah melakukan pendataan.</p>
                   {data.identity.waGroupUrl ? (
                     <a href={data.identity.waGroupUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-xl font-black text-lg transition shadow-lg transform hover:scale-105">
                       <MessageSquare size={24}/> GABUNG GRUP WHATSAPP
                     </a>
                   ) : (
                     <p className="text-red-500 text-sm font-bold bg-red-50 p-2 rounded">Link Grup belum disetting oleh Admin.</p>
                   )}
                   <button onClick={() => setSubmitStatus(null)} className="block mt-6 text-gray-400 text-xs hover:text-black mx-auto underline">Input data lagi</button>
                 </div>
               ) : (
                 <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="flex items-center gap-2 border-b-2 border-yellow-100 pb-2 mb-4">
                      <GraduationCap className="text-yellow-600" size={24}/>
                      <h3 className="font-bold text-lg text-yellow-800">Biodata Mahasiswa Baru</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-500">Nama Lengkap</label>
                        <input required className="w-full border p-2 rounded-lg bg-gray-50 focus:ring-2 ring-yellow-400 outline-none" value={formData.nama} onChange={e=>setFormData({...formData, nama:e.target.value})}/>
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-500">NIM</label>
                        <input required className="w-full border p-2 rounded-lg bg-gray-50 focus:ring-2 ring-yellow-400 outline-none" value={formData.nim} onChange={e=>setFormData({...formData, nim:e.target.value})}/>
                      </div>
                    </div>
                    <div className="space-y-1">
                       <label className="text-xs font-bold text-gray-500">Nomor WhatsApp (Aktif)</label>
                       <input required type="number" className="w-full border p-2 rounded-lg bg-gray-50 focus:ring-2 ring-yellow-400 outline-none" placeholder="08..." value={formData.wa} onChange={e=>setFormData({...formData, wa:e.target.value})}/>
                    </div>
                    <div className="space-y-1">
                       <label className="text-xs font-bold text-gray-500">Asal Sekolah</label>
                       <input required className="w-full border p-2 rounded-lg bg-gray-50 focus:ring-2 ring-yellow-400 outline-none" value={formData.sekolah} onChange={e=>setFormData({...formData, sekolah:e.target.value})}/>
                    </div>
                    <div className="space-y-1">
                       <label className="text-xs font-bold text-gray-500">Alamat Domisili (Kos/Rumah)</label>
                       <textarea required className="w-full border p-2 rounded-lg bg-gray-50 focus:ring-2 ring-yellow-400 outline-none h-20" value={formData.alamat} onChange={e=>setFormData({...formData, alamat:e.target.value})}/>
                    </div>
                    <div className="space-y-1">
                      <FileInput label="Pas Foto Formal (Wajib)" onChange={e => {if(e.target.files[0]) setFotoFile(e.target.files[0])}} required accept="image/*" />
                    </div>
                    <button disabled={isSubmitting} className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-black py-4 rounded-xl transition flex items-center justify-center gap-2">
                       {isSubmitting ? <Loader2 className="animate-spin"/> : <Send size={18}/>}
                       {isSubmitting ? "Mengirim..." : "KIRIM DATA"}
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

// --- OPREC SECTION ---
const OprecSection = ({ data, update, isEditMode, supabase }) => {
  const [formData, setFormData] = useState({ nama: "", nim: "", angkatan: "", pilihan1: "", alasan1: "", pilihan2: "", alasan2: "" });
  const [files, setFiles] = useState({ formOprec: null, khs: null, krs: null, transkrip: null, portofolio: null });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [uploadProgress, setUploadProgress] = useState("");

  const departmentsList = ["BUMH (Badan Usaha Milik Himpunan)", "Departemen Internal", "Departemen Eksternal", "Departemen Kaderisasi", "Departemen Kesenian & Kerohanian", "Departemen Kominfo", "Departemen Peristek"];

  const handleFileChange = (e, key) => { if (e.target.files[0]) setFiles(prev => ({ ...prev, [key]: e.target.files[0] })); };

  // Fungsi Upload dengan Auto-Rename
  const uploadFile = async (file, typeLabel) => {
    if (!file || !supabase) return "-";
    const cleanName = formData.nama.trim().replace(/[^a-zA-Z0-9 ]/g, '').replace(/\s+/g, '_');
    const fileExt = file.name.split('.').pop();
    const fileName = `${cleanName}_${formData.nim}_${typeLabel}.${fileExt}`;
    const { data: uploadData, error } = await supabase.storage.from('oprec_files').upload(fileName, file, { upsert: true });
    if (error) { console.error(`Gagal upload ${typeLabel}:`, error); throw new Error(`Gagal upload ${typeLabel}`); }
    const { data: urlData } = supabase.storage.from('oprec_files').getPublicUrl(uploadData.path);
    return urlData.publicUrl;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!data.identity.isOprecOpen && !isEditMode) return;
    if (formData.pilihan1 === formData.pilihan2) { alert("Pilihan 1 dan Pilihan 2 tidak boleh sama!"); return; }
    if (!files.formOprec || !files.khs || !files.krs || !files.transkrip) { alert("Harap lengkapi berkas wajib: Formulir, KHS, KRS, dan Transkrip Nilai!"); return; }
    const isKominfo = formData.pilihan1.includes('Kominfo') || formData.pilihan2.includes('Kominfo');
    if (isKominfo && !files.portofolio) { alert("Anda memilih Kominfo, wajib upload Portofolio!"); return; }

    setIsSubmitting(true);
    setUploadProgress("Memulai proses...");
    
    try {
      setUploadProgress("Mengupload Formulir Oprec..."); const linkForm = await uploadFile(files.formOprec, "FORM_OPREC");
      setUploadProgress("Mengupload KHS..."); const linkKHS = await uploadFile(files.khs, "KHS");
      setUploadProgress("Mengupload KRS..."); const linkKRS = await uploadFile(files.krs, "KRS");
      setUploadProgress("Mengupload Transkrip..."); const linkTranskrip = await uploadFile(files.transkrip, "TRANSKRIP_NILAI");
      let linkPortofolio = "-";
      if (files.portofolio) { setUploadProgress("Mengupload Portofolio..."); linkPortofolio = await uploadFile(files.portofolio, "PORTOFOLIO"); }
      setUploadProgress("Menyimpan data pendaftaran...");
      const payload = { ...formData, link_form: linkForm, link_khs: linkKHS, link_krs: linkKRS, link_transkrip: linkTranskrip, link_portofolio: linkPortofolio };
      if (data.identity.oprecUrl) await fetch(data.identity.oprecUrl, { method: "POST", mode: "no-cors", body: JSON.stringify(payload) });
      setSubmitStatus("success"); setUploadProgress("");
    } catch (err) {
      alert("Terjadi kesalahan: " + err.message); setSubmitStatus("error"); setUploadProgress("");
    } finally { setIsSubmitting(false); }
  };

  if (!data.identity.isOprecOpen && !isEditMode) return null;

  return (
    <section id="oprec" className="py-20 bg-emerald-900 text-white">
      <div className="container mx-auto px-6">
        <div className="max-w-5xl mx-auto bg-white text-neutral-900 p-8 md:p-12 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
          
          {/* --- ADMIN PANEL --- */}
          {isEditMode && (
            <div className="mb-10 p-6 bg-neutral-100 rounded-2xl border-2 border-dashed border-emerald-500 relative z-20">
              <div className="absolute -top-3 left-6 bg-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                Admin Control Panel
              </div>
              <div className="space-y-4 pt-2">
                <div>
                  <p className="text-xs font-bold text-neutral-500 mb-2 uppercase flex items-center gap-2">
                    <Key size={14}/> URL Google Apps Script (Backend)
                  </p>
                  <input 
                    value={data.identity.oprecUrl} 
                    onChange={e=>update('oprecUrl', e.target.value)} 
                    className="w-full p-3 text-xs border border-gray-300 rounded-lg font-mono bg-white focus:ring-2 ring-emerald-500 outline-none text-emerald-700" 
                    placeholder="Tempel URL Script yang berakhiran /exec di sini..."
                  />
                </div>
                
                <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                  <span className="text-sm font-bold text-neutral-800">Status Pendaftaran:</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" checked={data.identity.isOprecOpen} onChange={e=>update('isOprecOpen', e.target.checked)}/>
                    <div className="w-14 h-7 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-emerald-600"></div>
                    <span className="ml-3 text-sm font-black uppercase text-emerald-700">
                      {data.identity.isOprecOpen ? 'DIBUKA (OPEN)' : 'DITUTUP (CLOSED)'}
                    </span>
                  </label>
                </div>
              </div>
            </div>
          )}

          <h2 className="text-4xl font-black mb-8 text-center text-emerald-800 tracking-tight uppercase">Formulir Rekrutmen</h2>
          
          {submitStatus === 'success' ? (
            <div className="text-center py-12 animate-fade-in"><div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6"><CheckCircle size={40} className="text-emerald-600" /></div><h3 className="text-2xl font-bold mb-2">Pendaftaran Berhasil!</h3><p className="text-gray-500 mb-8">Data dan berkas Anda telah tersimpan dengan aman sesuai standar penamaan.</p><button onClick={() => { setSubmitStatus(null); setFormData({ nama: "", nim: "", angkatan: "", pilihan1: "", alasan1: "", pilihan2: "", alasan2: "" }); setFiles({}); }} className="text-emerald-600 font-bold underline hover:text-emerald-800">Daftar Kembali</button></div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-4"><div className="flex items-center gap-2 border-b-2 border-emerald-100 pb-2 mb-4"><User className="text-emerald-600" size={20}/><h4 className="font-bold text-emerald-800 uppercase tracking-wider text-sm">Data Diri</h4></div><div className="grid grid-cols-1 md:grid-cols-2 gap-6"><div className="space-y-1"><label className="text-xs font-bold text-gray-500">Nama Lengkap</label><input required className="border border-gray-300 p-3 rounded-xl w-full bg-gray-50 focus:ring-2 ring-emerald-500 outline-none transition" value={formData.nama} onChange={e=>setFormData({...formData, nama:e.target.value})}/></div><div className="space-y-1"><label className="text-xs font-bold text-gray-500">NIM</label><input required className="border border-gray-300 p-3 rounded-xl w-full bg-gray-50 focus:ring-2 ring-emerald-500 outline-none transition" value={formData.nim} onChange={e=>setFormData({...formData, nim:e.target.value})}/></div></div><div className="space-y-1"><label className="text-xs font-bold text-gray-500">Angkatan</label><select required className="border border-gray-300 p-3 rounded-xl w-full bg-gray-50 focus:ring-2 ring-emerald-500 outline-none" value={formData.angkatan} onChange={e=>setFormData({...formData, angkatan:e.target.value})}><option value="">Pilih Angkatan...</option><option value="2022">2022</option><option value="2023">2023</option><option value="2024">2024</option></select></div></div>
              <div className="space-y-4"><div className="flex items-center gap-2 border-b-2 border-emerald-100 pb-2 mb-4"><Target className="text-emerald-600" size={20}/><h4 className="font-bold text-emerald-800 uppercase tracking-wider text-sm">Pilihan Departemen</h4></div><div className="bg-emerald-50/50 p-6 rounded-2xl border border-emerald-100"><div className="space-y-1 mb-4"><label className="text-xs font-bold text-emerald-700">Pilihan 1 (Prioritas)</label><select required className="border border-emerald-200 p-3 rounded-xl w-full bg-white focus:ring-2 ring-emerald-500 outline-none" value={formData.pilihan1} onChange={e=>setFormData({...formData, pilihan1:e.target.value})}><option value="">Pilih Departemen...</option>{departmentsList.map(d => <option key={d} value={d}>{d}</option>)}</select></div><div className="space-y-1"><label className="text-xs font-bold text-gray-500">Alasan Memilih (Pilihan 1)</label><textarea required className="border border-gray-300 p-3 rounded-xl w-full bg-white focus:ring-2 ring-emerald-500 outline-none h-24 text-sm" placeholder="Jelaskan motivasi dan kontribusi..." value={formData.alasan1} onChange={e=>setFormData({...formData, alasan1:e.target.value})}></textarea></div></div><div className="bg-gray-50 p-6 rounded-2xl border border-gray-200"><div className="space-y-1 mb-4"><label className="text-xs font-bold text-gray-600">Pilihan 2 (Alternatif)</label><select required className={`border p-3 rounded-xl w-full bg-white focus:ring-2 outline-none ${formData.pilihan1 && formData.pilihan1 === formData.pilihan2 ? 'border-red-500 ring-red-500 text-red-600' : 'border-gray-300 ring-emerald-500'}`} value={formData.pilihan2} onChange={e=>setFormData({...formData, pilihan2:e.target.value})}><option value="">Pilih Departemen...</option>{departmentsList.map(d => <option key={d} value={d} disabled={d === formData.pilihan1}>{d}</option>)}</select>{formData.pilihan1 && formData.pilihan1 === formData.pilihan2 && <p className="text-[10px] text-red-500 font-bold mt-1">*Pilihan tidak boleh sama!</p>}</div><div className="space-y-1"><label className="text-xs font-bold text-gray-500">Alasan Memilih (Pilihan 2)</label><textarea required className="border border-gray-300 p-3 rounded-xl w-full bg-white focus:ring-2 ring-emerald-500 outline-none h-24 text-sm" placeholder="Jelaskan motivasi..." value={formData.alasan2} onChange={e=>setFormData({...formData, alasan2:e.target.value})}></textarea></div></div></div>
              <div className="space-y-4"><div className="flex items-center gap-2 border-b-2 border-emerald-100 pb-2 mb-4"><Folder className="text-emerald-600" size={20}/><h4 className="font-bold text-emerald-800 uppercase tracking-wider text-sm">Berkas Administrasi (PDF ONLY)</h4></div><div className="grid grid-cols-1 md:grid-cols-2 gap-6"><FileInput label="Formulir Oprec (PDF)" onChange={e => handleFileChange(e, 'formOprec')} required accept="application/pdf" /><FileInput label="KHS Terbaru (PDF)" onChange={e => handleFileChange(e, 'khs')} required accept="application/pdf" /><FileInput label="KRS Terbaru (PDF)" onChange={e => handleFileChange(e, 'krs')} required accept="application/pdf" /><FileInput label="Transkrip Nilai (PDF)" onChange={e => handleFileChange(e, 'transkrip')} required accept="application/pdf" /></div>{(formData.pilihan1.includes('Kominfo') || formData.pilihan2.includes('Kominfo')) && (<div className="bg-blue-50 p-4 rounded-xl border border-blue-200 mt-4 animate-fade-in"><FileInput label="Portofolio Desain/Video (PDF)" onChange={e => handleFileChange(e, 'portofolio')} required accept="application/pdf" /><p className="text-[10px] text-blue-600 mt-1 font-bold flex items-center gap-1"><Info size={10}/> Wajib karena memilih Kominfo</p></div>)}</div>
              <button type="submit" disabled={isSubmitting || (formData.pilihan1 === formData.pilihan2 && formData.pilihan1 !== "")} className="w-full bg-emerald-600 text-white py-5 rounded-2xl font-black hover:bg-emerald-700 transition flex items-center justify-center gap-3 shadow-lg hover:shadow-emerald-500/30 disabled:bg-gray-300 disabled:cursor-not-allowed">
                {isSubmitting ? <Loader2 className="animate-spin" size={24}/> : <Send size={24}/>} {isSubmitting ? `Proses: ${uploadProgress}` : "KIRIM PENDAFTARAN"}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

// --- MADING SECTION (WITH POPUP) ---
const MadingSection = ({ mading, update, add, remove, isEditMode, onItemClick, handleUpload }) => {
  return (
    <section id="mading" className="py-24 bg-neutral-100">
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-end mb-12"><div><h2 className="text-4xl font-black text-neutral-900 uppercase">Mading Digital</h2><p className="text-gray-500 mt-2">Informasi terkini seputar akademik dan lomba.</p></div>{isEditMode && <button onClick={add} className="bg-emerald-600 text-white p-3 rounded-full shadow-lg hover:bg-emerald-700"><PlusCircle/></button>}</div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {mading.map((item, idx) => (
            <div key={item.id} onClick={() => onItemClick(item, 'mading')} className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition cursor-pointer group relative">
              <div className="h-64 relative bg-gray-200">
                <img src={item.img} className="w-full h-full object-cover" alt="Mading"/>
                {/* Z-40 untuk label */}
                <div className="absolute top-4 left-4 bg-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider z-40"><EditableText value={item.category || "Info"} onChange={v => { const newList = [...mading]; newList[idx].category = v; update(newList); }} isEditMode={isEditMode} /></div>
                {isEditMode && (<div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition z-30" onClick={e=>e.stopPropagation()}><label className="cursor-pointer bg-white text-black px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2"><Camera size={14}/> Ganti Foto<input type="file" className="hidden" onChange={(e) => handleUpload(e, item.id, 'mading', 'img')} /></label></div>)}
              </div>
              <div className="p-6">
                <p className="text-xs text-gray-400 mb-2 flex items-center gap-1"><Calendar size={12}/> <EditableText value={item.date} onChange={v=>{const l=[...mading];l[idx].date=v;update(l)}} isEditMode={isEditMode}/></p>
                <h3 className="font-bold text-xl mb-2 leading-tight group-hover:text-emerald-600 transition"><EditableText value={item.title} onChange={v=>{const l=[...mading];l[idx].title=v;update(l)}} isEditMode={isEditMode}/></h3>
                {/* DESKRIPSI EDITABLE */}
                <p className="text-sm text-gray-500 line-clamp-2"><EditableText value={item.desc} onChange={v=>{const l=[...mading];l[idx].desc=v;update(l)}} isEditMode={isEditMode}/></p>
                {isEditMode && <button onClick={(e)=>{e.stopPropagation(); remove(item.id)}} className="mt-4 text-red-500 text-xs font-bold uppercase flex items-center gap-1"><Trash2 size={12}/> Hapus</button>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// --- GALLERY SECTION ---
const GallerySection = ({ gallery, update, add, remove, isEditMode, onItemClick, handleUpload }) => {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-end mb-12"><div><h2 className="text-4xl font-black text-neutral-900 uppercase">Galeri Kegiatan</h2><p className="text-gray-500 mt-2">Dokumentasi perjalanan dan kebersamaan kami.</p></div>{isEditMode && <button onClick={add} className="bg-emerald-600 text-white p-3 rounded-full shadow-lg hover:bg-emerald-700"><PlusCircle/></button>}</div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {gallery.map((img, idx) => (
            <div key={img.id} onClick={() => onItemClick(img, 'gallery')} className="bg-neutral-50 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition cursor-pointer group relative border border-neutral-100">
              <div className="h-64 relative bg-gray-200">
                <img src={img.url} className="w-full h-full object-cover transition duration-500 group-hover:scale-105" alt="Gallery"/>
                {/* LABEL Z-40 */}
                <div className="absolute top-4 left-4 bg-emerald-600/90 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider z-40 backdrop-blur-sm"><EditableText value={img.date || "Tanggal"} onChange={v => { const newList = [...gallery]; newList[idx].date = v; update(newList); }} isEditMode={isEditMode} /></div>
                {isEditMode && (<div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition z-30" onClick={e=>e.stopPropagation()}><label className="cursor-pointer bg-white text-black px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2"><Camera size={14}/> Ganti Foto<input type="file" className="hidden" onChange={(e) => handleUpload(e, img.id, 'gallery', 'url')} /></label></div>)}
              </div>
              <div className="p-6">
                <h3 className="font-bold text-xl mb-2 leading-tight text-neutral-900 group-hover:text-emerald-600 transition"><EditableText value={img.title || "Nama Kegiatan"} onChange={v=>{const l=[...gallery];l[idx].title=v;update(l)}} isEditMode={isEditMode}/></h3>
                <p className="text-sm text-gray-500 line-clamp-2"><EditableText value={img.story || "Cerita kegiatan ini..."} onChange={v=>{const l=[...gallery];l[idx].story=v;update(l)}} isEditMode={isEditMode}/></p>
                {isEditMode && <button onClick={(e)=>{e.stopPropagation(); remove(img.id)}} className="mt-4 text-red-500 text-xs font-bold uppercase flex items-center gap-1"><Trash2 size={12}/> Hapus</button>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// --- MERCH SECTION ---
const MerchSection = ({ merch, update, add, remove, isEditMode, handleUpload }) => {
  const formatRupiah = (price) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price.replace(/\D/g, ''));
  const handleBuy = (item) => { const phone = item.waNumber || "628123456789"; const text = `Halo Admin HMS, saya tertarik membeli *${item.name}* seharga ${item.price}. Apakah stok tersedia?`; window.open(`https://wa.me/${phone}?text=${encodeURIComponent(text)}`, '_blank'); };
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-end mb-12"><div><h2 className="text-4xl font-black text-neutral-900 uppercase">HMS Store</h2><p className="text-gray-500 mt-2">Merchandise original.</p></div>{isEditMode && <button onClick={add} className="bg-emerald-600 text-white p-3 rounded-full shadow-lg hover:bg-emerald-700"><PlusCircle/></button>}</div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {merch.map((item, idx) => (
            <div key={item.id} className="group">
              <div className="aspect-square bg-gray-100 rounded-3xl mb-4 relative overflow-hidden">
                <img src={item.img} className="w-full h-full object-cover transition duration-500 group-hover:scale-105" alt={item.name}/>
                {isEditMode && (<label className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition z-20" onClick={e=>e.stopPropagation()}><span className="text-white text-xs font-bold border border-white px-2 py-1 rounded">Upload</span><input type="file" className="hidden" onChange={(e) => handleUpload(e, item.id, 'merch', 'img')} /></label>)}
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-neutral-900 leading-tight"><EditableText value={item.name} onChange={v=>{const l=[...merch];l[idx].name=v;update(l)}} isEditMode={isEditMode}/></h3>
                <p className="text-emerald-600 font-bold"><EditableText value={item.price} onChange={v=>{const l=[...merch];l[idx].price=v;update(l)}} isEditMode={isEditMode}/></p>
                {isEditMode ? (<input placeholder="Nomor WA (62...)" value={item.waNumber || ""} onChange={e=>{const l=[...merch];l[idx].waNumber=e.target.value;update(l)}} className="w-full text-xs p-1 border rounded bg-gray-50"/>) : (<button onClick={() => handleBuy(item)} className="w-full bg-neutral-900 text-white py-2 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-emerald-600 transition flex items-center justify-center gap-2"><Phone size={12}/> Beli Sekarang</button>)}
                {isEditMode && <button onClick={() => remove(item.id)} className="text-red-500 text-xs hover:underline">Hapus Produk</button>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// --- ARCHIVE SECTION ---
const ArchiveSection = ({ archives, update, add, remove, isEditMode, accessCode }) => {
  const [inputCode, setInputCode] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const handleUnlock = (e) => { e.preventDefault(); if (inputCode === accessCode || isEditMode) setUnlocked(true); else alert("Kode akses salah!"); };
  return (
    <section className="py-24 bg-neutral-900 text-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12"><h2 className="text-4xl font-black uppercase mb-4">Arsip Digital</h2><p className="text-neutral-400">Bank tugas dan modul pembelajaran. {isEditMode && <span className="text-emerald-400 font-bold">(Kode Akses Saat Ini: {accessCode})</span>}</p></div>
        {!unlocked && !isEditMode ? (
          <div className="max-w-md mx-auto bg-neutral-800 p-8 rounded-3xl text-center border border-neutral-700">
            <Lock size={48} className="mx-auto text-emerald-500 mb-6"/><h3 className="text-xl font-bold mb-2">Area Terbatas</h3><p className="text-sm text-neutral-400 mb-6">Masukkan kode akses angkatan untuk membuka arsip.</p>
            <form onSubmit={handleUnlock} className="flex gap-2"><input type="text" placeholder="Masukkan Kode..." className="flex-1 bg-black/50 border border-neutral-600 rounded-xl px-4 py-3 text-center font-bold tracking-widest uppercase focus:border-emerald-500 outline-none" value={inputCode} onChange={e=>setInputCode(e.target.value.toUpperCase())}/><button className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 rounded-xl font-bold"><ChevronRight/></button></form>
          </div>
        ) : (
          <div className="animate-fade-in">
             {isEditMode && <div className="text-center mb-8"><button onClick={add} className="bg-emerald-600 px-6 py-2 rounded-full font-bold text-sm flex items-center gap-2 mx-auto"><PlusCircle size={16}/> Tambah Modul</button></div>}
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">{archives.map((item, idx) => (<div key={item.id} className="flex items-center justify-between p-4 bg-neutral-800 rounded-2xl border border-neutral-700 hover:border-emerald-500 transition group"><div className="flex items-center gap-4 overflow-hidden"><div className="bg-emerald-500/10 p-3 rounded-xl text-emerald-500"><Folder size={20}/></div><div className="min-w-0"><h4 className="font-bold truncate"><EditableText value={item.title} onChange={v=>{const l=[...archives];l[idx].title=v;update(l)}} isEditMode={isEditMode}/></h4><p className="text-xs text-neutral-500 uppercase tracking-wider"><EditableText value={item.category} onChange={v=>{const l=[...archives];l[idx].category=v;update(l)}} isEditMode={isEditMode}/></p></div></div><div className="flex items-center gap-2">{isEditMode ? (<input placeholder="Link GDrive..." value={item.link || ""} onChange={e=>{const l=[...archives];l[idx].link=e.target.value;update(l)}} className="text-xs bg-black p-1 rounded border border-neutral-600 w-32"/>) : (<a href={item.link || "#"} target="_blank" rel="noreferrer" className="bg-white text-black px-4 py-2 rounded-xl text-xs font-bold hover:bg-emerald-400 transition">Buka Drive</a>)}{isEditMode && <button onClick={()=>remove(item.id)} className="text-red-500 p-2"><Trash2 size={16}/></button>}</div></div>))}</div>
          </div>
        )}
      </div>
    </section>
  );
};

// --- POPUP MODAL ---
const PopupModal = ({ isOpen, onClose, item, type, isEditMode, update }) => {
  if (!isOpen || !item) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl relative" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 z-10 bg-black/20 hover:bg-black/50 text-white p-2 rounded-full"><X size={20}/></button>
        <div className="h-64 bg-gray-200 relative">
          <img src={item.img || item.url || item.headImg} className="w-full h-full object-cover" alt="Detail"/>
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
          <div className="absolute bottom-6 left-8 text-white">
             <h3 className="text-3xl font-black uppercase leading-tight">{type === 'mading' ? item.title : type === 'gallery' ? (item.title || "Dokumentasi") : type === 'tm' || type === 'bpo' ? item.name : item.title}</h3>
             <p className="text-emerald-300 font-bold tracking-widest text-xs mt-2 uppercase">{type === 'mading' ? item.category : type === 'gallery' ? item.date : type === 'tm' || type === 'bpo' ? item.role : "Detail"}</p>
          </div>
        </div>
        <div className="p-8 max-h-[50vh] overflow-y-auto">
          {type === 'mading' && (<div className="prose prose-sm max-w-none"><p className="text-gray-500 text-sm font-bold mb-2">Informasi Lengkap:</p><EditableText value={item.detail || item.desc} onChange={v => update(item.id, 'detail', v)} isEditMode={isEditMode} type="textarea" className="text-gray-800 leading-relaxed text-lg"/></div>)}
          {type === 'gallery' && (<div><div className="flex gap-4 mb-4"><input className="flex-1 border-b p-2 font-bold" value={item.title || ""} onChange={e=>update(item.id, 'title', e.target.value)} disabled={!isEditMode} placeholder="Judul Kegiatan"/><input className="w-32 border-b p-2 text-sm" value={item.date || ""} onChange={e=>update(item.id, 'date', e.target.value)} disabled={!isEditMode} placeholder="Tanggal"/></div><p className="text-gray-500 text-xs font-bold uppercase mb-2">Cerita Kegiatan:</p><EditableText value={item.story || "Tuliskan cerita menarik tentang kegiatan ini..."} onChange={v => update(item.id, 'story', v)} isEditMode={isEditMode} type="textarea" className="text-gray-700 leading-relaxed"/></div>)}
          {(type === 'tm' || type === 'bpo') && (<div><h4 className="font-bold text-lg mb-2 flex items-center gap-2"><Users size={18} className="text-emerald-600"/> Biografi Singkat</h4><div className="text-gray-600 leading-relaxed text-sm"><EditableText value={item.bio || "Belum ada deskripsi."} onChange={(v) => update(item.id, 'bio', v)} isEditMode={isEditMode} type="textarea" className="w-full min-h-[100px] text-gray-800"/></div></div>)}
          {type === 'dept' && (<div className="space-y-6"><div><p className="text-xs font-bold text-gray-400 uppercase mb-1">Nama Lengkap</p><p className="font-bold text-xl">{item.full}</p></div><div><h4 className="font-bold text-lg mb-2 flex items-center gap-2"><Target size={18} className="text-emerald-600"/> Program Kerja Unggulan</h4><div className="text-gray-600 leading-relaxed text-sm"><EditableText value={item.program} onChange={(v) => update(item.id, 'program', v)} isEditMode={isEditMode} type="textarea" className="w-full min-h-[100px] text-gray-800"/></div></div><div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200"><img src={item.headImg} className="w-12 h-12 rounded-full object-cover" alt="Kadep"/><div><p className="text-xs text-emerald-600 font-bold uppercase">{item.headLabel || "KADEP"}</p><p className="font-bold text-sm">{item.headName}</p></div></div></div>)}
          {isEditMode && <p className="mt-8 text-center text-xs text-red-400 font-bold bg-red-50 p-2 rounded">Mode Edit Aktif: Klik teks untuk mengubah.</p>}
        </div>
      </div>
    </div>
  );
};

// --- HERO SECTION ---
const Hero = ({ data, update, isEditMode, handleSingleUpload }) => {
  if (!data) return null;
  return (
    <section className="relative h-[85vh] flex items-center justify-center text-white bg-black overflow-hidden">
      <img src={data.bgImage} className="absolute inset-0 w-full h-full object-cover opacity-50 scale-105" alt="Hero"/>
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black"></div>
      {isEditMode && (<div className="absolute top-24 right-6 z-30"><label className="cursor-pointer bg-black/80 text-white px-4 py-2 rounded-full text-xs font-bold border border-white/20 flex items-center gap-2 hover:bg-emerald-600 transition"><Camera size={14}/> Ganti Background<input type="file" className="hidden" onChange={(e) => handleSingleUpload(e, 'hero', 'bgImage')} /></label></div>)}
      <div className="relative z-10 text-center px-6 max-w-4xl"><div className="inline-block px-6 py-1 border border-emerald-500 text-emerald-400 text-xs font-bold tracking-[0.3em] mb-8 rounded-full uppercase bg-emerald-900/20 backdrop-blur-sm"><EditableText value={data.tagline} onChange={v=>update({...data, tagline:v})} isEditMode={isEditMode}/></div><h1 className="text-6xl md:text-9xl font-black block mb-6 leading-none tracking-tight uppercase"><EditableText value={data.title} onChange={v=>update({...data, title:v})} isEditMode={isEditMode}/></h1><p className="text-xl md:text-2xl opacity-90 max-w-2xl mx-auto leading-relaxed"><EditableText value={data.desc} onChange={v=>update({...data, desc:v})} isEditMode={isEditMode} type="textarea"/></p></div>
    </section>
  );
};

// --- PROFILE SECTION ---
const Profile = ({ data, update, isEditMode, handleSingleUpload }) => {
  if (!data) return null;
  return (
    <section className="py-32 bg-white">
      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
        <div className="relative group"><div className="absolute -inset-4 bg-emerald-500/10 rounded-[3rem] -z-10 group-hover:bg-emerald-500/20 transition-all"></div><div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl h-[500px]"><img src={data.img} className="w-full h-full object-cover" alt="Profile"/>{isEditMode && (<label className="absolute inset-0 bg-black/50 flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition"><span className="bg-white text-black px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2"><Camera size={14}/> Ganti Foto</span><input type="file" className="hidden" onChange={(e) => handleSingleUpload(e, 'profile', 'img')} /></label>)}</div></div>
        <div><h2 className="text-5xl font-black mb-8 text-neutral-900 border-l-[12px] border-emerald-600 pl-8 uppercase tracking-tighter"><EditableText value={data.title} onChange={v=>update({...data, title:v})} isEditMode={isEditMode}/></h2><div className="text-gray-600 text-xl leading-relaxed space-y-6"><EditableText value={data.desc} onChange={v=>update({...data, desc:v})} isEditMode={isEditMode} type="textarea"/></div></div>
      </div>
    </section>
  );
};

// --- SOCIAL SECTION ---
const SocialSection = ({ data, update, isEditMode }) => (
  <section className="py-24 bg-neutral-950 text-white">
    <div className="container mx-auto px-6 flex flex-col lg:flex-row items-center justify-between gap-16">
      <div className="lg:w-1/2">
        <h2 className="text-5xl font-black mb-8 flex items-center gap-6 tracking-tighter uppercase"><PlayCircle className="text-emerald-500" size={64}/> Pojok Kreasi</h2>
        <p className="text-2xl text-neutral-400 mb-12 font-medium italic leading-relaxed"><EditableText value={data.caption} onChange={v=>update({...data, caption:v})} isEditMode={isEditMode} type="textarea"/></p>
        
        {/* SOCIAL ICONS (CLEAN) */}
        <div className="flex gap-6 mt-8">
          {data.instagram && <a href={data.instagram} target="_blank" rel="noreferrer" className="p-4 bg-neutral-800 rounded-full hover:bg-emerald-600 text-white transition-all transform hover:scale-110 shadow-lg border border-neutral-700"><Instagram size={32}/></a>}
          {data.twitter && <a href={data.twitter} target="_blank" rel="noreferrer" className="p-4 bg-neutral-800 rounded-full hover:bg-emerald-600 text-white transition-all transform hover:scale-110 shadow-lg border border-neutral-700"><Twitter size={32}/></a>}
          {data.youtube && <a href={data.youtube} target="_blank" rel="noreferrer" className="p-4 bg-neutral-800 rounded-full hover:bg-emerald-600 text-white transition-all transform hover:scale-110 shadow-lg border border-neutral-700"><Youtube size={32}/></a>}
        </div>

        {/* EDIT ONLY: INPUT FIELDS */}
        {isEditMode && (
          <div className="mt-8 p-6 bg-neutral-900 border border-emerald-500/50 rounded-2xl">
            <p className="text-xs font-bold text-emerald-500 mb-4 uppercase tracking-widest flex items-center gap-2"><Sparkles size={14}/> Edit Link Sosmed:</p>
            <div className="space-y-3">
              <input value={data.instagram} onChange={e=>update({...data, instagram:e.target.value})} className="w-full bg-black p-3 rounded-lg border border-neutral-700 text-xs text-white focus:border-emerald-500 outline-none" placeholder="Link Instagram"/>
              <input value={data.twitter} onChange={e=>update({...data, twitter:e.target.value})} className="w-full bg-black p-3 rounded-lg border border-neutral-700 text-xs text-white focus:border-emerald-500 outline-none" placeholder="Link Twitter"/>
              <input value={data.youtube} onChange={e=>update({...data, youtube:e.target.value})} className="w-full bg-black p-3 rounded-lg border border-neutral-700 text-xs text-white focus:border-emerald-500 outline-none" placeholder="Link YouTube"/>
              <p className="text-xs font-bold text-emerald-500 mt-4 mb-2 uppercase">Link TikTok (Video Embed):</p>
              <input value={data.tiktokUrl} onChange={e=>update({...data, tiktokUrl:e.target.value})} className="w-full bg-black p-3 rounded-lg border border-neutral-700 text-xs text-white focus:border-emerald-500 outline-none"/>
            </div>
          </div>
        )}
      </div>
      <div className="lg:w-1/2 flex justify-center w-full relative"><div className="absolute inset-0 bg-emerald-500 blur-[150px] opacity-20 -z-10"></div><SimpleTikTokEmbed url={data.tiktokUrl} /></div>
    </div>
  </section>
);

// --- TOP MANAGEMENT & BPO (WITH UPLOAD) ---
const Structure = ({ bph, bpo, updateBPH, updateBPO, isEditMode, onItemClick, handleUpload, titles, updateTitles }) => (
  <section className="py-32 bg-neutral-50">
    <div className="container mx-auto px-6">
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-16">
        <div><div className="text-center mb-12"><p className="text-emerald-600 font-black tracking-[0.4em] text-xs uppercase mb-2"><EditableText value={titles?.bphSubtitle || "Executive Board"} onChange={v=>updateTitles('bphSubtitle', v)} isEditMode={isEditMode}/></p><h2 className="text-4xl font-black text-neutral-900 uppercase tracking-tighter"><EditableText value={titles?.bphTitle || "Badan Pengurus Harian"} onChange={v=>updateTitles('bphTitle', v)} isEditMode={isEditMode}/></h2>{isEditMode && <button onClick={() => updateBPH([...bph, {id: Date.now(), role: "Jabatan", name: "Nama", bio: "Bio", img: "https://via.placeholder.com/400"}])} className="mt-4 bg-emerald-600 text-white px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 mx-auto"><PlusCircle size={14}/> Tambah Staff BPH</button>}</div><div className="grid grid-cols-1 sm:grid-cols-2 gap-8">{bph.map((member, idx) => (<div key={member.id} onClick={() => onItemClick(member, 'tm')} className="bg-white rounded-[2rem] overflow-hidden shadow-xl border border-neutral-100 group transition-all hover:-translate-y-2 cursor-pointer"><div className="relative h-64"><img src={member.img} className="w-full h-full object-cover" alt={member.name}/>{isEditMode && (<div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition z-30" onClick={e=>e.stopPropagation()}><label className="cursor-pointer bg-white text-black px-3 py-1 rounded-full text-[10px] font-bold flex items-center gap-1"><Camera size={12}/> Ganti<input type="file" className="hidden" onChange={(e) => handleUpload(e, member.id, 'topManagement', 'img')} /></label><button onClick={(e) => { e.stopPropagation(); updateBPH(bph.filter(m => m.id !== member.id)); }} className="ml-2 bg-red-600 text-white p-2 rounded-full"><Trash2 size={12}/></button></div>)}</div><div className="p-6 text-center"><EditableText value={member.role} onChange={v => { const l=[...bph];l[idx].role=v;updateBPH(l) }} isEditMode={isEditMode} className="text-emerald-600 font-bold text-[10px] uppercase tracking-widest mb-1 block"/><EditableText value={member.name} onChange={v => { const l=[...bph];l[idx].name=v;updateBPH(l) }} isEditMode={isEditMode} className="text-lg font-black text-neutral-900 block leading-tight uppercase"/></div></div>))}</div></div>
        <div><div className="text-center mb-12"><p className="text-emerald-600 font-black tracking-[0.4em] text-xs uppercase mb-2"><EditableText value={titles?.bpoSubtitle || "Supervisory Board"} onChange={v=>updateTitles('bpoSubtitle', v)} isEditMode={isEditMode}/></p><h2 className="text-4xl font-black text-neutral-900 uppercase tracking-tighter"><EditableText value={titles?.bpoTitle || "Badan Pengawas Organisasi"} onChange={v=>updateTitles('bpoTitle', v)} isEditMode={isEditMode}/></h2>{isEditMode && <button onClick={() => updateBPO([...(bpo || []), {id: Date.now(), role: "Pengawas", name: "Nama", bio: "Bio", img: "https://via.placeholder.com/400"}])} className="mt-4 bg-emerald-600 text-white px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 mx-auto"><PlusCircle size={14}/> Tambah Anggota BPO</button>}</div><div className="grid grid-cols-1 sm:grid-cols-2 gap-8">{(bpo || []).map((member, idx) => (<div key={member.id} onClick={() => onItemClick(member, 'bpo')} className="bg-white rounded-[2rem] overflow-hidden shadow-xl border-l-4 border-emerald-500 group transition-all hover:-translate-y-2 cursor-pointer"><div className="relative h-48"><img src={member.img} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" alt={member.name}/>{isEditMode && (<div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition z-30" onClick={e=>e.stopPropagation()}><label className="cursor-pointer bg-white text-black px-3 py-1 rounded-full text-[10px] font-bold flex items-center gap-1"><Camera size={12}/> Ganti<input type="file" className="hidden" onChange={(e) => handleUpload(e, member.id, 'bpo', 'img')} /></label><button onClick={(e) => { e.stopPropagation(); updateBPO(bpo.filter(m => m.id !== member.id)); }} className="ml-2 bg-red-600 text-white p-2 rounded-full"><Trash2 size={12}/></button></div>)}</div><div className="p-6 text-center"><EditableText value={member.role} onChange={v => { const l=[...bpo];l[idx].role=v;updateBPO(l) }} isEditMode={isEditMode} className="text-emerald-600 font-bold text-[10px] uppercase tracking-widest mb-1 block"/><EditableText value={member.name} onChange={v => { const l=[...bpo];l[idx].name=v;updateBPO(l) }} isEditMode={isEditMode} className="text-lg font-black text-neutral-900 block leading-tight uppercase"/></div></div>))}</div></div>
      </div>
    </div>
  </section>
);

// --- DEPARTMENTS (WITH UPLOAD) ---
const Departments = ({ list, update, isEditMode, onItemClick, handleUpload }) => (
  <section className="py-32 bg-white">
    <div className="container mx-auto px-6">
      <div className="flex items-end justify-between mb-20">
        <div><p className="text-emerald-600 font-black tracking-[0.4em] text-xs uppercase mb-2">Internal Org</p><h2 className="text-5xl font-black text-neutral-900 uppercase tracking-tighter">Struktur Departemen</h2></div>
        {isEditMode && <button onClick={() => update([...list, {id: Date.now(), title: "NEW", full: "New Dept", program: "None", headName: "Head", headImg: "https://via.placeholder.com/400"}])} className="bg-emerald-600 text-white p-4 rounded-full shadow-2xl hover:bg-emerald-700 transition"><PlusCircle size={24}/></button>}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {list.map((dept, idx) => (
          <div key={idx} onClick={() => onItemClick(dept, 'dept')} className="flex flex-col md:flex-row bg-neutral-950 rounded-[2.5rem] overflow-hidden shadow-2xl hover:shadow-emerald-900/20 transition-all border border-neutral-800 cursor-pointer group">
            <div className="md:w-1/3 relative overflow-hidden">
              <img src={dept.headImg} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" alt={dept.headName}/>
              {isEditMode && (<div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition z-30" onClick={e=>e.stopPropagation()}><label className="cursor-pointer bg-white text-black px-3 py-1 rounded-full text-[10px] font-bold flex items-center gap-1"><Camera size={12}/> Ganti<input type="file" className="hidden" onChange={(e) => handleUpload(e, dept.id, 'departments', 'headImg')} /></label></div>)}
            </div>
            <div className="md:w-2/3 p-12 flex flex-col justify-between text-white">
              <div>
                <div className="flex justify-between items-start mb-6"><EditableText value={dept.title} onChange={v => { const l=[...list];l[idx].title=v;update(l) }} isEditMode={isEditMode} className="text-4xl font-black tracking-tighter text-emerald-500 uppercase"/>{isEditMode && <button onClick={(e) => { e.stopPropagation(); update(list.filter((_, i) => i !== idx)); }} className="text-red-500 hover:text-white p-2"><Trash2 size={20}/></button>}</div>
                <EditableText value={dept.full} onChange={v => { const l=[...list];l[idx].full=v;update(l) }} isEditMode={isEditMode} className="text-xl font-bold block mb-6 text-neutral-200 uppercase tracking-wide"/>
              </div>
              <div className="mt-10 pt-8 border-t border-white/10"><p className="text-[10px] font-bold text-emerald-500 mb-2 uppercase tracking-widest">Kepala Departemen</p><EditableText value={dept.headName} onChange={v => { const l=[...list];l[idx].headName=v;update(l) }} isEditMode={isEditMode} className="font-black text-2xl uppercase tracking-tight"/></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// --- APP UTAMA ---
const App = () => {
  const [data, setData] = useState(defaultData);
  const [user, setUser] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showLogin, setShowLogin] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [supabaseClient, setSupabaseClient] = useState(null);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalType, setModalType] = useState(null);

  // Inisialisasi Supabase
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
    script.async = true;
    script.onload = () => {
      if (window.supabase) {
        try {
          const client = window.supabase.createClient(supabaseConfig.url, supabaseConfig.anonKey);
          setSupabaseClient(client);
          fetchInitialData(client);
          client.auth.onAuthStateChange((event, session) => setUser(session?.user ?? null));
        } catch (err) { setLoading(false); }
      }
    };
    document.body.appendChild(script);
  }, []);

  const fetchInitialData = async (client) => {
    try {
      const { data: content } = await client.from('website_content').select('json_data').eq('id', 1).single();
      if (content) {
        // Merge data untuk memastikan field baru (bpo) terbaca
        setData({ ...defaultData, ...content.json_data, 
          topManagement: content.json_data.topManagement || defaultData.topManagement,
          departments: content.json_data.departments || defaultData.departments,
          bpo: content.json_data.bpo || defaultData.bpo,
          gallery: content.json_data.gallery || defaultData.gallery,
          mading: content.json_data.mading || defaultData.mading
        });
      } else await client.from('website_content').insert([{ id: 1, json_data: defaultData }]);
    } finally { setLoading(false); }
  };

  const handleSave = async () => {
    if (!supabaseClient) return;
    const { error } = await supabaseClient.from('website_content').update({ json_data: data }).eq('id', 1);
    if (!error) { alert("✅ Tersimpan!"); setIsEditMode(false); }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const { error } = await supabaseClient.auth.signInWithPassword({ email, password });
    if (error) alert("Gagal Login"); else setShowLogin(false);
  };

  // UPLOAD UNTUK LIST ITEM (MADING, MERCH, DLL)
  const handleUpload = async (e, id, section, field) => {
    if (!e.target.files[0] || !supabaseClient) return;
    const file = e.target.files[0];
    const fileName = `assets/${section}_${id}_${Date.now()}`;
    const { data: uploadData, error } = await supabaseClient.storage.from('website_assets').upload(fileName, file);
    if (error) { alert("Gagal Upload: Cek bucket 'website_assets'"); return; }
    const { data: urlData } = supabaseClient.storage.from('website_assets').getPublicUrl(uploadData.path);
    const list = [...data[section]];
    const index = list.findIndex(i => i.id === id);
    if (index !== -1) { list[index][field] = urlData.publicUrl; setData({ ...data, [section]: list }); }
  };

  // UPLOAD UNTUK SINGLE OBJECT (LOGO, HERO, PROFILE)
  const handleSingleUpload = async (e, section, field) => {
    if (!e.target.files[0] || !supabaseClient) return;
    const file = e.target.files[0];
    const fileName = `assets/${section}_${field}_${Date.now()}`;
    const { data: uploadData, error } = await supabaseClient.storage.from('website_assets').upload(fileName, file);
    if (error) { alert("Gagal Upload: Cek bucket 'website_assets'"); return; }
    const { data: urlData } = supabaseClient.storage.from('website_assets').getPublicUrl(uploadData.path);
    
    // Update State Khusus
    if (section === 'identity') setData(prev => ({ ...prev, identity: { ...prev.identity, [field]: urlData.publicUrl } }));
    else if (section === 'hero') setData(prev => ({ ...prev, hero: { ...prev.hero, [field]: urlData.publicUrl } }));
    else if (section === 'profile') setData(prev => ({ ...prev, profile: { ...prev.profile, [field]: urlData.publicUrl } }));
  };

  const updateList = (section, newList) => setData({ ...data, [section]: newList });
  const openModal = (item, type) => { setSelectedItem(item); setModalType(type); setModalOpen(true); };

  if (loading) return <div className="h-screen flex items-center justify-center bg-neutral-900 text-emerald-500 font-mono">LOADING...</div>;

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-24">
      <PopupModal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)} 
        item={selectedItem} 
        type={modalType} 
        isEditMode={isEditMode}
        update={(id, field, val) => {
            const listName = modalType === 'tm' ? 'topManagement' : modalType === 'bpo' ? 'bpo' : modalType === 'dept' ? 'departments' : modalType;
            const list = [...data[listName]];
            const idx = list.findIndex(i => i.id === id);
            if (idx !== -1) {
                list[idx][field] = val;
                setData({...data, [listName]: list});
                setSelectedItem({...selectedItem, [field]: val});
            }
        }}
      />

      <nav className="fixed w-full z-50 bg-black/95 text-white py-4 shadow-xl border-b border-emerald-900">
        <div className="container mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="relative group cursor-pointer">
               <img src={data.identity.logoUrl} className="h-10 w-10 bg-white rounded-full p-1" alt="Logo"/>
               {isEditMode && <label className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition"><Camera size={12}/><input type="file" className="hidden" onChange={(e) => handleSingleUpload(e, 'identity', 'logoUrl')} /></label>}
            </div>
            <EditableText value={data.identity.name} onChange={v=>setData({...data, identity:{...data.identity, name:v}})} isEditMode={isEditMode} className="text-xl font-black tracking-tighter uppercase"/>
          </div>
          <div className="flex gap-4">
            {user ? <button onClick={() => supabaseClient.auth.signOut()} className="text-xs bg-red-600 px-4 py-2 rounded-full font-bold">Logout</button> : <button onClick={() => setShowLogin(true)} className="text-xs bg-emerald-600 px-4 py-2 rounded-full font-bold">Admin</button>}
          </div>
        </div>
      </nav>

      <main>
        <Hero data={data.hero} update={v=>setData({...data, hero: v})} isEditMode={isEditMode} handleSingleUpload={handleSingleUpload} />
        <Profile data={data.profile} update={v=>setData({...data, profile: v})} isEditMode={isEditMode} handleSingleUpload={handleSingleUpload} />
        
        {/* NEW STRUCTURE SECTION (BPH + BPO SPLIT) */}
        <Structure 
            list={data.topManagement} 
            bph={data.topManagement}
            bpo={data.bpo || []}
            updateBPH={(newList) => updateList('topManagement', newList)}
            updateBPO={(newList) => updateList('bpo', newList)}
            isEditMode={isEditMode} 
            onItemClick={openModal}
            handleUpload={handleUpload}
            titles={data.sectionTitles}
            updateTitles={(k,v) => setData({...data, sectionTitles: {...data.sectionTitles, [k]: v}})}
        />
        
        <Departments list={data.departments} update={(newList) => updateList('departments', newList)} isEditMode={isEditMode} onItemClick={(item) => openModal(item, 'dept')} handleUpload={handleUpload} />
        
        {/* MABA SECTION (NEW) */}
        <MabaSection data={data} update={(f,v)=>setData({...data, identity:{...data.identity, [f]:v}})} isEditMode={isEditMode} supabase={supabaseClient} />
        
        <OprecSection data={data} update={(f,v)=>setData({...data, identity:{...data.identity, [f]:v}})} isEditMode={isEditMode} supabase={supabaseClient} />
        <MadingSection mading={data.mading} update={(newList) => updateList('mading', newList)} add={() => updateList('mading', [...data.mading, {id: Date.now(), title: "New", date: "Date", category: "Info", img: "https://via.placeholder.com/400"}])} remove={(id) => updateList('mading', data.mading.filter(i => i.id !== id))} isEditMode={isEditMode} onItemClick={(item) => openModal(item, 'mading')} handleUpload={handleUpload} />
        <MerchSection merch={data.merch} update={(newList) => updateList('merch', newList)} add={() => updateList('merch', [...data.merch, {id: Date.now(), name: "Item", price: "0", img: "https://via.placeholder.com/400"}])} remove={(id) => updateList('merch', data.merch.filter(i => i.id !== id))} isEditMode={isEditMode} handleUpload={handleUpload} />
        <ArchiveSection archives={data.archives} update={(newList) => updateList('archives', newList)} add={() => updateList('archives', [...data.archives, {id: Date.now(), title: "Modul", category: "Umum", link: ""}])} remove={(id) => updateList('archives', data.archives.filter(i => i.id !== id))} isEditMode={isEditMode} accessCode={data.identity.archivePassword} updateIdentity={(f, v) => setData({...data, identity: {...data.identity, [f]: v}})} />
        <GallerySection gallery={data.gallery} update={(newList) => updateList('gallery', newList)} add={() => updateList('gallery', [...data.gallery, {id: Date.now(), url: "https://via.placeholder.com/400", title: "Kegiatan", date: "2024"}])} remove={(id) => updateList('gallery', data.gallery.filter(i => i.id !== id))} isEditMode={isEditMode} onItemClick={(item) => openModal(item, 'gallery')} handleUpload={handleUpload} />
        <SocialSection data={data.social || defaultData.social} update={v=>setData({...data, social: v})} isEditMode={isEditMode} />
      </main>

      <footer className="bg-black text-white py-24 border-t border-neutral-900 text-center"><div className="container mx-auto px-6"><div className="flex justify-center items-center gap-4 font-black text-4xl mb-12 uppercase tracking-tighter italic"><img src={data.identity.logoUrl} className="h-16 w-16 bg-white rounded-full p-2" alt="Logo" /><span>{data.identity.name}</span></div><p className="text-neutral-600 text-sm font-medium tracking-wide">&copy; {new Date().getFullYear()} {data.identity.name}. Built with Precision for Engineers. Sipil Jaya!</p></div></footer>

      {showLogin && (<div className="fixed inset-0 bg-black/95 backdrop-blur-xl z-[100] flex items-center justify-center p-4"><form className="bg-white p-12 rounded-[3.5rem] w-full max-w-sm shadow-2xl relative overflow-hidden" onSubmit={handleLogin}><div className="absolute top-0 left-0 w-full h-2 bg-emerald-600"></div><div className="flex justify-center mb-8 text-emerald-600"><Lock size={64}/></div><h3 className="text-3xl font-black mb-8 text-center uppercase tracking-tighter text-neutral-900 leading-none">Akses Admin Cloud</h3><div className="space-y-6"><input required type="email" placeholder="Email Address" className="w-full border-2 border-neutral-100 p-5 rounded-2xl outline-none focus:border-emerald-500 transition bg-neutral-50 font-bold" onChange={e=>setEmail(e.target.value)}/><input required type="password" placeholder="Password" className="w-full border-2 border-neutral-100 p-5 rounded-2xl outline-none focus:border-emerald-500 transition bg-neutral-50 font-bold" onChange={e=>setPassword(e.target.value)}/></div><button className="w-full bg-emerald-600 text-white py-5 rounded-2xl font-black mt-10 hover:bg-emerald-700 transition shadow-xl shadow-emerald-600/30 uppercase tracking-[0.2em] text-sm">Authenticate</button><button type="button" onClick={()=>setShowLogin(false)} className="w-full text-neutral-400 mt-6 text-[10px] font-black uppercase tracking-widest hover:text-red-500 transition">Batal</button></form></div>)}

      {user && (<div className="fixed bottom-10 right-10 z-50 flex gap-4">{isEditMode ? (<div className="flex gap-4"><button onClick={()=>setIsEditMode(false)} className="bg-neutral-200 text-neutral-700 px-8 py-5 rounded-full font-black text-xs uppercase shadow-2xl hover:bg-neutral-300 transition tracking-widest">Batal</button><button onClick={handleSave} className="bg-emerald-600 text-white px-10 py-5 rounded-full font-black flex items-center gap-3 animate-pulse text-xs uppercase shadow-2xl hover:bg-emerald-700 transition tracking-widest"><Save size={20}/> Simpan Perubahan</button></div>) : (<button onClick={()=>setIsEditMode(true)} className="bg-black text-white px-10 py-5 rounded-full font-black flex items-center gap-3 text-xs uppercase shadow-2xl hover:bg-neutral-800 transition border-2 border-emerald-900/50 tracking-widest"><Edit3 size={20}/> Edit Website</button>)}</div>)}
    </div>
  );
};

export default App;