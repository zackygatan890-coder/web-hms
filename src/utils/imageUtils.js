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
  formData.append('upload_preset', "hms_preset");
  
  const resourceType = 'auto'; // Revert back to auto because Cloudinary often blocks raw delivery with 401 Unauthorized
  
  const response = await fetch(`https://api.cloudinary.com/v1_1/dwqx4adqo/${resourceType}/upload`, {
    method: 'POST', body: formData
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.error?.message || "Gagal upload.");
  
  let finalUrl = result.secure_url;
  
  // Jika file adalah PDF dan diupload sebagai image, Cloudinary mungkin akan merender halaman pertama sebagai gambar.
  // Untuk memaksa browser mendownload/membuka PDF asli, kita tambahkan fl_attachment pada URL.
  const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
  if (isPdf) {
    if (!finalUrl.toLowerCase().endsWith('.pdf')) finalUrl += '.pdf';
    // Sisipkan fl_attachment ke dalam path URL Cloudinary (biasanya setelah /upload/)
    finalUrl = finalUrl.replace('/upload/', '/upload/fl_attachment/');
  }
  
  return finalUrl;
};
