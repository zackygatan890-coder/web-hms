import React, { useState } from 'react';
import { Loader2, Send, CheckCircle, Download } from 'lucide-react';
import FileInput from './ui/FileInput';
import { uploadFileToCloudinary } from '../utils/imageUtils';

const OprecSection = ({ data, forcePreview }) => {
  const [formData, setFormData] = useState({ 
    nama: "", 
    nim: "", 
    wa: "", 
    pilihan1: "", 
    pilihan2: "" 
  });
  const [file, setFile] = useState({ berkasGabungan: null });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  
  const departmentsList = [
    "BUMH", 
    "Dept Internal", 
    "Dept Eksternal", 
    "Dept Kaderisasi", 
    "Dept Kesenian & Kerohanian", 
    "Dept Kominfo", 
    "Dept Peristek"
  ];

  const handleFileChange = (e, key) => { 
    if (e.target.files[0]) {
      setFile({ [key]: e.target.files[0] }); 
    } else {
      setFile({ [key]: null });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!data.identity.oprecUrl) { alert("Backend Oprec belum disetel."); return; }
    if (!file.berkasGabungan) { alert("Harap upload berkas gabungan Oprec terlebih dahulu."); return; }

    setIsSubmitting(true);
    try {
      const linkBerkas = await uploadFileToCloudinary(file.berkasGabungan);
      const payload = { 
        ...formData, 
        url_berkas: linkBerkas 
      };
      
      await fetch(data.identity.oprecUrl, { 
        method: "POST", 
        mode: "no-cors", 
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload) 
      });
      setSubmitStatus("success");
    } catch (err) { 
      alert(err.message); 
    } finally { 
      setIsSubmitting(false); 
    }
  };

  if (!data.identity.isOprecOpen && !forcePreview) return null;

  return (
    <section id="oprec" className="py-24 bg-emerald-950 text-white border-t border-emerald-900">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto bg-white text-neutral-900 p-12 rounded-[3.5rem] shadow-2xl relative flex flex-col items-center border border-neutral-100">
          <div className="absolute top-0 right-10 -translate-y-1/2 bg-emerald-600 text-white px-6 py-2 rounded-full font-black text-xs uppercase tracking-widest italic flex items-center justify-center shadow-lg">
            {data.sectionTitles?.oprecSubtitle || "Staff Recruitment"}
          </div>
          
          <h2 className="text-4xl md:text-5xl font-black mb-8 text-center text-emerald-950 uppercase italic tracking-tighter w-full">
            {data.sectionTitles?.oprecTitle || "Formulir Rekrutmen"}
          </h2>

          {/* Tombol Unduh Berkas */}
          <div className="w-full mb-12 flex justify-center border-b-2 border-dashed border-neutral-200 pb-10">
             <a href={data.identity.oprecFormUrl || "#"} target={data.identity.oprecFormUrl ? "_blank" : "_self"} rel="noreferrer" className="bg-neutral-900 hover:bg-black text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl flex items-center justify-center gap-3 transition-all hover:scale-105 active:scale-95 group border border-neutral-800">
                <Download size={20} className="group-hover:animate-bounce text-emerald-400" />
                1. Unduh Format Formulir Oprec Di Sini
             </a>
          </div>

          {submitStatus === 'success' ? (
            <div className="text-center py-12">
              <CheckCircle size={80} className="text-emerald-500 mx-auto mb-6"/>
              <h3 className="text-3xl font-black uppercase italic text-emerald-900 mb-2">Pendaftaran Berhasil!</h3>
              <p className="text-gray-500 font-medium">Berdasarkan data yang masuk, pendaftaran Anda telah kami terima.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-10 w-full">
              {/* Data Inti */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-neutral-50 p-8 rounded-[2rem] border border-neutral-100 shadow-inner">
                <div className="space-y-1 md:col-span-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-emerald-600 mb-1 flex items-center gap-2">Data Inti Calon Pengurus</label>
                </div>
                
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Nama Lengkap</label>
                  <input required className="w-full border-b-2 border-neutral-200 p-3 outline-none focus:border-emerald-600 bg-white font-bold rounded-t-lg transition shadow-sm" placeholder="Contoh: Budi Santoso" value={formData.nama} onChange={e=>setFormData({...formData, nama:e.target.value})}/>
                </div>
                
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">NIM</label>
                  <input required type="number" className="w-full border-b-2 border-neutral-200 p-3 outline-none focus:border-emerald-600 bg-white font-bold rounded-t-lg transition shadow-sm" placeholder="Contoh: 3336xxxxxx" value={formData.nim} onChange={e=>setFormData({...formData, nim:e.target.value})}/>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">No. WhatsApp Aktif</label>
                  <input required type="number" className="w-full border-b-2 border-neutral-200 p-3 outline-none focus:border-emerald-600 bg-white font-bold rounded-t-lg transition shadow-sm" placeholder="Contoh: 628123456789" value={formData.wa} onChange={e=>setFormData({...formData, wa:e.target.value})}/>
                </div>
                
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Pilihan 1</label>
                  <select required className="w-full border-b-2 border-neutral-200 p-3 outline-none focus:border-emerald-600 bg-white font-bold rounded-t-lg transition cursor-pointer shadow-sm" value={formData.pilihan1} onChange={e=>{
                    const val = e.target.value;
                    setFormData(prev => ({...prev, pilihan1: val, pilihan2: prev.pilihan2 === val ? "" : prev.pilihan2}));
                  }}>
                    <option value="">Pilih Departemen (Utama)</option>
                    {departmentsList.map(d=><option key={d} value={d} disabled={d === formData.pilihan2}>{d}</option>)}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Pilihan 2</label>
                  <select required className="w-full border-b-2 border-neutral-200 p-3 outline-none focus:border-emerald-600 bg-white font-bold rounded-t-lg transition cursor-pointer shadow-sm" value={formData.pilihan2} onChange={e=>{
                    const val = e.target.value;
                    setFormData(prev => ({...prev, pilihan2: val, pilihan1: prev.pilihan1 === val ? "" : prev.pilihan1}));
                  }}>
                    <option value="">Pilih Departemen (Alternatif)</option>
                    {departmentsList.map(d=><option key={d} value={d} disabled={d === formData.pilihan1}>{d}</option>)}
                  </select>
                </div>
              </div>

              {/* Upload File */}
              <div className="bg-emerald-50/50 p-8 rounded-[2rem] border-2 border-dashed border-emerald-200">
                <div className="max-w-md mx-auto flex flex-col items-center text-center space-y-4">
                  <span className="bg-emerald-600 text-white w-10 h-10 flex items-center justify-center rounded-full font-black text-xl mb-2 shadow-lg shadow-emerald-500/30">2</span>
                  <FileInput label="Upload Berkas Gabungan (.pdf)" onChange={e=>handleFileChange(e,'berkasGabungan')} required accept=".pdf"/>
                  <p className="text-xs text-neutral-500 font-medium leading-relaxed bg-white p-4 rounded-xl shadow-sm border border-emerald-100">
                    <span className="font-black text-emerald-700 uppercase tracking-widest text-[10px] block mb-2">Panduan Penggabungan Dokumen:</span>
                    Satukan Formulir Oprec yang sudah diisi, KRS, dan Transkrip Nilai menjadi 1 file PDF. <br/><br/>
                    Format penamaan wajib:<br/>
                    <strong className="text-black bg-emerald-100 px-2 py-1 rounded mt-1 inline-block">NamaLengkap_Formulir OPREC HMS 2025/2026.pdf</strong>
                  </p>
                </div>
              </div>

              {/* Submit Button */}
              <button disabled={isSubmitting} className="w-full bg-emerald-600 text-white font-black py-6 rounded-2xl flex justify-center items-center gap-4 uppercase tracking-[0.3em] text-sm hover:bg-emerald-500 transition-all shadow-[0_20px_50px_rgba(16,185,129,0.3)] active:scale-95 disabled:bg-gray-300 disabled:shadow-none border border-emerald-400">
                {isSubmitting ? <Loader2 className="animate-spin" size={24}/> : <Send size={24}/>} 
                Selesaikan Pendaftaran
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

export default OprecSection;
