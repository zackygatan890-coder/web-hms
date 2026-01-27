import React, { useState, useEffect } from 'react';
import { initializeApp } from "firebase/app";
import { 
  getFirestore, doc, onSnapshot, updateDoc, setDoc 
} from "firebase/firestore";
import { 
  getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut 
} from "firebase/auth";
import { 
  Building2, Users, BookOpen, Target, Megaphone, 
  Briefcase, Trophy, HeartHandshake, LogIn, LogOut, 
  Edit3, Save, X, Plus, Trash2, Calendar, FileText, List, ChevronRight,
  ImageIcon, Loader2
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

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// --- DATA DEFAULT ---
const defaultData = {
  hero: {
    tagline: "PERIODE 2024 - 2025",
    title: "SOLIDARITAS TANPA BATAS",
    desc: "Mengokohkan pondasi kekeluargaan untuk mencetak insinyur sipil yang berintegritas dan profesional.",
    bgImage: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=2089&auto=format&fit=crop"
  },
  profile: {
    title: "Tentang Kami",
    desc: "Himpunan Mahasiswa Sipil adalah wadah perjuangan dan pembelajaran.\n\nKami bukan sekadar organisasi, kami adalah laboratorium karakter bagi calon pemimpin pembangunan masa depan.",
    img: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=2070&auto=format&fit=crop"
  },
  gallery: [],
  topManagement: [
    { 
      id: 'tm1', role: "Ketua Umum", name: "Nama Ketua", img: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=800&auto=format&fit=crop",
      gbhk: "Memastikan seluruh elemen himpunan berjalan sesuai visi misi.", 
      proker: "1. Rapat Kerja Pusat\n2. Evaluasi Triwulan"
    },
    { id: 'tm2', role: "Wakil Ketua Umum", name: "Nama Wakil", img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800&auto=format&fit=crop", gbhk: "-", proker: "-" },
    { id: 'tm3', role: "Sekretaris Umum", name: "Nama Sekum", img: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=800&auto=format&fit=crop", gbhk: "-", proker: "-" },
    { id: 'tm4', role: "Bendahara Umum", name: "Nama Bendum", img: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=800&auto=format&fit=crop", gbhk: "-", proker: "-" },
  ],
  departments: [
    { id: 1, title: "BUMH", full: "Badan Usaha Milik Himpunan", headName: "KaDept BUMH", headImg: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=400&auto=format&fit=crop", iconType: 'Briefcase', gbhk: "-", proker: "-" },
    { id: 2, title: "INTERNAL", full: "Departemen Internal", headName: "KaDept Internal", headImg: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop", iconType: 'Users', gbhk: "-", proker: "-" },
    { id: 3, title: "EKSTERNAL", full: "Departemen Eksternal", headName: "KaDept Eksternal", headImg: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=400&auto=format&fit=crop", iconType: 'HeartHandshake', gbhk: "-", proker: "-" },
    { id: 4, title: "KADERISASI", full: "Departemen Kaderisasi", headName: "KaDept Kaderisasi", headImg: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?q=80&w=400&auto=format&fit=crop", iconType: 'Target', gbhk: "-", proker: "-" },
    { id: 5, title: "KESRA", full: "Kesenian & Kerohanian", headName: "KaDept Kesra", headImg: "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=400&auto=format&fit=crop", iconType: 'Trophy', gbhk: "-", proker: "-" },
    { id: 6, title: "KOMINFO", full: "Komunikasi & Informasi", headName: "KaDept Kominfo", headImg: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=400&auto=format&fit=crop", iconType: 'Megaphone', gbhk: "-", proker: "-" },
    { id: 7, title: "PERISTEK", full: "Pengembangan Riset", headName: "KaDept Peristek", headImg: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&auto=format&fit=crop", iconType: 'BookOpen', gbhk: "-", proker: "-" }
  ]
};

// --- HELPER COMPONENT (Editable Text) ---
// Perbaikan Utama: Menambahkan e.stopPropagation() pada input
// Ini mencegah klik pada kotak teks memicu klik pada kartu induk (yang membuka modal)
const EditableText = ({ value, onChange, isEditMode, className, type = "text", placeholder = "Isi data...", rows=4 }) => {
  if (isEditMode) {
    if (type === "textarea") {
      return (
        <textarea 
          value={value || ""} 
          onChange={(e) => onChange(e.target.value)} 
          onClick={(e) => e.stopPropagation()} // Stop klik tembus ke belakang
          className={`w-full bg-yellow-50/90 border-2 border-dashed border-emerald-500 rounded p-3 text-inherit focus:ring-2 ring-emerald-400 focus:bg-white focus:outline-none placeholder-gray-400 transition-all ${className}`} 
          rows={rows} 
          placeholder={placeholder}
        />
      );
    }
    return (
      <input 
        type="text" 
        value={value || ""} 
        onChange={(e) => onChange(e.target.value)} 
        onClick={(e) => e.stopPropagation()} // Stop klik tembus ke belakang
        className={`w-full bg-yellow-50/90 border-b-2 border-dashed border-emerald-500 text-inherit px-2 py-1 focus:bg-white focus:outline-none placeholder-gray-400 ${className}`} 
        placeholder={placeholder}
      />
    );
  }
  return <span className={`whitespace-pre-wrap ${className}`}>{value || "-"}</span>;
};

// --- APP UTAMA ---
const App = () => {
  const [data, setData] = useState(defaultData);
  const [user, setUser] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const [showLogin, setShowLogin] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  const [activeId, setActiveId] = useState(null);
  const [activeType, setActiveType] = useState(null);

  useEffect(() => {
    const unsubData = onSnapshot(doc(db, "website", "content"), (docSnap) => {
      if (docSnap.exists()) {
        setData(docSnap.data());
      } else {
        setDoc(doc(db, "website", "content"), defaultData);
      }
      setLoading(false);
    });
    const unsubAuth = onAuthStateChanged(auth, u => { 
      setUser(u); 
      if(!u) setIsEditMode(false); 
    });
    return () => { unsubData(); unsubAuth(); };
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setShowLogin(false); setEmail(""); setPassword(""); setLoginError("");
    } catch (err) { setLoginError("Login gagal."); }
  };

  const saveDataToCloud = async () => {
    if (!user) return;
    try { 
      await updateDoc(doc(db, "website", "content"), data); 
      setIsEditMode(false); 
      alert("✅ Data Berhasil Disimpan!"); 
    }
    catch (err) { alert("Gagal: " + err.message); }
  };

  const updateHero = (f, v) => setData(prev => ({...prev, hero: {...prev.hero, [f]: v}}));
  const updateProfile = (f, v) => setData(prev => ({...prev, profile: {...prev.profile, [f]: v}}));
  
  const updateList = (listKey, id, field, val) => {
    setData(prev => {
      const newList = prev[listKey].map(i => i.id === id ? {...i, [field]: val} : i);
      return {...prev, [listKey]: newList};
    });
  };

  const addGalleryItem = () => {
    const newItem = {
      id: Date.now(),
      title: "Kegiatan Baru",
      date: "Bulan Tahun",
      img: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=1000",
      desc: "Deskripsi kegiatan..."
    };
    setData(prev => ({...prev, gallery: [newItem, ...prev.gallery]}));
  };

  const deleteGalleryItem = (id, e) => {
    e.stopPropagation();
    if (window.confirm("Hapus dokumentasi ini?")) {
      setData(prev => ({...prev, gallery: prev.gallery.filter(item => item.id !== id)}));
    }
  };

  const openModal = (item, type) => { setActiveId(item.id); setActiveType(type); };
  const closeModal = () => { setActiveId(null); setActiveType(null); };

  const getActiveDisplayItem = () => {
    if (!activeId || !activeType) return null;
    if (activeType === 'tm') return data.topManagement.find(i => i.id === activeId);
    if (activeType === 'dept') return data.departments.find(i => i.id === activeId);
    if (activeType === 'gallery') return data.gallery.find(i => i.id === activeId);
    return null;
  };

  const displayItem = getActiveDisplayItem();

  if (loading) return <div className="h-screen flex items-center justify-center bg-black text-emerald-500 font-bold gap-2"><Loader2 className="animate-spin"/> Memuat Data...</div>;

  return (
    <div className="font-sans bg-gray-50 text-neutral-900 scroll-smooth pb-20">
      
      {/* NAVBAR */}
      <nav className="fixed w-full z-40 bg-black/95 py-4 shadow-lg border-b border-emerald-900">
        <div className="container mx-auto px-6 flex justify-between items-center text-white">
          <div className="flex items-center gap-2 font-bold text-2xl tracking-tighter">
            <Building2 className="text-emerald-500" /><span>HMS<span className="text-emerald-500">IPIL</span></span>
          </div>
          <div className="flex gap-4">
            {user ? (
              <button onClick={() => signOut(auth)} className="flex items-center gap-2 text-xs bg-red-900/80 px-3 py-1.5 rounded font-bold hover:bg-red-800"><LogOut size={14}/> Keluar</button>
            ) : (
              <button onClick={() => setShowLogin(true)} className="flex items-center gap-2 text-xs bg-emerald-900/50 px-3 py-1.5 rounded font-bold border border-emerald-800 hover:bg-emerald-800"><LogIn size={14}/> Admin</button>
            )}
          </div>
        </div>
      </nav>

      {/* SECTIONS */}
      <Hero data={data.hero} update={updateHero} isEditMode={isEditMode} />
      <Profile data={data.profile} update={updateProfile} isEditMode={isEditMode} />
      
      {/* STRUCTURE (TOP MANAGEMENT) */}
      <Structure 
        list={data.topManagement} 
        update={(id, f, v) => updateList('topManagement', id, f, v)} 
        isEditMode={isEditMode} 
        onItemClick={(item) => openModal(item, 'tm')}
      />
      
      {/* DEPARTMENTS - Fix Logic Click */}
      <Departments 
        list={data.departments} 
        update={(id, f, v) => updateList('departments', id, f, v)} 
        isEditMode={isEditMode}
        onItemClick={(item) => openModal(item, 'dept')} 
      />

      <Gallery 
        list={data.gallery || []} 
        update={(id, f, v) => updateList('gallery', id, f, v)}
        onAdd={addGalleryItem}
        onDelete={deleteGalleryItem}
        isEditMode={isEditMode}
        onItemClick={(item) => openModal(item, 'gallery')}
      />
      
      <Footer />

      {/* MODAL DETAIL */}
      {displayItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in" onClick={closeModal}>
          <div className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl shadow-2xl relative" onClick={e => e.stopPropagation()}>
            
            {/* Header Modal */}
            <div className="relative h-64 bg-neutral-900 group">
              <img src={displayItem.img} className="w-full h-full object-cover opacity-60" alt="Header"/>
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
              <button onClick={closeModal} className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full hover:bg-red-600 z-20"><X size={20}/></button>
              
              <div className="absolute bottom-6 left-6 text-white w-full pr-12">
                <p className="text-emerald-400 font-bold uppercase tracking-widest text-xs mb-1">
                  {activeType === 'tm' ? 'BPH Inti' : activeType === 'dept' ? 'Departemen' : 'Dokumentasi'}
                </p>
                <h2 className="text-3xl font-bold leading-tight">
                  <EditableText 
                    value={activeType === 'tm' ? displayItem.role : displayItem.title}
                    onChange={(v) => updateList(activeType === 'tm' ? 'topManagement' : activeType === 'dept' ? 'departments' : 'gallery', displayItem.id, activeType === 'tm' ? 'role' : 'title', v)}
                    isEditMode={isEditMode}
                    className="w-full"
                  />
                </h2>
                {activeType === 'tm' && <p className="text-lg opacity-90">{displayItem.name}</p>}
                {activeType === 'gallery' && (
                  <p className="flex items-center gap-2 text-sm text-gray-300 mt-2">
                    <Calendar size={14}/> 
                    <EditableText value={displayItem.date} onChange={(v) => updateList('gallery', displayItem.id, 'date', v)} isEditMode={isEditMode}/>
                  </p>
                )}
              </div>
              
              {isEditMode && activeType === 'gallery' && (
                <div className="absolute top-4 left-4 right-16 bg-black/80 p-2 rounded">
                  <input onClick={(e) => e.stopPropagation()} value={displayItem.img} onChange={(e) => updateList('gallery', displayItem.id, 'img', e.target.value)} className="w-full bg-transparent text-white text-xs focus:outline-none" placeholder="Paste Image URL here..."/>
                </div>
              )}
            </div>

            {/* Content Modal */}
            <div className="p-8 space-y-8">
              {(activeType === 'tm' || activeType === 'dept') && (
                <>
                  <div>
                    <div className="flex items-center gap-2 mb-3 text-emerald-700 font-bold text-lg border-b border-gray-200 pb-2"><Target size={20}/> <span>GBHK / Arahan Strategis</span></div>
                    <div className="text-gray-700 bg-gray-50 p-4 rounded border-l-4 border-emerald-500">
                      <EditableText 
                        value={displayItem.gbhk} 
                        onChange={(v) => updateList(activeType === 'tm' ? 'topManagement' : 'departments', displayItem.id, 'gbhk', v)} 
                        isEditMode={isEditMode} 
                        type="textarea"
                        rows={4}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-3 text-emerald-700 font-bold text-lg border-b border-gray-200 pb-2"><List size={20}/> <span>Program Kerja</span></div>
                    <div className="text-gray-700">
                      <EditableText 
                        value={displayItem.proker} 
                        onChange={(v) => updateList(activeType === 'tm' ? 'topManagement' : 'departments', displayItem.id, 'proker', v)} 
                        isEditMode={isEditMode} 
                        type="textarea" 
                        rows={8}
                        placeholder="1. Proker A...&#10;2. Proker B..."
                      />
                    </div>
                  </div>
                </>
              )}
              {activeType === 'gallery' && (
                <div>
                   <div className="flex items-center gap-2 mb-3 text-emerald-700 font-bold text-lg border-b border-gray-200 pb-2"><FileText size={20}/> <span>Deskripsi Kegiatan</span></div>
                   <div className="text-gray-700 text-lg">
                      <EditableText 
                        value={displayItem.desc} 
                        onChange={(v) => updateList('gallery', displayItem.id, 'desc', v)} 
                        isEditMode={isEditMode} 
                        type="textarea" 
                        rows={8} 
                        placeholder="Ceritakan detail kegiatan..."
                      />
                    </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* LOGIN & CONTROLS */}
      {showLogin && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <div className="bg-neutral-900 p-8 rounded border border-emerald-900 w-full max-w-md relative">
             <button onClick={() => setShowLogin(false)} className="absolute top-4 right-4 text-gray-500 hover:text-white"><X size={20}/></button>
             <h3 className="text-xl font-bold text-white mb-4">Login Admin</h3>
             <form onSubmit={handleLogin} className="space-y-4">
               <input type="email" value={email} onChange={e=>setEmail(e.target.value)} className="w-full bg-black border border-gray-700 p-2 text-white rounded" placeholder="Email"/>
               <input type="password" value={password} onChange={e=>setPassword(e.target.value)} className="w-full bg-black border border-gray-700 p-2 text-white rounded" placeholder="Password"/>
               <button className="w-full bg-emerald-600 text-white py-2 rounded font-bold">Masuk</button>
             </form>
             {loginError && <p className="text-red-500 text-sm mt-2">{loginError}</p>}
          </div>
        </div>
      )}

      {user && (
        <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-2 items-end">
          {isEditMode ? (
            <div className="flex gap-2">
               <button onClick={()=>setIsEditMode(false)} className="bg-neutral-600 text-white px-4 py-2 rounded-full shadow-lg font-bold">Batal</button>
               <button onClick={saveDataToCloud} className="bg-emerald-600 text-white px-6 py-2 rounded-full shadow-lg font-bold flex gap-2 items-center animate-pulse"><Save size={16}/> SIMPAN</button>
            </div>
          ) : (
            <button onClick={()=>setIsEditMode(true)} className="bg-black text-white px-6 py-3 rounded-full shadow-lg font-bold border border-emerald-500 flex gap-2 items-center hover:bg-emerald-900 transition"><Edit3 size={16}/> Edit Mode</button>
          )}
        </div>
      )}
    </div>
  );
};

// --- SUB COMPONENTS (Revised for Click Handling) ---
// PERBAIKAN: Menghapus kondisi !isEditMode pada onClick
// Sekarang kartu akan SELALU membuka modal saat diklik

const Hero = ({ data, update, isEditMode }) => (
  <section className="relative h-[80vh] flex items-center justify-center bg-neutral-900 overflow-hidden">
    <div className="absolute inset-0 opacity-40"><img src={data.bgImage} className="w-full h-full object-cover"/></div>
    <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-neutral-900"></div>
    {isEditMode && <input onClick={(e) => e.stopPropagation()} value={data.bgImage} onChange={e=>update('bgImage',e.target.value)} className="absolute top-24 right-4 z-30 text-xs p-1 rounded text-black w-64 opacity-80" placeholder="BG URL"/>}
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
      <div className="md:w-1/2 relative group">
        <div className="absolute -top-4 -left-4 w-full h-full border-2 border-emerald-500 rounded z-0 hidden md:block"></div>
        <img src={data.img} className="relative z-10 w-full h-80 object-cover shadow-xl grayscale group-hover:grayscale-0 transition duration-500"/>
        {isEditMode && <input onClick={(e) => e.stopPropagation()} value={data.img} onChange={e=>update('img',e.target.value)} className="absolute bottom-4 left-4 right-4 z-20 text-xs p-2 text-black bg-white/90 border border-emerald-500 shadow-lg rounded" placeholder="Paste Profile Image URL"/>}
      </div>
      <div className="md:w-1/2">
        <h2 className="text-3xl font-bold mb-4 text-neutral-900 border-l-4 border-emerald-500 pl-4"><EditableText value={data.title} onChange={v=>update('title',v)} isEditMode={isEditMode}/></h2>
        <div className="text-gray-600 leading-relaxed text-lg"><EditableText value={data.desc} onChange={v=>update('desc',v)} isEditMode={isEditMode} type="textarea" rows={10} placeholder="Tuliskan deskripsi lengkap himpunan di sini..."/></div>
      </div>
    </div>
  </section>
);

const Structure = ({ list, update, isEditMode, onItemClick }) => (
  <section className="py-24 bg-neutral-100">
    <div className="container mx-auto px-6">
      <h2 className="text-4xl font-bold text-center mb-4 text-neutral-900">Top Management</h2>
      <p className="text-center text-gray-500 mb-12 text-sm">Klik foto untuk detail Proker</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-8">
         {list.slice(0, 2).map(p => <LeaderCard key={p.id} p={p} update={update} isEditMode={isEditMode} isBig={true} onClick={()=>onItemClick(p)}/>)}
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
         {list.slice(2).map(p => <LeaderCard key={p.id} p={p} update={update} isEditMode={isEditMode} isBig={false} onClick={()=>onItemClick(p)}/>)}
      </div>
    </div>
  </section>
);

const LeaderCard = ({ p, update, isEditMode, isBig, onClick }) => (
  <div onClick={onClick} className={`relative group bg-white shadow-sm border border-gray-200 overflow-hidden cursor-pointer ${isBig ? 'min-h-[400px]' : 'min-h-[300px]'}`}>
    <img src={p.img} className="w-full h-full object-cover transition duration-500 group-hover:scale-105" alt={p.role}/>
    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-6 text-white">
      <div className="text-emerald-400 font-bold uppercase tracking-wider mb-1 text-xs"><EditableText value={p.role} onChange={v=>update(p.id,'role',v)} isEditMode={isEditMode}/></div>
      <div className={`font-bold leading-tight ${isBig ? 'text-2xl' : 'text-lg'}`}><EditableText value={p.name} onChange={v=>update(p.id,'name',v)} isEditMode={isEditMode}/></div>
    </div>
    {isEditMode && <div className="absolute top-0 left-0 w-full bg-black/60 p-2 backdrop-blur-sm"><input onClick={(e) => e.stopPropagation()} value={p.img} onChange={e=>update(p.id,'img',e.target.value)} className="w-full text-[10px] p-1 text-black bg-white/90 rounded" placeholder="Paste Image URL"/></div>}
  </div>
);

const Departments = ({ list, update, isEditMode, onItemClick }) => (
  <section className="py-24 bg-neutral-900 text-white">
    <div className="container mx-auto px-6">
      <h2 className="text-4xl font-bold text-center mb-16">Departemen & Divisi</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {list.map((d, i) => (
          <div onClick={() => onItemClick(d)} key={d.id} className={`cursor-pointer bg-neutral-800 p-8 border border-neutral-700 hover:border-emerald-600 hover:bg-neutral-800/80 transition duration-300 flex flex-col group ${i===6 ? 'lg:col-start-2' : ''}`}>
            <h3 className="text-2xl font-bold text-emerald-400 mb-2 group-hover:text-emerald-300 transition"><EditableText value={d.title} onChange={v=>update(d.id,'title',v)} isEditMode={isEditMode}/></h3>
            <p className="text-xs text-gray-400 uppercase tracking-widest mb-6 border-b border-gray-700 pb-4"><EditableText value={d.full} onChange={v=>update(d.id,'full',v)} isEditMode={isEditMode}/></p>
            <div className="mt-auto flex items-center justify-between">
               <div className="flex items-center gap-3">
                  <img src={d.headImg} className="w-10 h-10 rounded-full object-cover border border-emerald-600" alt="Head"/>
                  <div><p className="text-[10px] text-emerald-500 font-bold uppercase">KADEP</p><div className="text-sm font-bold text-white"><EditableText value={d.headName} onChange={v=>update(d.id,'headName',v)} isEditMode={isEditMode}/></div></div>
               </div>
               {!isEditMode && <ChevronRight className="text-emerald-600 group-hover:translate-x-1 transition"/>}
            </div>
            {isEditMode && <input onClick={(e) => e.stopPropagation()} value={d.headImg} onChange={e=>update(d.id,'headImg',e.target.value)} className="mt-2 w-full text-[10px] p-1 text-black" placeholder="Head Img URL"/>}
          </div>
        ))}
      </div>
    </div>
  </section>
);

const Gallery = ({ list, update, onAdd, onDelete, isEditMode, onItemClick }) => (
  <section className="py-24 bg-white border-t border-gray-200">
    <div className="container mx-auto px-6">
      <div className="flex justify-between items-end mb-12">
        <div><span className="text-emerald-600 font-bold tracking-widest uppercase text-sm">Dokumentasi</span><h2 className="text-4xl font-bold text-neutral-900 mt-2">Galeri Kegiatan</h2></div>
        {isEditMode && <button onClick={onAdd} className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-full flex items-center gap-2 text-sm font-bold shadow-lg transition"><Plus size={16}/> Tambah Foto</button>}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {list.map(item => (
          <div key={item.id} onClick={() => onItemClick(item)} className="group relative cursor-pointer overflow-hidden rounded-lg shadow-md aspect-[4/3] bg-gray-100">
            <img src={item.img} alt={item.title} className="w-full h-full object-cover transition duration-700 group-hover:scale-110"/>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition duration-300 flex flex-col justify-end p-6">
              <span className="text-emerald-400 text-xs font-bold mb-1">{item.date}</span>
              <h3 className="text-white font-bold text-xl">{item.title}</h3>
            </div>
            {isEditMode && (
              <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center gap-2 p-4 backdrop-blur-[2px]">
                <input onClick={(e) => e.stopPropagation()} value={item.title} onChange={(e) => update(item.id, 'title', e.target.value)} className="bg-white/90 text-black text-sm p-1 rounded w-full text-center font-bold" placeholder="Judul Kegiatan"/>
                <input onClick={(e) => e.stopPropagation()} value={item.date} onChange={(e) => update(item.id, 'date', e.target.value)} className="bg-white/90 text-black text-xs p-1 rounded w-full text-center" placeholder="Tanggal"/>
                <button onClick={(e) => onDelete(item.id, e)} className="mt-2 bg-red-600 text-white p-2 rounded-full hover:bg-red-700" title="Hapus"><Trash2 size={16}/></button>
              </div>
            )}
          </div>
        ))}
      </div>
      {list.length === 0 && <div className="text-center py-12 text-gray-400 border-2 border-dashed border-gray-300 rounded-lg"><ImageIcon size={48} className="mx-auto mb-4 opacity-50"/><p>Belum ada dokumentasi kegiatan.</p></div>}
    </div>
  </section>
);

const Footer = () => <footer className="bg-black text-white py-12 text-center text-sm border-t border-emerald-900"><div className="container mx-auto"><p className="text-gray-600">&copy; {new Date().getFullYear()} HMS.</p></div></footer>;

export default App;