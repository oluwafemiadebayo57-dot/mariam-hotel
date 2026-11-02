export const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append('image', file);

  // Uses the API key from your .env.local file
  const response = await fetch(`https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMGBB_API_KEY}`, {
    method: 'POST',
    body: formData,
  });

  const data = await response.json();
  
  if (data.success) {
    return data.data.url; // Returns the direct image link
  } else {
    throw new Error("Image upload failed");
  }
};