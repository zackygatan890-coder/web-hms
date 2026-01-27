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
  Briefcase, Trophy, HeartHandshake, Menu, X, 
  Edit3, Save, LogIn, LogOut, Lock, Loader2, AlertTriangle
} from 'lucide-react';

// --- 1. KONFIGURASI FIREBASE (SUDAH DIISI SESUAI DATA ANDA) ---
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
    desc: "Himpunan Mahasiswa Sipil adalah wadah perjuangan dan pembelajaran. Kami bukan sekadar organisasi, kami adalah laboratorium karakter bagi calon pemimpin pembangunan masa depan.",
    img: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=2070&auto=format&fit=crop"
  },
  topManagement: [
    { id: 'tm1', role: "Ketua Umum", name: "Nama Ketua", img: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=800&auto=format&fit=crop" },
    { id: 'tm2', role: "Wakil Ketua Umum", name: "Nama Wakil", img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800&auto=format&fit=crop" },
    { id: 'tm3', role: "Sekretaris Umum", name: "Nama Sekum", img: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=800&auto=format&fit=crop" },
    { id: 'tm4', role: "Bendahara Umum", name: "Nama Bendum", img: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=800&auto=format&fit=crop" },
    { id: 'tm5', role: "Sekretaris 1", name: "Nama Sek 1", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop" },
    { id: 'tm6', role: "Sekretaris 2", name: "Nama Sek 2", img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=800&auto=format&fit=crop" },
  ],
  departments: [
    { id: 1, title: "BUMH", full: "Badan Usaha Milik Himpunan", headName: "KaDept BUMH", headImg: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=400&auto=format&fit=crop", iconType: 'Briefcase' },
    { id: 2, title: "INTERNAL", full: "Departemen Internal", headName: "KaDept Internal", headImg: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop", iconType: 'Users' },
    { id: 3, title: "EKSTERNAL", full: "Departemen Eksternal", headName: "KaDept Eksternal", headImg: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=400&auto=format&fit=crop", iconType: 'HeartHandshake' },
    { id: 4, title: "KADERISASI", full: "Departemen Kaderisasi", headName: "KaDept Kaderisasi", headImg: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?q=80&w=400&auto=format&fit=crop", iconType: 'Target' },
    { id: 5, title: "KESRA", full: "Kesenian & Kerohanian", headName: "KaDept Kesra", headImg: "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=400&auto=format&fit=crop", iconType: 'Trophy' },
    { id: 6, title: "KOMINFO", full: "Komunikasi & Informasi", headName: "KaDept Kominfo", headImg: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=400&auto=format&fit=crop", iconType: 'Megaphone' },
    { id: 7, title: "PERISTEK", full: "Pengembangan Riset", headName: "KaDept Peristek", headImg: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&auto=format&fit=crop", iconType: 'BookOpen' }
  ]
};

// --- HELPER COMPONENT ---
const EditableText = ({ value, onChange, isEditMode, className, type = "text", placeholder = "Edit..." }) => {
  if (isEditMode) {
    if (type === "textarea") {
      return <textarea value={value} onChange={(e) => onChange(e.target.value)} className={`w-full bg-white/10 border border-emerald-500 rounded p-2 text-inherit focus:ring-2 ring-emerald-400 ${className}`} rows={4}/>;
    }
    return <input type="text" value={value} onChange={(e) => onChange(e.target.value)} className={`w-full bg-white/10 border-b border-emerald-500 text-inherit px-1 ${className}`} placeholder={placeholder}/>;
  }
  return <span className={className}>{value}</span>;
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

  useEffect(() => {
    // 1. Data Listener
    const unsubData = onSnapshot(doc(db, "website", "content"), (docSnap) => {
      if (docSnap.exists()) setData(docSnap.data());
      else setDoc(doc(db, "website", "content"), defaultData).catch(err => console.error(err));
      setLoading(false);
    }, (error) => {
      console.error("Error:", error);
      setLoading(false);
    });

    // 2. Auth Listener
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
      setLoginError("Login Gagal. Cek email/password atau koneksi internet.");
    }
  };

  const saveDataToCloud = async () => {
    if (!user) return;
    try {
      await updateDoc(doc(db, "website", "content"), data);
      setIsEditMode(false);
      alert("✅ Data Berhasil Disimpan!");
    } catch (error) {
      if (error.code === 'permission-denied') alert("⛔ GAGAL: Akses ditolak. Cek Firestore Rules Anda!");
      else alert("Error: " + error.message);
    }
  };

  const updateHero = (f, v) => setData({...data, hero: {...data.hero, [f]: v}});
  const updateProfile = (f, v) => setData({...data, profile: {...data.profile, [f]: v}});
  const updateTM = (id, f, v) => setData({...data, topManagement: data.topManagement.map(i => i.id === id ? {...i, [f]: v} : i)});
  const updateDept = (id, f, v) => setData({...data, departments: data.departments.map(i => i.id === id ? {...i, [f]: v} : i)});

  if (loading) return <div className="h-screen flex items-center justify-center bg-black text-emerald-500"><Loader2 className="animate-spin mr-2"/> Memuat Data...</div>;

  return (
    <div className="font-sans bg-gray-50 text-neutral-900 scroll-smooth pb-20">
      {/* NAVBAR */}
      <nav className="fixed w-full z-40 bg-black/95 py-4 shadow-lg border-b border-emerald-900">
        <div className="container mx-auto px-6 flex justify-between items-center text-white">
          <div className="flex items-center gap-2 font-bold text-2xl tracking-tighter">
            <Building2 className="text-emerald-500" /><span>HMS<span className="text-emerald-500">IPIL</span></span>
          </div>
          <div>
            {user ? (
              <button onClick={() => signOut(auth)} className="text-xs bg-red-900/80 px-3 py-1.5 rounded hover:bg-red-800 font-bold flex gap-2"><LogOut size={14}/> Logout</button>
            ) : (
              <button onClick={() => setShowLogin(true)} className="text-xs bg-emerald-900/50 px-3 py-1.5 rounded hover:bg-emerald-800 font-bold border border-emerald-800 flex gap-2"><LogIn size={14}/> Admin</button>
            )}
          </div>
        </div>
      </nav>

      {/* SECTIONS */}
      <Hero data={data.hero} update={updateHero} isEditMode={isEditMode} />
      <Profile data={data.profile} update={updateProfile} isEditMode={isEditMode} />
      <Structure list={data.topManagement} update={updateTM} isEditMode={isEditMode} />
      <Departments list={data.departments} update={updateDept} isEditMode={isEditMode} />
      
      {/* FOOTER */}
      <footer className="bg-black text-white py-12 text-center text-sm border-t border-emerald-900">
        <p className="text-gray-600">&copy; {new Date().getFullYear()} Himpunan Mahasiswa Sipil.</p>
      </footer>

      {/* LOGIN MODAL */}
      {showLogin && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-neutral-900 p-8 rounded border border-emerald-900 w-full max-w-md relative">
            <button onClick={() => setShowLogin(false)} className="absolute top-4 right-4 text-gray-500 hover:text-white"><X size={20}/></button>
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2"><Lock className="text-emerald-500"/> Admin Access</h3>
            <form onSubmit={handleLogin} className="space-y-4">
              <input type="email" placeholder="Email" required value={email} onChange={e=>setEmail(e.target.value)} className="w-full bg-black border border-gray-700 p-3 rounded text-white focus:border-emerald-500 outline-none"/>
              <input type="password" placeholder="Password" required value={password} onChange={e=>setPassword(e.target.value)} className="w-full bg-black border border-gray-700 p-3 rounded text-white focus:border-emerald-500 outline-none"/>
              {loginError && <div className="text-red-400 text-sm flex gap-2"><AlertTriangle size={16}/> {loginError}</div>}
              <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-3 rounded font-bold mt-4">MASUK</button>
            </form>
          </div>
        </div>
      )}

      {/* EDIT CONTROLS */}
      {user && (
        <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-3 items-end">
          {isEditMode ? (
            <>
              <div className="bg-neutral-900 text-emerald-400 text-xs p-3 rounded border border-emerald-900 shadow-xl mb-1">Mode Edit Aktif. Klik teks/gambar.</div>
              <div className="flex gap-2">
                <button onClick={() => setIsEditMode(false)} className="bg-neutral-700 text-white px-4 py-3 rounded-full font-bold shadow-lg">Batal</button>
                <button onClick={saveDataToCloud} className="bg-emerald-600 text-white px-6 py-3 rounded-full font-bold shadow-lg flex gap-2 animate-pulse"><Save size={18}/> SIMPAN</button>
              </div>
            </>
          ) : (
            <button onClick={() => setIsEditMode(true)} className="bg-black text-white border border-emerald-900 px-6 py-3 rounded-full font-bold shadow-lg flex gap-2 hover:bg-emerald-900"><Edit3 size={18}/> Edit Website</button>
          )}
        </div>
      )}
    </div>
  );
};

// --- SUB COMPONENTS (Disederhanakan) ---
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

const Structure = ({ list, update, isEditMode }) => (
  <section className="py-24 bg-neutral-100">
    <div className="container mx-auto px-6">
      <h2 className="text-4xl font-bold text-center mb-12 text-neutral-900">Top Management</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-8">
         {list.slice(0, 2).map(p => <LeaderCard key={p.id} p={p} update={update} isEditMode={isEditMode} isBig={true}/>)}
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
         {list.slice(2).map(p => <LeaderCard key={p.id} p={p} update={update} isEditMode={isEditMode} isBig={false}/>)}
      </div>
    </div>
  </section>
);

const LeaderCard = ({ p, update, isEditMode, isBig }) => (
  <div className={`relative group bg-white shadow-sm border border-gray-200 overflow-hidden ${isBig ? 'min-h-[400px]' : 'min-h-[300px]'}`}>
    <img src={p.img} className="w-full h-full object-cover group-hover:scale-105 transition" alt={p.role}/>
    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent flex flex-col justify-end p-4 text-white">
      <div className="text-emerald-400 font-bold uppercase text-xs"><EditableText value={p.role} onChange={v=>update(p.id,'role',v)} isEditMode={isEditMode}/></div>
      <div className={`font-bold ${isBig ? 'text-2xl' : 'text-lg'}`}><EditableText value={p.name} onChange={v=>update(p.id,'name',v)} isEditMode={isEditMode}/></div>
    </div>
    {isEditMode && <div className="absolute top-0 w-full bg-black/60 p-1"><input value={p.img} onChange={e=>update(p.id,'img',e.target.value)} className="w-full text-[10px] p-1 text-black rounded" placeholder="URL Foto..."/></div>}
  </div>
);

const Departments = ({ list, update, isEditMode }) => (
  <section className="py-24 bg-neutral-900 text-white">
    <div className="container mx-auto px-6">
      <h2 className="text-4xl font-bold text-center mb-16">Departemen</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {list.map((d, i) => (
          <div key={d.id} className={`bg-neutral-800 p-6 border border-neutral-700 hover:border-emerald-600 transition flex flex-col ${i===6 ? 'md:col-start-2' : ''}`}>
            <h3 className="text-xl font-bold text-emerald-400"><EditableText value={d.title} onChange={v=>update(d.id,'title',v)} isEditMode={isEditMode}/></h3>
            <p className="text-xs text-gray-400 uppercase mb-4"><EditableText value={d.full} onChange={v=>update(d.id,'full',v)} isEditMode={isEditMode}/></p>
            <div className="mt-auto flex items-center gap-3 pt-4 border-t border-neutral-700">
              <img src={d.headImg} className="w-10 h-10 rounded-full object-cover border border-emerald-500" alt="Head"/>
              <div>
                <p className="text-[9px] text-emerald-500 font-bold uppercase">KADEP</p>
                <div className="text-xs font-bold"><EditableText value={d.headName} onChange={v=>update(d.id,'headName',v)} isEditMode={isEditMode}/></div>
              </div>
            </div>
            {isEditMode && <input value={d.headImg} onChange={e=>update(d.id,'headImg',e.target.value)} className="mt-2 w-full text-[10px] p-1 text-black" placeholder="URL Foto Kadep..."/>}
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default App;