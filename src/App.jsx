import React, { useState, useEffect, useRef } from 'react';
import { initializeApp } from "firebase/app";
import { 
  getFirestore, doc, onSnapshot, updateDoc, setDoc 
} from "firebase/firestore";
import { 
  getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut 
} from "firebase/auth";
import { 
  Building2, Users, BookOpen, Target, Megaphone, 
  Briefcase, Trophy, HeartHandshake, Menu, X, 
  Edit3, Save, LogIn, LogOut, Lock, Loader2, AlertTriangle,
  Image as ImageIcon, Calendar, Trash2, PlusCircle, PlayCircle, ExternalLink,
  Instagram, Twitter, Youtube, Info, Folder, FileText, Download, Key,
  Sparkles, MessageSquare, Send
} from 'lucide-react';

// --- 1. KONFIGURASI FIREBASE ---
const firebaseConfig = {
  apiKey: "AIzaSyDfeagxPddq-m2l9-J4u3KGApMX0ZvOyrA",
  authDomain: "web-hms-untirta.firebaseapp.com",
  projectId: "web-hms-untirta",
  storageBucket: "web-hms-untirta.firebasestorage.app",
  messagingSenderId: "783674762951",
  appId: "1:783674762951:web:2b8d54e25369b9e4e880e2",
  measurementId: "G-VDC47BGQJS"
};

// Inisialisasi Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// --- GEMINI API HELPER ---
const generateWithGemini = async (prompt) => {
  const apiKey = ""; // API Key disediakan oleh lingkungan runtime
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });
    
    if (!response.ok) throw new Error('API Error');
    
    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "Maaf, saya tidak dapat menjawab saat ini.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Terjadi kesalahan koneksi ke AI. Coba lagi nanti.";
  }
};

// --- DATA DEFAULT ---
const defaultData = {
  identity: {
    name: "HMS UNTIRTA",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ag/Logo_Untirta.png/1024px-Logo_Untirta.png",
    archivePassword: "SIPILJAYA" 
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
  archives: [
    { id: 'a1', subject: "Mekanika Teknik", semester: "Semester 1", link: "https://drive.google.com" },
    { id: 'a2', subject: "Matematika Rekayasa", semester: "Semester 2", link: "https://drive.google.com" },
    { id: 'a3', subject: "Struktur Beton", semester: "Semester 3", link: "https://drive.google.com" },
    { id: 'a4', subject: "Ilmu Ukur Tanah", semester: "Semester 2", link: "https://drive.google.com" },
  ],
  gallery: [
    { id: 'g1', title: "Latihan Kepemimpinan 1", date: "Jan 2024", img: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?q=80&w=800&auto=format&fit=crop", story: "Kegiatan ini bertujuan melatih mental dan fisik mahasiswa baru." },
    { id: 'g2', title: "Kunjungan Industri", date: "Feb 2024", img: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=800&auto=format&fit=crop", story: "Melihat langsung proses konstruksi jembatan." },
    { id: 'g3', title: "Sipil Mengabdi", date: "Mar 2024", img: "https://images.unsplash.com/photo-1593113598332-cd288d649433?q=80&w=800&auto=format&fit=crop", story: "Pembangunan MCK dan sarana air bersih." },
  ],
  topManagement: [
    { id: 'tm1', role: "Ketua Umum", name: "Nama Ketua", bio: "Mahasiswa angkatan 2021 yang berfokus pada manajemen konstruksi.", img: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=800&auto=format&fit=crop" },
    { id: 'tm2', role: "Wakil Ketua Umum", name: "Nama Wakil", bio: "Partner strategis dalam pengawasan internal organisasi.", img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800&auto=format&fit=crop" },
    { id: 'tm3', role: "Sekretaris Umum", name: "Nama Sekum", bio: "Bertanggung jawab atas seluruh administrasi.", img: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=800&auto=format&fit=crop" },
    { id: 'tm4', role: "Bendahara Umum", name: "Nama Bendum", bio: "Mengelola sirkulasi keuangan himpunan.", img: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=800&auto=format&fit=crop" },
    { id: 'tm5', role: "Sekretaris 1", name: "Nama Sek 1", bio: "Membantu tugas administrasi eksternal.", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop" },
    { id: 'tm6', role: "Sekretaris 2", name: "Nama Sek 2", bio: "Membantu tugas administrasi internal.", img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=800&auto=format&fit=crop" },
  ],
  departments: [
    { id: 1, title: "BUMH", full: "Badan Usaha Milik Himpunan", program: "Penjualan Merchandise, Kantin Kejujuran.", headName: "KaDept BUMH", headImg: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=400&auto=format&fit=crop", iconType: 'Briefcase' },
    { id: 2, title: "INTERNAL", full: "Departemen Internal", program: "Upgrading Pengurus, Malam Keakraban.", headName: "KaDept Internal", headImg: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop", iconType: 'Users' },
    { id: 3, title: "EKSTERNAL", full: "Departemen Eksternal", program: "Studi Banding, Kunjungan Alumni.", headName: "KaDept Eksternal", headImg: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=400&auto=format&fit=crop", iconType: 'HeartHandshake' },
    { id: 4, title: "KADERISASI", full: "Departemen Kaderisasi", program: "Latihan Kepemimpinan 1 & 2.", headName: "KaDept Kaderisasi", headImg: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?q=80&w=400&auto=format&fit=crop", iconType: 'Target' },
    { id: 5, title: "KESRA", full: "Kesenian & Kerohanian", program: "Sipil Cup, Kajian Rutin.", headName: "KaDept Kesra", headImg: "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=400&auto=format&fit=crop", iconType: 'Trophy' },
    { id: 6, title: "KOMINFO", full: "Komunikasi & Informasi", program: "Pengelolaan Instagram, Website.", headName: "KaDept Kominfo", headImg: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=400&auto=format&fit=crop", iconType: 'Megaphone' },
    { id: 7, title: "PERISTEK", full: "Pengembangan Riset", program: "Pelatihan Software Sipil, Lomba Beton.", headName: "KaDept Peristek", headImg: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&auto=format&fit=crop", iconType: 'BookOpen' }
  ]
};

// --- HELPER & COMPONENTS ---
const EditableText = ({ value, onChange, isEditMode, className, type = "text", placeholder = "Edit..." }) => {
  if (isEditMode) {
    if (type === "textarea") {
      return <textarea value={value} onChange={(e) => onChange(e.target.value)} className={`w-full bg-white/10 border border-emerald-500 rounded p-2 text-inherit focus:ring-2 ring-emerald-400 ${className}`} rows={4}/>;
    }
    return <input type="text" value={value} onChange={(e) => onChange(e.target.value)} className={`w-full bg-white/10 border-b border-emerald-500 text-inherit px-1 ${className}`} placeholder={placeholder}/>;
  }
  return <span className={className}>{value}</span>;
};

const SimpleTikTokEmbed = ({ url, width }) => {
  const videoIdMatch = url.match(/video\/(\d+)/);
  const videoId = videoIdMatch ? videoIdMatch[1] : null;
  if (!videoId) return <div className="h-[500px] bg-neutral-800 flex flex-col items-center justify-center text-gray-500 border border-neutral-700 rounded-xl"><AlertTriangle size={48} className="mb-4 text-yellow-500" /><p className="font-bold">Link tidak valid.</p></div>;
  return (
    <div style={{ width: width || '100%', height: '580px' }} className="bg-black rounded-xl overflow-hidden shadow-2xl relative">
      <iframe src={`https://www.tiktok.com/embed/v2/${videoId}`} style={{ width: '100%', height: '100%', border: 'none' }} title="TikTok" allow="encrypted-media;" sandbox="allow-popups allow-popups-to-escape-sandbox allow-scripts allow-top-navigation allow-same-origin"></iframe>
    </div>
  );
};

// --- COMPONENT: WIDGET AI CHATBOT ---
const AIChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'ai', text: 'Halo! Saya Asisten Sipil Cerdas. Ada yang bisa saya bantu tentang Teknik Sipil atau Info Himpunan?' }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isOpen]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = input;
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput("");
    setIsLoading(true);

    const prompt = `Anda adalah asisten AI cerdas untuk Himpunan Mahasiswa Teknik Sipil (HMS). Jawablah pertanyaan berikut dengan singkat, jelas, dan membantu mahasiswa teknik sipil. Pertanyaan: ${userMsg}`;
    
    const reply = await generateWithGemini(prompt);
    
    setMessages(prev => [...prev, { role: 'ai', text: reply }]);
    setIsLoading(false);
  };

  return (
    <div className="fixed bottom-24 left-6 z-50 flex flex-col items-start font-sans">
      {isOpen && (
        <div className="bg-white border border-gray-200 shadow-2xl rounded-2xl w-80 md:w-96 mb-4 overflow-hidden flex flex-col animate-fade-in-up" style={{maxHeight: '500px'}}>
          <div className="bg-emerald-600 p-4 text-white flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Sparkles size={18} className="text-yellow-300"/>
              <h3 className="font-bold">Asisten Sipil AI</h3>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-emerald-700 p-1 rounded"><X size={16}/></button>
          </div>
          
          <div className="flex-1 p-4 overflow-y-auto bg-gray-50 space-y-3" ref={scrollRef} style={{height: '300px'}}>
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3 rounded-lg text-sm ${m.role === 'user' ? 'bg-emerald-600 text-white rounded-br-none' : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none shadow-sm'}`}>
                  {m.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-200 p-3 rounded-lg text-gray-500 text-xs flex items-center gap-2">
                  <Loader2 size={12} className="animate-spin"/> Mengetik...
                </div>
              </div>
            )}
          </div>

          <form onSubmit={handleSend} className="p-3 bg-white border-t border-gray-200 flex gap-2">
            <input 
              value={input} 
              onChange={e => setInput(e.target.value)} 
              placeholder="Tanya tentang beton, struktur..." 
              className="flex-1 bg-gray-100 border-0 rounded-full px-4 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
            />
            <button type="submit" disabled={isLoading} className="bg-emerald-600 text-white p-2 rounded-full hover:bg-emerald-700 disabled:opacity-50">
              <Send size={16}/>
            </button>
          </form>
        </div>
      )}
      
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="group flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-500 text-white px-4 py-3 rounded-full shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
      >
        <div className="relative">
          <MessageSquare size={20} />
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-yellow-400"></span>
          </span>
        </div>
        <span className="font-bold text-sm hidden group-hover:inline transition-all">Tanya AI</span>
      </button>
    </div>
  );
};

// --- MODIFIED POPUP MODAL (WITH MAGIC WRITE) ---
const PopupModal = ({ isOpen, onClose, item, type, update, isEditMode }) => {
  const [isGenerating, setIsGenerating] = useState(false);

  if (!isOpen || !item) return null;

  // Fungsi Magic Write
  const handleMagicWrite = async (field, context) => {
    if (!isEditMode) return;
    setIsGenerating(true);
    const prompt = `Buatkan deskripsi paragraf singkat, profesional, dan menarik untuk ${context} bernama "${type === 'tm' ? item.name : item.title}" dalam konteks organisasi mahasiswa Teknik Sipil. Gunakan Bahasa Indonesia yang baku namun luwes.`;
    
    const result = await generateWithGemini(prompt);
    update(item.id, field, result);
    setIsGenerating(false);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in" onClick={onClose}>
      <div className="bg-white text-neutral-900 w-full max-w-lg rounded-xl overflow-hidden shadow-2xl relative" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 z-10 bg-black/20 hover:bg-black/50 text-white p-2 rounded-full transition"><X size={20}/></button>
        <div className="h-48 relative bg-neutral-200">
          <img src={item.img || item.headImg} alt="Header" className="w-full h-full object-cover"/>
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
          <div className="absolute bottom-4 left-6 text-white">
            <p className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-1">{type === 'tm' ? item.role : type === 'dept' ? 'Departemen' : item.date}</p>
            <h3 className="text-2xl font-bold leading-none">{type === 'tm' ? item.name : type === 'dept' ? item.title : item.title}</h3>
          </div>
        </div>
        <div className="p-8 max-h-[60vh] overflow-y-auto">
          {type === 'tm' && (
            <div>
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-bold text-lg flex items-center gap-2"><Users size={18} className="text-emerald-600"/> Biografi Singkat</h4>
                {isEditMode && (
                  <button 
                    onClick={() => handleMagicWrite('bio', `seorang pengurus dengan jabatan ${item.role}`)} 
                    disabled={isGenerating}
                    className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded flex items-center gap-1 hover:bg-purple-200 transition"
                  >
                    {isGenerating ? <Loader2 size={10} className="animate-spin"/> : <Sparkles size={10}/>}
                    {isGenerating ? 'Menulis...' : 'Bantu Tulis (AI)'}
                  </button>
                )}
              </div>
              <div className="text-gray-600 leading-relaxed text-sm"><EditableText value={item.bio} onChange={(v) => update(item.id, 'bio', v)} isEditMode={isEditMode} type="textarea" className="w-full min-h-[100px] text-gray-800"/></div>
            </div>
          )}
          {type === 'gallery' && (
            <div>
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-bold text-lg flex items-center gap-2"><ImageIcon size={18} className="text-emerald-600"/> Cerita Kegiatan</h4>
                {isEditMode && (
                  <button 
                    onClick={() => handleMagicWrite('story', `kegiatan mahasiswa berjudul ${item.title}`)} 
                    disabled={isGenerating}
                    className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded flex items-center gap-1 hover:bg-purple-200 transition"
                  >
                    {isGenerating ? <Loader2 size={10} className="animate-spin"/> : <Sparkles size={10}/>}
                    {isGenerating ? 'Menulis...' : 'Bantu Tulis (AI)'}
                  </button>
                )}
              </div>
              <div className="text-gray-600 leading-relaxed text-sm"><EditableText value={item.story} onChange={(v) => update(item.id, 'story', v)} isEditMode={isEditMode} type="textarea" className="w-full min-h-[100px] text-gray-800"/></div>
            </div>
          )}
          {type === 'dept' && (
            <div className="space-y-6">
              <div><p className="text-xs font-bold text-gray-400 uppercase mb-1">Nama Lengkap</p><p className="font-bold text-xl">{item.full}</p></div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-bold text-lg flex items-center gap-2"><Target size={18} className="text-emerald-600"/> Program Kerja Unggulan</h4>
                  {isEditMode && (
                    <button 
                      onClick={() => handleMagicWrite('program', `program kerja departemen ${item.full}`)} 
                      disabled={isGenerating}
                      className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded flex items-center gap-1 hover:bg-purple-200 transition"
                    >
                      {isGenerating ? <Loader2 size={10} className="animate-spin"/> : <Sparkles size={10}/>}
                      {isGenerating ? 'Menulis...' : 'Bantu Tulis (AI)'}
                    </button>
                  )}
                </div>
                <div className="text-gray-600 leading-relaxed text-sm"><EditableText value={item.program} onChange={(v) => update(item.id, 'program', v)} isEditMode={isEditMode} type="textarea" className="w-full min-h-[100px] text-gray-800"/></div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200"><img src={item.headImg} className="w-12 h-12 rounded-full object-cover" alt="Kadep"/><div><p className="text-xs text-emerald-600 font-bold uppercase">Kepala Departemen</p><p className="font-bold text-sm">{item.headName}</p></div></div>
            </div>
          )}
          {isEditMode && (<p className="mt-6 text-[10px] text-red-500 italic bg-red-50 p-2 rounded text-center">Mode Edit Aktif: Ketik langsung di teks atau gunakan tombol AI.</p>)}
        </div>
      </div>
    </div>
  );
};

// --- KOMPONEN ARSIP / BANK TUGAS ---
const ArchiveSection = ({ data, archives, update, updateList, add, remove, isEditMode }) => {
  const [accessCode, setAccessCode] = useState("");
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleUnlock = (e) => {
    e.preventDefault();
    if (accessCode === data.identity.archivePassword || isEditMode) {
      setIsUnlocked(true);
      setErrorMsg("");
    } else {
      setErrorMsg("Kode akses salah.");
    }
  };

  return (
    <section id="archives" className="py-24 bg-gray-50 text-neutral-900 border-t border-gray-200">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 flex items-center justify-center gap-3">
            <Folder className="text-emerald-600" size={32}/> Bank Tugas & Arsip
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Kumpulan soal, modul, dan referensi tugas untuk mahasiswa Teknik Sipil UNTIRTA.
            Area ini bersifat <span className="font-bold text-emerald-600">Eksklusif</span>.
          </p>
        </div>

        {/* GATEKEEPER */}
        {!isUnlocked && !isEditMode ? (
          <div className="max-w-md mx-auto bg-white p-8 rounded-xl shadow-lg border border-gray-200 text-center">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Lock className="text-emerald-600" size={32}/>
            </div>
            <h3 className="font-bold text-xl mb-2">Akses Terbatas</h3>
            <p className="text-sm text-gray-500 mb-6">Masukkan kode akses angkatan untuk membuka arsip.</p>
            <form onSubmit={handleUnlock} className="space-y-4">
              <input 
                type="text" 
                placeholder="Masukkan Kode Akses..." 
                className="w-full border border-gray-300 p-3 rounded text-center font-mono uppercase tracking-widest focus:border-emerald-500 outline-none"
                value={accessCode}
                onChange={(e) => setAccessCode(e.target.value.toUpperCase())}
              />
              {errorMsg && <p className="text-red-500 text-xs font-bold">{errorMsg}</p>}
              <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded transition">
                BUKA ARSIP
              </button>
            </form>
          </div>
        ) : (
          <div className="animate-fade-in">
            {isEditMode && (
              <div className="mb-8 p-4 bg-yellow-50 border border-yellow-200 rounded flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                  <p className="font-bold text-sm text-yellow-800 mb-1 flex items-center gap-2"><Key size={16}/> SETTING KODE AKSES:</p>
                  <input 
                    value={data.identity?.archivePassword} 
                    onChange={(e) => update('archivePassword', e.target.value)} 
                    className="bg-white border border-yellow-400 p-2 rounded text-sm font-mono"
                  />
                </div>
                <button onClick={add} className="bg-emerald-600 text-white px-4 py-2 rounded font-bold text-sm flex items-center gap-2"><PlusCircle size={16}/> Tambah Matkul</button>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {archives.map((item) => (
                <div key={item.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:border-emerald-500 hover:shadow-md transition group">
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg">
                      <FileText size={24}/>
                    </div>
                    {isEditMode && <button onClick={() => remove(item.id)} className="text-red-400 hover:text-red-600"><Trash2 size={16}/></button>}
                  </div>
                  
                  <h4 className="font-bold text-lg mb-1 group-hover:text-emerald-600 transition">
                    <EditableText value={item.subject} onChange={(v) => updateList(item.id, 'subject', v)} isEditMode={isEditMode}/>
                  </h4>
                  <p className="text-xs text-gray-400 uppercase tracking-wider mb-6">
                    <EditableText value={item.semester} onChange={(v) => updateList(item.id, 'semester', v)} isEditMode={isEditMode}/>
                  </p>
                  
                  {isEditMode ? (
                    <div className="mt-4">
                      <p className="text-[10px] font-bold text-gray-400 mb-1">LINK GOOGLE DRIVE:</p>
                      <input 
                        value={item.link} 
                        onChange={(e) => updateList(item.id, 'link', e.target.value)} 
                        className="w-full text-xs border p-1 rounded bg-gray-50 text-blue-600"
                      />
                    </div>
                  ) : (
                    <a href={item.link} target="_blank" rel="noreferrer" className="block w-full text-center bg-neutral-900 hover:bg-emerald-600 text-white py-2 rounded text-sm font-bold transition flex items-center justify-center gap-2">
                      <Download size={16}/> Akses Drive
                    </a>
                  )}
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
  const [showLogin, setShowLogin] = useState(false);
  
  // STATE MODAL
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalType, setModalType] = useState(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  useEffect(() => {
    const unsubData = onSnapshot(doc(db, "website", "content"), (docSnap) => {
      if (docSnap.exists()) {
        setData(prev => ({ ...defaultData, ...docSnap.data() }));
      } else {
        setDoc(doc(db, "website", "content"), defaultData).catch(err => console.error(err));
      }
      setLoading(false);
    }, (error) => {
      console.error("Error:", error);
      setLoading(false);
    });

    const unsubAuth = onAuthStateChanged(auth, (u) => {
      setUser(u);
      if (!u) setIsEditMode(false);
    });

    return () => { unsubData(); unsubAuth(); };
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setShowLogin(false);
      setLoginError("");
      setEmail(""); setPassword("");
    } catch (error) {
      setLoginError("Login gagal.");
    }
  };

  const saveDataToCloud = async () => {
    if (!user) return;
    try {
      await updateDoc(doc(db, "website", "content"), data);
      setIsEditMode(false);
      alert("✅ Data Berhasil Disimpan!");
    } catch (error) {
      if (error.code === 'permission-denied') alert("⛔ GAGAL: Cek Firestore Rules!");
      else alert("Error: " + error.message);
    }
  };

  // Updaters
  const updateIdentity = (f, v) => setData({...data, identity: {...data.identity, [f]: v}});
  const updateHero = (f, v) => setData({...data, hero: {...data.hero, [f]: v}});
  const updateProfile = (f, v) => setData({...data, profile: {...data.profile, [f]: v}});
  const updateSocial = (f, v) => setData({...data, social: {...data.social, [f]: v}});

  const updateTM = (id, f, v) => {
    setData(prev => ({...prev, topManagement: prev.topManagement.map(i => i.id === id ? {...i, [f]: v} : i)}));
    if (selectedItem && selectedItem.id === id) setSelectedItem(prev => ({...prev, [f]: v}));
  };
  const updateDept = (id, f, v) => {
    setData(prev => ({...prev, departments: prev.departments.map(i => i.id === id ? {...i, [f]: v} : i)}));
    if (selectedItem && selectedItem.id === id) setSelectedItem(prev => ({...prev, [f]: v}));
  };
  const updateGallery = (id, f, v) => {
    setData(prev => ({...prev, gallery: prev.gallery.map(i => i.id === id ? {...i, [f]: v} : i)}));
    if (selectedItem && selectedItem.id === id) setSelectedItem(prev => ({...prev, [f]: v}));
  };
  const updateArchiveList = (id, f, v) => {
    const currentArchives = data.archives || [];
    setData({...data, archives: currentArchives.map(i => i.id === id ? {...i, [f]: v} : i)});
  };

  const addArchiveItem = () => {
    const newId = 'a' + Date.now();
    const newItem = { id: newId, subject: "Mata Kuliah Baru", semester: "Semester X", link: "https://drive.google.com" };
    setData({...data, archives: [...(data.archives || []), newItem]});
  };
  const deleteArchiveItem = (id) => {
    if (window.confirm("Hapus mata kuliah ini?")) setData({...data, archives: data.archives.filter(i => i.id !== id)});
  };
  const addGalleryItem = () => {
    const newId = 'g' + Date.now();
    const newItem = { id: newId, title: "Nama Kegiatan", date: "Bulan 2024", img: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?q=80&w=800&auto=format&fit=crop", story: "Cerita kegiatan..." };
    setData({...data, gallery: [...(data.gallery || []), newItem]});
  };
  const deleteGalleryItem = (id) => {
    if (window.confirm("Hapus foto ini?")) setData({...data, gallery: data.gallery.filter(i => i.id !== id)});
  };

  const openModal = (item, type) => {
    setSelectedItem(item);
    setModalType(type);
    setModalOpen(true);
  };

  if (loading) return <div className="h-screen flex items-center justify-center bg-black text-emerald-500"><Loader2 className="animate-spin mr-2"/> Memuat Data...</div>;

  const logoUrl = data.identity?.logoUrl || defaultData.identity.logoUrl;
  const orgName = data.identity?.name || defaultData.identity.name;

  return (
    <div className="font-sans bg-gray-50 text-neutral-900 scroll-smooth pb-20">
      <PopupModal isOpen={modalOpen} onClose={() => setModalOpen(false)} item={selectedItem} type={modalType} update={modalType === 'tm' ? updateTM : modalType === 'dept' ? updateDept : updateGallery} isEditMode={isEditMode}/>
      
      {/* WIDGET AI DI POJOK KIRI BAWAH */}
      <AIChatWidget />

      <nav className="fixed w-full z-40 bg-black/95 py-4 shadow-lg border-b border-emerald-900">
        <div className="container mx-auto px-6 flex justify-between items-center text-white">
          <div className="flex items-center gap-3 font-bold text-2xl tracking-tighter">
            <div className="relative group">
              <img src={logoUrl} alt="Logo" className="h-10 w-10 object-contain bg-white rounded-full p-1" />
              {isEditMode && <div className="absolute top-12 left-0 w-64 bg-black p-2 rounded border border-emerald-500 z-50"><p className="text-[10px] text-emerald-400 mb-1">GANTI URL LOGO:</p><input value={logoUrl} onChange={(e) => updateIdentity('logoUrl', e.target.value)} className="w-full text-xs p-1 text-black rounded"/></div>}
            </div>
            <div className="flex flex-col md:flex-row md:items-center"><EditableText value={orgName} onChange={(v) => updateIdentity('name', v)} isEditMode={isEditMode} className="text-white hover:text-emerald-400 transition"/></div>
          </div>
          <div className="flex items-center gap-4">
            <a href="#archives" className="hidden md:flex items-center gap-2 text-sm font-bold text-emerald-400 hover:text-white transition bg-emerald-900/30 px-3 py-1 rounded border border-emerald-900"><Folder size={14}/> BANK TUGAS</a>
            {user ? <button onClick={() => signOut(auth)} className="text-xs bg-red-900/80 px-3 py-1.5 rounded hover:bg-red-800 font-bold flex gap-2"><LogOut size={14}/> Logout</button> : <button onClick={() => setShowLogin(true)} className="text-xs bg-emerald-900/50 px-3 py-1.5 rounded hover:bg-emerald-800 font-bold border border-emerald-800 flex gap-2"><LogIn size={14}/> Admin</button>}
          </div>
        </div>
      </nav>

      <Hero data={data.hero} update={updateHero} isEditMode={isEditMode} />
      <Profile data={data.profile} update={updateProfile} isEditMode={isEditMode} />
      <SocialSection data={data.social || defaultData.social} update={updateSocial} isEditMode={isEditMode} />
      <ArchiveSection data={data} archives={data.archives || []} update={updateIdentity} updateList={updateArchiveList} add={addArchiveItem} remove={deleteArchiveItem} isEditMode={isEditMode} />
      <ActivityGallery list={data.gallery || []} update={updateGallery} add={addGalleryItem} remove={deleteGalleryItem} isEditMode={isEditMode} onItemClick={(item) => openModal(item, 'gallery')} />
      <Structure list={data.topManagement} update={updateTM} isEditMode={isEditMode} onItemClick={(item) => openModal(item, 'tm')} />
      <Departments list={data.departments} update={updateDept} isEditMode={isEditMode} onItemClick={(item) => openModal(item, 'dept')} />
      
      <footer className="bg-black text-white py-12 border-t border-emerald-900">
        <div className="container mx-auto px-6 text-center">
          <div className="flex justify-center items-center gap-3 font-bold text-2xl tracking-tighter mb-6 opacity-80"><img src={logoUrl} alt="Logo" className="h-10 w-10 object-contain bg-white rounded-full p-1 grayscale hover:grayscale-0 transition" /><span>{orgName}</span></div>
          <div className="flex justify-center gap-6 mb-8"><a href={data.social?.instagram || "#"} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-emerald-500 transition"><Instagram size={24}/></a><a href={data.social?.twitter || "#"} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-emerald-500 transition"><Twitter size={24}/></a><a href={data.social?.youtube || "#"} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-emerald-500 transition"><Youtube size={24}/></a></div>
          <p className="text-gray-600 text-sm">&copy; {new Date().getFullYear()} {orgName}. Built for future engineers.</p>
        </div>
      </footer>

      {showLogin && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-neutral-900 p-8 rounded border border-emerald-900 w-full max-w-md relative">
            <button onClick={() => setShowLogin(false)} className="absolute top-4 right-4 text-gray-500 hover:text-white"><X size={20}/></button>
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2"><Lock className="text-emerald-500"/> Admin Access</h3>
            <form onSubmit={handleLogin} className="space-y-4"><input type="email" placeholder="Email" required value={email} onChange={e=>setEmail(e.target.value)} className="w-full bg-black border border-gray-700 p-3 rounded text-white focus:border-emerald-500 outline-none"/><input type="password" placeholder="Password" required value={password} onChange={e=>setPassword(e.target.value)} className="w-full bg-black border border-gray-700 p-3 rounded text-white focus:border-emerald-500 outline-none"/>{loginError && <div className="text-red-400 text-sm flex gap-2"><AlertTriangle size={16}/> {loginError}</div>}<button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-3 rounded font-bold mt-4">MASUK</button></form>
          </div>
        </div>
      )}

      {user && (
        <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-3 items-end">
          {isEditMode ? (<><div className="bg-neutral-900 text-emerald-400 text-xs p-3 rounded border border-emerald-900 shadow-xl mb-1"><p className="font-bold">MODE EDIT AKTIF</p>Klik teks/gambar untuk edit.</div><div className="flex gap-2"><button onClick={() => setIsEditMode(false)} className="bg-neutral-700 text-white px-4 py-3 rounded-full font-bold shadow-lg">Batal</button><button onClick={saveDataToCloud} className="bg-emerald-600 text-white px-6 py-3 rounded-full font-bold shadow-lg flex gap-2 animate-pulse"><Save size={18}/> SIMPAN PERUBAHAN</button></div></>) : (<button onClick={() => setIsEditMode(true)} className="bg-black text-white border border-emerald-900 px-6 py-3 rounded-full font-bold shadow-lg flex gap-2 hover:bg-emerald-900"><Edit3 size={18}/> Edit Website</button>)}
        </div>
      )}
    </div>
  );
};

// --- RESTORED MISSING COMPONENTS ---

const Hero = ({ data, update, isEditMode }) => (
  <section className="relative h-[90vh] flex items-center justify-center bg-neutral-900 overflow-hidden">
    <div className="absolute inset-0 opacity-40"><img src={data.bgImage} className="w-full h-full object-cover" alt="Hero"/></div>
    <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-neutral-900"></div>
    {isEditMode && <div className="absolute top-24 right-4 z-30 bg-black/80 p-2 rounded"><input value={data.bgImage} onChange={e=>update('bgImage',e.target.value)} className="text-xs p-1 rounded text-black w-64" placeholder="URL Background..."/></div>}
    <div className="container mx-auto px-6 relative z-10 text-center text-white">
      <div className="inline-block px-4 py-1 border border-emerald-500 text-emerald-400 text-xs font-bold tracking-widest mb-6 uppercase"><EditableText value={data.tagline} onChange={v=>update('tagline',v)} isEditMode={isEditMode}/></div>
      <h1 className="text-5xl md:text-7xl font-black mb-6"><EditableText value={data.title} onChange={v=>update('title',v)} isEditMode={isEditMode}/></h1>
      <div className="max-w-xl mx-auto text-lg mb-10 text-gray-300"><EditableText value={data.desc} onChange={v=>update('desc',v)} isEditMode={isEditMode} type="textarea"/></div>
    </div>
  </section>
);

const Profile = ({ data, update, isEditMode }) => (
  <section className="py-20 bg-white">
    <div className="container mx-auto px-6 flex flex-col md:flex-row items-center gap-12">
      <div className="md:w-1/2 relative">
        <img src={data.img} className="w-full h-80 object-cover shadow-xl" alt="Profile"/>
        {isEditMode && <input value={data.img} onChange={e=>update('img',e.target.value)} className="absolute bottom-0 w-full text-xs p-1 text-black bg-emerald-200" placeholder="URL Foto Profil..."/>}
      </div>
      <div className="md:w-1/2">
        <h2 className="text-3xl font-bold mb-4 text-neutral-900 border-l-4 border-emerald-500 pl-4"><EditableText value={data.title} onChange={v=>update('title',v)} isEditMode={isEditMode}/></h2>
        <div className="text-gray-600"><EditableText value={data.desc} onChange={v=>update('desc',v)} isEditMode={isEditMode} type="textarea"/></div>
      </div>
    </div>
  </section>
);

const SocialSection = ({ data, update, isEditMode }) => (
  <section className="py-20 bg-black text-white border-t border-neutral-800">
    <div className="container mx-auto px-6 flex flex-col md:flex-row items-center gap-12">
      <div className="md:w-1/2 text-center md:text-left">
        <h2 className="text-3xl font-bold mb-4 flex items-center gap-3 justify-center md:justify-start">
          <PlayCircle className="text-emerald-500" size={32}/> Pojok Kreasi & Sosmed
        </h2>
        <p className="text-lg text-gray-400 mb-6">
          <EditableText value={data.caption} onChange={v=>update('caption',v)} isEditMode={isEditMode} type="textarea"/>
        </p>
        <div className="flex gap-4 justify-center md:justify-start mb-6">
          <a href={data.instagram || "#"} target="_blank" rel="noreferrer" className="bg-neutral-800 p-3 rounded-full hover:bg-emerald-600 transition flex items-center gap-2 group border border-neutral-700">
            <Instagram size={20} className="group-hover:text-white text-emerald-500"/> 
            <span className="text-sm font-bold hidden md:inline">Instagram</span>
          </a>
          <a href={data.twitter || "#"} target="_blank" rel="noreferrer" className="bg-neutral-800 p-3 rounded-full hover:bg-emerald-600 transition flex items-center gap-2 group border border-neutral-700">
            <Twitter size={20} className="group-hover:text-white text-emerald-500"/>
            <span className="text-sm font-bold hidden md:inline">Twitter/X</span>
          </a>
          <a href={data.youtube || "#"} target="_blank" rel="noreferrer" className="bg-neutral-800 p-3 rounded-full hover:bg-emerald-600 transition flex items-center gap-2 group border border-neutral-700">
            <Youtube size={20} className="group-hover:text-white text-emerald-500"/>
            <span className="text-sm font-bold hidden md:inline">YouTube</span>
          </a>
        </div>
        {isEditMode && (
          <div className="bg-neutral-800 p-4 rounded border border-emerald-500/50 mb-4 grid gap-2">
            <p className="text-xs font-bold text-emerald-400">EDIT LINK SOSIAL MEDIA:</p>
            <input value={data.tiktokUrl} onChange={e=>update('tiktokUrl',e.target.value)} className="w-full bg-black p-2 text-xs text-white rounded border border-neutral-700" placeholder="Link TikTok Video"/>
            <input value={data.instagram} onChange={e=>update('instagram',e.target.value)} className="w-full bg-black p-2 text-xs text-white rounded border border-neutral-700" placeholder="Link Profile Instagram"/>
            <input value={data.twitter} onChange={e=>update('twitter',e.target.value)} className="w-full bg-black p-2 text-xs text-white rounded border border-neutral-700" placeholder="Link Profile Twitter"/>
            <input value={data.youtube} onChange={e=>update('youtube',e.target.value)} className="w-full bg-black p-2 text-xs text-white rounded border border-neutral-700" placeholder="Link Profile YouTube"/>
          </div>
        )}
      </div>
      <div className="md:w-1/2 flex justify-center">
        <div style={{ width: 325 }}>
          <SimpleTikTokEmbed url={data.tiktokUrl} width={325} />
        </div>
      </div>
    </div>
  </section>
);

const ActivityGallery = ({ list, update, add, remove, isEditMode, onItemClick }) => (
  <section className="py-24 bg-neutral-900 text-white border-t border-neutral-800">
    <div className="container mx-auto px-6">
      <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
        <div>
          <h2 className="text-3xl font-bold mb-2 flex items-center gap-2"><ImageIcon className="text-emerald-500"/> Dokumentasi Kegiatan</h2>
          <p className="text-gray-400">Jejak langkah pengabdian kami dalam visual.</p>
        </div>
        {isEditMode && (
          <button onClick={add} className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded flex items-center gap-2 font-bold text-sm transition"><PlusCircle size={16}/> Tambah Foto</button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {list.map((item) => (
          <div key={item.id} onClick={() => onItemClick(item)} className="group relative bg-neutral-800 border border-neutral-700 overflow-hidden rounded-lg hover:border-emerald-500 transition-all cursor-pointer">
            <div className="h-48 w-full relative overflow-hidden">
              <img src={item.img} className="w-full h-full object-cover transition duration-500 group-hover:scale-110" alt={item.title}/>
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                <p className="text-white text-sm font-bold flex items-center gap-2"><Info size={16}/> Lihat Detail</p>
              </div>
              {isEditMode && (
                <div className="absolute inset-0 bg-black/80 flex items-center justify-center p-4 opacity-0 group-hover:opacity-100 transition z-20" onClick={e=>e.stopPropagation()}>
                  <input value={item.img} onChange={e=>update(item.id,'img',e.target.value)} className="w-full text-xs p-1 text-black rounded" placeholder="URL Gambar..."/>
                </div>
              )}
            </div>
            <div className="p-4">
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold mb-2 uppercase tracking-wider">
                <Calendar size={12}/> 
                <EditableText value={item.date} onChange={v=>update(item.id,'date',v)} isEditMode={isEditMode}/>
              </div>
              <h3 className="font-bold text-lg mb-1 leading-tight text-white">
                <EditableText value={item.title} onChange={v=>update(item.id,'title',v)} isEditMode={isEditMode}/>
              </h3>
            </div>
            {isEditMode && (
              <button onClick={(e) => {e.stopPropagation(); remove(item.id)}} className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full hover:bg-red-500 shadow-lg z-20"><Trash2 size={14}/></button>
            )}
          </div>
        ))}
      </div>
    </div>
  </section>
);

const Structure = ({ list, update, isEditMode, onItemClick }) => (
  <section className="py-24 bg-neutral-100">
    <div className="container mx-auto px-6">
      <h2 className="text-4xl font-bold text-center mb-12 text-neutral-900">Top Management</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-8">
         {list.slice(0, 2).map(p => <LeaderCard key={p.id} p={p} update={update} isEditMode={isEditMode} isBig={true} onClick={onItemClick}/>)}
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
         {list.slice(2).map(p => <LeaderCard key={p.id} p={p} update={update} isEditMode={isEditMode} isBig={false} onClick={onItemClick}/>)}
      </div>
    </div>
  </section>
);

const LeaderCard = ({ p, update, isEditMode, isBig, onClick }) => (
  <div onClick={() => onClick(p)} className={`relative group bg-white shadow-sm border border-gray-200 overflow-hidden cursor-pointer ${isBig ? 'min-h-[400px]' : 'min-h-[300px]'}`}>
    <img src={p.img} className="w-full h-full object-cover group-hover:scale-105 transition" alt={p.role}/>
    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent flex flex-col justify-end p-4 text-white">
      <div className="text-emerald-400 font-bold uppercase text-xs"><EditableText value={p.role} onChange={v=>update(p.id,'role',v)} isEditMode={isEditMode}/></div>
      <div className={`font-bold ${isBig ? 'text-2xl' : 'text-lg'}`}><EditableText value={p.name} onChange={v=>update(p.id,'name',v)} isEditMode={isEditMode}/></div>
      <p className="text-[10px] text-gray-300 mt-2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
        <Info size={10}/> Klik untuk info lengkap
      </p>
    </div>
    {isEditMode && <div className="absolute top-0 w-full bg-black/60 p-1 z-20" onClick={e=>e.stopPropagation()}><input value={p.img} onChange={e=>update(p.id,'img',e.target.value)} className="w-full text-[10px] p-1 text-black rounded" placeholder="URL Foto..."/></div>}
  </div>
);

const Departments = ({ list, update, isEditMode, onItemClick }) => (
  <section className="py-24 bg-neutral-900 text-white">
    <div className="container mx-auto px-6">
      <h2 className="text-4xl font-bold text-center mb-16">Departemen</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {list.map((d, i) => (
          <div key={d.id} onClick={() => onItemClick(d)} className={`bg-neutral-800 p-6 border border-neutral-700 hover:border-emerald-600 transition flex flex-col cursor-pointer group ${i===6 ? 'md:col-start-2' : ''}`}>
            <h3 className="text-xl font-bold text-emerald-400 group-hover:text-white transition"><EditableText value={d.title} onChange={v=>update(d.id,'title',v)} isEditMode={isEditMode}/></h3>
            <p className="text-xs text-gray-400 uppercase mb-4"><EditableText value={d.full} onChange={v=>update(d.id,'full',v)} isEditMode={isEditMode}/></p>
            <div className="mt-auto flex items-center gap-3 pt-4 border-t border-neutral-700">
              <img src={d.headImg} className="w-10 h-10 rounded-full object-cover border border-emerald-500" alt="Head"/>
              <div>
                <p className="text-[9px] text-emerald-500 font-bold uppercase">KADEP</p>
                <div className="text-xs font-bold"><EditableText value={d.headName} onChange={v=>update(d.id,'headName',v)} isEditMode={isEditMode}/></div>
              </div>
            </div>
            {isEditMode && <input value={d.headImg} onChange={e=>{e.stopPropagation(); update(d.id,'headImg',e.target.value)}} className="mt-2 w-full text-[10px] p-1 text-black" placeholder="URL Foto Kadep..."/>}
            <div className="mt-4 text-center text-xs text-emerald-500 opacity-0 group-hover:opacity-100 transition">Klik untuk Lihat Proker Unggulan</div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default App;