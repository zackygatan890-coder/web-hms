import React, { useState } from 'react';
import { Loader2, Send, CheckCircle, MessageCircle } from 'lucide-react';
import FileInput from './ui/FileInput';
import { uploadFileToCloudinary } from '../utils/imageUtils';

import EditableText from './ui/EditableText';

const MabaSection = ({ data, updateIdentity, updateDataText, isEditMode }) => {
  const [formData, setFormData] = useState({ nama: "", alamat: "", wa: "", jalur: "" });
  const [buktiFile, setBuktiFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [submittedName, setSubmittedName] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!data.identity.mabaUrl) { alert("Admin belum mengatur URL Database Maba."); return; }
    
    if (!buktiFile) {
      alert("Harap unggah bukti kelulusan yang valid (Maks 200KB).");
      return;
    }

    setIsSubmitting(true);
    try {
      const linkBukti = await uploadFileToCloudinary(buktiFile);
      const payload = { ...formData, link_bukti: linkBukti };
      await fetch(data.identity.mabaUrl, { method: "POST", mode: "no-cors", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      setSubmittedName(formData.nama);
      setSubmitStatus("success"); 
      setFormData({ nama: "", alamat: "", wa: "", jalur: "" }); 
      setBuktiFile(null);
    } catch (err) { alert("Error: " + err.message); } finally { setIsSubmitting(false); }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 200 * 1024) {
        alert("Ukuran file bukti kelulusan maksimal 200KB!");
        e.target.value = "";
        setBuktiFile(null);
      } else {
        setBuktiFile(file);
      }
    } else {
      setBuktiFile(null);
    }
  };

  if (!data.identity.isMabaOpen && !isEditMode) return null;

  return (
    <section id="maba-portal" className="py-20 bg-neutral-900 text-white border-t border-neutral-800">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-12 items-center">
          <div className="lg:w-1/2 text-center lg:text-left flex flex-col items-center lg:items-start">
            <span className="inline-block bg-yellow-500 text-black font-black px-4 py-1 text-[10px] rounded mb-6 animate-pulse tracking-widest uppercase items-center">
              <EditableText value={data.sectionTitles?.mabaSubtitle || "Portal Mahasiswa Baru"} onChange={v=>updateDataText('sectionTitles', 'mabaSubtitle', v)} isEditMode={isEditMode} className="bg-transparent text-black" />
            </span>
            <h2 className="text-4xl md:text-5xl font-black mb-6 leading-tight uppercase italic tracking-tighter w-full text-center lg:text-left flex flex-col">
              <EditableText value={data.sectionTitles?.mabaTitle || "Pendataan Angkatan 2025"} onChange={v=>updateDataText('sectionTitles', 'mabaTitle', v)} isEditMode={isEditMode} className="w-full bg-transparent" />
            </h2>
            <p className="text-gray-400 text-sm mb-10 leading-relaxed max-w-md w-full text-center lg:text-left flex flex-col">
              <EditableText value={data.sectionTitles?.mabaDesc || "Pendataan resmi mahasiswa baru Teknik Sipil Untirta. Seluruh data dijamin keamanannya oleh Himpunan."} onChange={v=>updateDataText('sectionTitles', 'mabaDesc', v)} isEditMode={isEditMode} type="textarea" className="w-full bg-transparent" />
            </p>
            {isEditMode && (
              <div className="bg-white/10 p-6 rounded-2xl border border-white/20 backdrop-blur-md">
                <p className="text-[10px] font-black text-yellow-400 uppercase tracking-widest mb-4">Maba Script Config:</p>
                <input value={data.identity.mabaUrl || ""} onChange={e=>updateIdentity('mabaUrl', e.target.value)} className="w-full p-2 text-xs bg-black/50 border border-neutral-700 rounded text-white mb-3" placeholder="Link Script POST..."/>
                <input value={data.identity.mabaCpWa || ""} onChange={e=>updateIdentity('mabaCpWa', e.target.value)} className="w-full p-2 text-xs bg-black/50 border border-neutral-700 rounded text-white" placeholder="No. WA CP Maba (Format: 628...)"/>
                <label className="flex items-center gap-3 cursor-pointer mt-4"><input type="checkbox" checked={data.identity.isMabaOpen} onChange={e=>updateIdentity('isMabaOpen', e.target.checked)}/><span className="text-sm font-bold uppercase tracking-widest">Buka Portal Maba</span></label>
              </div>
            )}
          </div>
          <div className="lg:w-1/2 w-full">
            <div className="bg-white text-neutral-900 p-8 rounded-[2.5rem] shadow-2xl border-t-[10px] border-yellow-500">
               {submitStatus === 'success' ? (
                 <div className="text-center py-10">
                   <CheckCircle size={64} className="text-green-500 mx-auto mb-4"/>
                   <h3 className="text-2xl font-black mb-2 uppercase italic tracking-tighter">Data Terdata!</h3>
                   <p className="text-gray-500 text-sm mb-6 leading-relaxed max-w-sm mx-auto font-medium">Langkah selanjutnya, silakan hubungi <strong className="text-black">Contact Person</strong> kami via WhatsApp untuk masuk ke grup angkatan.</p>
                   
                   <a 
                     href={`https://wa.me/${data.identity.mabaCpWa || '628xxxxxxxxxx'}?text=Halo Kak, perkenalkan nama saya ${submittedName}, mahasiswa baru Teknik Sipil angkatan 2026. Saya sudah mengisi pendataan maba dan bermaksud meminta link grup angkatan. Terima kasih!`} 
                     target="_blank" 
                     rel="noreferrer" 
                     className="bg-green-500 text-white font-black py-4 px-6 rounded-2xl flex justify-center items-center gap-2 uppercase tracking-widest shadow-xl shadow-green-500/30 hover:bg-green-600 active:scale-95 transition w-full mb-6"
                   >
                     <MessageCircle size={20} /> Hubungi Admin
                   </a>
                   
                   <button onClick={() => {setSubmitStatus(null); setSubmittedName("");}} className="text-neutral-400 font-bold underline text-[10px] uppercase tracking-widest hover:text-black transition flex items-center gap-2 justify-center mx-auto">
                     Kembali ke Form Utama
                   </button>
                 </div>
               ) : (
                 <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase text-gray-400">Nama Lengkap</label>
                      <input required className="w-full border-b-2 p-2 outline-none focus:border-yellow-500 bg-neutral-50 font-bold" value={formData.nama} onChange={e=>setFormData({...formData, nama:e.target.value})}/>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase text-gray-400">Alamat Lengkap</label>
                      <textarea required className="w-full border-b-2 p-2 outline-none focus:border-yellow-500 bg-neutral-50 font-bold resize-none" rows="2" value={formData.alamat} onChange={e=>setFormData({...formData, alamat:e.target.value})}/>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase text-gray-400">No. WhatsApp</label>
                        <input required type="number" className="w-full border-b-2 p-2 outline-none focus:border-yellow-500 bg-neutral-50 font-bold" value={formData.wa} onChange={e=>setFormData({...formData, wa:e.target.value})}/>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase text-gray-400">Jalur Masuk</label>
                        <select required className="w-full border-b-2 p-2 outline-none focus:border-yellow-500 bg-neutral-50 font-bold" value={formData.jalur} onChange={e=>setFormData({...formData, jalur:e.target.value})}>
                          <option value="">Pilih Jalur</option>
                          <option value="SNBP">SNBP</option>
                          <option value="SNBT">SNBT</option>
                          <option value="Mandiri">Mandiri / Lainnya</option>
                        </select>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <FileInput label="Bukti Kelulusan (Maks 200KB)" onChange={handleFileChange} required accept="image/*,application/pdf" />
                    </div>
                    <button disabled={isSubmitting} className="w-full bg-neutral-950 text-white font-black py-4 rounded-2xl flex justify-center items-center gap-2 uppercase tracking-widest mt-6 hover:bg-black transition shadow-xl disabled:bg-gray-400">
                      {isSubmitting ? <Loader2 className="animate-spin" size={20}/> : <Send size={20}/>} KIRIM DATA
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

export default MabaSection;
