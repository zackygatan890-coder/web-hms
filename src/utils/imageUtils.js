export const compressImage = (file, maxWidth = 1000) => {
  return new Promise((resolve) => {
    if (!file.type.startsWith('image/')) { resolve(file); return; }
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = Math.min(img.width, maxWidth);
        canvas.height = img.height * (canvas.width / img.width);
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        canvas.toBlob((blob) => {
          resolve(new File([blob], file.name.replace(/\.[^/.]+$/, "") + ".webp", { type: 'image/webP' }));
        }, 'image/webP', 0.8);
      };
    };
  });
};

export const uploadFileToCloudinary = async (file) => {
  if (!file) return "-";
  const compressedFile = await compressImage(file);
  const formData = new FormData();
  formData.append('file', compressedFile);
  formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);
  const response = await fetch(`https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/auto/upload`, {
    method: 'POST', body: formData
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.error?.message || "Gagal upload.");
  return result.secure_url;
};
