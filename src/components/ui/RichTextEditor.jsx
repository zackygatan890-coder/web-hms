import React from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const RichTextEditor = ({ value, onChange, placeholder, className, isEditMode }) => {

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{'list': 'ordered'}, {'list': 'bullet'}],
      ['link'],
      ['clean']
    ],
  };

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet',
    'link'
  ];

  if (!isEditMode) {
    // Dalam mode publish, render HTML langsung
    return (
      <div 
        className={`ql-editor-content ${className || ''}`}
        dangerouslySetInnerHTML={{ __html: value || '' }}
      />
    );
  }

  // Dalam mode edit, tampilkan Editor
  return (
    <div className={`rich-text-container ${className || ''}`}>
      <ReactQuill 
        theme="snow" 
        value={value || ''} 
        onChange={onChange} 
        modules={modules}
        formats={formats}
        placeholder={placeholder || "Tulis konten di sini..."}
        className="bg-white text-black rounded-lg overflow-hidden"
      />
    </div>
  );
};

export default RichTextEditor;
