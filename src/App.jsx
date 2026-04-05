import React, { useState, useEffect, Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { auth, db } from './firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));

// Public Layout & Pages
const PublicLayout = lazy(() => import('./components/layout/PublicLayout'));
const HomePage = lazy(() => import('./pages/public/HomePage'));
const AboutPage = lazy(() => import('./pages/public/AboutPage'));
const ServicesPage = lazy(() => import('./pages/public/ServicesPage'));
const PublicationPage = lazy(() => import('./pages/public/PublicationPage'));

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
    mabaCpWa: "",
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
  const [loading, setLoading] = useState(true);

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

  if (loading) return <div className="h-screen flex items-center justify-center bg-black text-emerald-500 font-black animate-pulse uppercase tracking-[0.5em] italic">HMS System Engine Booting...</div>;

  return (
    <Suspense fallback={<div className="h-screen flex items-center justify-center bg-black text-emerald-500 font-black animate-pulse uppercase tracking-[0.5em] italic">HMS System Routing...</div>}>
      <Routes>
        <Route element={<PublicLayout data={data} />}>
          <Route path="/" element={<HomePage data={data} />} />
          <Route path="/tentang-kami" element={<AboutPage data={data} />} />
          <Route path="/portal-layanan" element={<ServicesPage data={data} />} />
          <Route path="/publikasi" element={<PublicationPage data={data} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
        
        {/* Admin Dashboard */}
        <Route path="/hms-admin-dashboard" element={<AdminDashboard data={data} setData={setData} user={user} />} />
      </Routes>
    </Suspense>
  );
}