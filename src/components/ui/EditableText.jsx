import React from 'react';

const EditableText = ({ value, onChange, isEditMode, className, type = "text", placeholder = "Edit..." }) => {
  if (isEditMode) {
    if (type === "textarea") return <textarea onClick={e => e.stopPropagation()} value={value || ""} onChange={(e) => onChange(e.target.value)} className={`w-full bg-black/50 border border-emerald-500 rounded p-2 text-white ${className}`} rows={4}/>;
    return <input onClick={e => e.stopPropagation()} type="text" value={value || ""} onChange={(e) => onChange(e.target.value)} className={`w-full bg-black/50 border-b border-emerald-500 text-white px-1 ${className}`} placeholder={placeholder}/>;
  }
  return <span className={className}>{value}</span>;
};

export default EditableText;
