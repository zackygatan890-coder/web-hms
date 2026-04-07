import React from 'react';

const EditableText = ({ value, onChange, isEditMode, className, type = "text", placeholder = "Edit..." }) => {
  if (isEditMode) {
    if (type === "textarea") return (
      <textarea
        onClick={e => e.stopPropagation()}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        className={`outline-none resize-none ${className}`}
        rows={4}
      />
    );
    return (
      <input
        onClick={e => e.stopPropagation()}
        type="text"
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        className={`outline-none ${className}`}
        placeholder={placeholder}
      />
    );
  }
  return <span className={className}>{value}</span>;
};

export default EditableText;
