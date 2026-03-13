import React from 'react';
import { FileText } from 'lucide-react';

const FileInput = ({ label, onChange, required, accept }) => (
  <div className="mb-3">
    <label className="block text-xs font-bold text-gray-500 mb-1 flex items-center gap-1"><FileText size={12} className="text-emerald-600"/> {label} {required && <span className="text-red-500">*</span>}</label>
    <input type="file" onChange={onChange} required={required} accept={accept} className="block w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 cursor-pointer border border-gray-200 rounded-lg"/>
  </div>
);

export default FileInput;
