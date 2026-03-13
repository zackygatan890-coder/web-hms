import { useEffect } from 'react';

const SEOEngine = ({ name, title, desc, logo, verifyId }) => {
  useEffect(() => {
    let metaVerify = document.querySelector("meta[name='google-site-verification']");
    if (!metaVerify) {
      metaVerify = document.createElement('meta');
      metaVerify.name = "google-site-verification";
      document.head.appendChild(metaVerify);
    }
    metaVerify.content = verifyId || import.meta.env.VITE_GOOGLE_VERIFY_ID || "nihYa42GKBoxQBRqlO4WMxMFCRNpny9rS7-dO3LoDGQ";

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
  }, [name, title, desc, logo, verifyId]);

  return null;
};

export default SEOEngine;
