import React, { useState, useEffect, Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { auth, db } from './firebase';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import ErrorBoundary from './components/ErrorBoundary';
import { AppLoader, CardGridSkeleton } from './components/PageSkeleton';

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
      setupRealtimeDB(); 
    });
    return () => unsubscribe();
  }, []);

  const setupRealtimeDB = () => {
    setLoading(true);
    let loadedCount = 0;
    const checkReady = () => { loadedCount++; if(loadedCount >= 5) setLoading(false); };

    // ONE-TIME MIGRATION SCRIPT CHECK
    getDoc(doc(db, "website_content", "main_data")).then(async (snap) => {
        if (snap.exists() && !snap.data()._migratedToGranular) {
           console.log("Migrating database to granular...");
           const oldData = snap.data();
           await Promise.all([
             setDoc(doc(db, "hms_site", "config"), { identity: oldData.identity||defaultData.identity, hero: oldData.hero||defaultData.hero, profile: oldData.profile||defaultData.profile, social: oldData.social||defaultData.social, sectionTitles: oldData.sectionTitles||defaultData.sectionTitles }),
             setDoc(doc(db, "hms_site", "mading"), { items: oldData.mading || [] }),
             setDoc(doc(db, "hms_site", "merch"), { items: oldData.merch || [] }),
             setDoc(doc(db, "hms_site", "archives"), { items: oldData.archives || [] }),
             setDoc(doc(db, "hms_site", "org"), { bpo: oldData.bpo || [], topManagement: oldData.topManagement || [], departments: oldData.departments || [] })
           ]);
           await setDoc(doc(db, "website_content", "main_data"), { _migratedToGranular: true }, { merge: true });
           console.log("Migration completely done!");
        }
    });

    // 1. CONFIG LISTEN
    onSnapshot(doc(db, "hms_site", "config"), (docSnap) => {
      if (docSnap.exists()) {
        const d = docSnap.data();
        setData(prev => ({ ...prev, 
          identity: { ...defaultData.identity, ...(d.identity || {}) }, 
          hero: { ...defaultData.hero, ...(d.hero || {}) }, 
          profile: { ...defaultData.profile, ...(d.profile || {}) }, 
          social: { ...defaultData.social, ...(d.social || {}) }, 
          sectionTitles: { ...defaultData.sectionTitles, ...(d.sectionTitles || {}) } 
        }));
      } else { setDoc(doc(db, "hms_site", "config"), { identity: defaultData.identity, hero: defaultData.hero, profile: defaultData.profile, social: defaultData.social, sectionTitles: defaultData.sectionTitles }); }
      checkReady();
    }, () => checkReady());

    // 2. MADING LISTEN
    onSnapshot(doc(db, "hms_site", "mading"), (docSnap) => {
      if (docSnap.exists()) setData(prev => ({ ...prev, mading: docSnap.data().items || [] }));
      else setDoc(doc(db, "hms_site", "mading"), { items: [] });
      checkReady();
    }, () => checkReady());

    // 3. MERCH LISTEN
    onSnapshot(doc(db, "hms_site", "merch"), (docSnap) => {
      if (docSnap.exists()) setData(prev => ({ ...prev, merch: docSnap.data().items || [] }));
      else setDoc(doc(db, "hms_site", "merch"), { items: [] });
      checkReady();
    }, () => checkReady());

    // 4. ARCHIVES LISTEN
    onSnapshot(doc(db, "hms_site", "archives"), (docSnap) => {
      if (docSnap.exists()) setData(prev => ({ ...prev, archives: docSnap.data().items || [] }));
      else setDoc(doc(db, "hms_site", "archives"), { items: [] });
      checkReady();
    }, () => checkReady());

    // 5. ORG LISTEN
    onSnapshot(doc(db, "hms_site", "org"), (docSnap) => {
      if (docSnap.exists()) setData(prev => ({ ...prev, bpo: docSnap.data().bpo || [], topManagement: docSnap.data().topManagement || [], departments: docSnap.data().departments || [] }));
      else setDoc(doc(db, "hms_site", "org"), { bpo: [], topManagement: [], departments: [] });
      checkReady();
    }, () => checkReady());
  };

  if (loading) return <AppLoader text="HMS System Booting..." />;

  return (
    <ErrorBoundary>
      <Suspense fallback={<AppLoader text="HMS System Routing..." />}>
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
    </ErrorBoundary>
  );
}