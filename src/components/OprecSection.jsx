import React, { useState } from 'react';
import { Loader2, Send, CheckCircle } from 'lucide-react';
import FileInput from './ui/FileInput';
import { uploadFileToCloudinary } from '../utils/imageUtils';

import EditableText from './ui/EditableText';

const OprecSection = ({ data, updateIdentity, updateDataText, isEditMode }) => {
  const [formData, setFormData] = useState({ nama: "", nim: "", angkatan: "", pilihan1: "", alasan1: "", pilihan2: "", alasan2: "" });
  const [files, setFiles] = useState({ formOprec: null, khs: null, krs: null, transkrip: null });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const departmentsList = ["BUMH", "Dept Internal", "Dept Eksternal", "Dept Kaderisasi", "Dept Kesenian & Kerohanian", "Dept Kominfo", "Dept Peristek"];

  const handleFileChange = (e, key) => { if (e.target.files[0]) setFiles(prev => ({ ...prev, [key]: e.target.files[0] })); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!data.identity.oprecUrl) { alert("Backend Oprec belum disetel."); return; }
    setIsSubmitting(true);
    try {
      const linkForm = await uploadFileToCloudinary(files.formOprec);
      const linkKHS = await uploadFileToCloudinary(files.khs);
      const linkKRS = await uploadFileToCloudinary(files.krs);
      const linkTranskrip = await uploadFileToCloudinary(files.transkrip);
      const payload = { ...formData, link_form: linkForm, link_khs: linkKHS, link_krs: linkKRS, link_transkrip: linkTranskrip };
      await fetch(data.identity.oprecUrl, { method: "POST", mode: "no-cors", body: JSON.stringify(payload) });
      setSubmitStatus("success");
    } catch (err) { alert(err.message); } finally { setIsSubmitting(false); }
  };

  if (!data.identity.isOprecOpen && !isEditMode) return null;

  return (
    <section id="oprec" className="py-24 bg-emerald-950 text-white border-t border-emerald-900">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto bg-white text-neutral-900 p-12 rounded-[3.5rem] shadow-2xl relative flex flex-col items-center">
          <div className="absolute top-0 right-10 -translate-y-1/2 bg-emerald-600 text-white px-6 py-2 rounded-full font-black text-xs uppercase tracking-widest italic flex items-center justify-center">
            <EditableText value={data.sectionTitles?.oprecSubtitle || "Staff Recruitment"} onChange={v=>updateDataText('sectionTitles', 'oprecSubtitle', v)} isEditMode={isEditMode} className="bg-transparent text-white text-center w-full" />
          </div>
          <h2 className="text-4xl md:text-5xl font-black mb-12 text-center text-emerald-950 uppercase italic tracking-tighter w-full">
            <EditableText value={data.sectionTitles?.oprecTitle || "Formulir Rekrutmen"} onChange={v=>updateDataText('sectionTitles', 'oprecTitle', v)} isEditMode={isEditMode} className="w-full text-center bg-transparent" />
          </h2>
          {isEditMode && (<div className="mb-10 p-6 bg-neutral-100 rounded-2xl border-2 border-dashed border-emerald-500">
            <p className="text-[10px] font-black uppercase text-emerald-800 mb-4">Oprec Configuration:</p>
            <input value={data.identity.oprecUrl||""} onChange={e=>updateIdentity('oprecUrl', e.target.value)} className="w-full p-2 text-xs border rounded-lg bg-white" placeholder="URL Backend Google Script..."/>
            <label className="flex items-center gap-3 cursor-pointer mt-4"><input type="checkbox" checked={data.identity.isOprecOpen} onChange={e=>updateIdentity('isOprecOpen', e.target.checked)}/><span className="text-sm font-bold uppercase tracking-widest">Buka Open Recruitment</span></label>
          </div>)}
          {submitStatus === 'success' ? (
            <div className="text-center py-12"><CheckCircle size={80} className="text-emerald-500 mx-auto mb-6"/><h3 className="text-3xl font-black uppercase italic text-emerald-900">Pendaftaran Berhasil!</h3><p className="text-gray-500 mt-2">Pendaftaran Anda telah kami terima.</p></div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-1"><label className="text-[10px] font-black uppercase text-gray-400">Nama Lengkap</label><input required className="w-full border-b-2 p-2 outline-none focus:border-emerald-600 bg-gray-50/50 font-bold" value={formData.nama} onChange={e=>setFormData({...formData, nama:e.target.value})}/></div>
                <div className="space-y-1"><label className="text-[10px] font-black uppercase text-gray-400">Pilihan Departemen</label><select required className="w-full border-b-2 p-2 outline-none bg-gray-50/50 font-bold" value={formData.pilihan1} onChange={e=>setFormData({...formData, pilihan1:e.target.value})}><option value="">Pilih Departemen...</option>{departmentsList.map(d=><option key={d} value={d}>{d}</option>)}</select></div>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4"><FileInput label="KHS PDF" onChange={e=>handleFileChange(e,'khs')} required accept=".pdf"/><FileInput label="KRS PDF" onChange={e=>handleFileChange(e,'krs')} required accept=".pdf"/><FileInput label="Transkrip" onChange={e=>handleFileChange(e,'transkrip')} required accept=".pdf"/><FileInput label="Form Oprec" onChange={e=>handleFileChange(e,'formOprec')} required accept=".pdf"/></div>
              <button disabled={isSubmitting} className="w-full bg-emerald-600 text-white font-black py-6 rounded-2xl flex justify-center items-center gap-4 uppercase tracking-widest text-lg hover:bg-emerald-700 transition-all shadow-xl active:scale-95 disabled:bg-gray-300">
                {isSubmitting ? <Loader2 className="animate-spin" size={32}/> : <Send size={32}/>} SUBMIT PENDAFTARAN
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

export default OprecSection;
