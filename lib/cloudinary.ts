// Cloudinary configuration
export const cloudinaryConfig = {
  cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  apiKey: process.env.CLOUDINARY_API_KEY,
  apiSecret: process.env.CLOUDINARY_API_SECRET,
};

// Helper function to get Cloudinary image URL
export const getCloudinaryUrl = (publicId: string, options?: {
  width?: number;
  height?: number;
  crop?: string;
  quality?: string;
}) => {
  const { width, height, crop = 'fill', quality = 'auto' } = options || {};
  
  let transformations = `q_${quality}`;
  if (width) transformations += `,w_${width}`;
  if (height) transformations += `,h_${height}`;
  if (crop) transformations += `,c_${crop}`;
  
  return `https://res.cloudinary.com/${cloudinaryConfig.cloudName}/image/upload/${transformations}/${publicId}`;
};

// Helper function for uploading images (client-side)
export const uploadToCloudinary = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', 'enactus'); // You'll need to create this preset in Cloudinary
  
  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/image/upload`,
    {
      method: 'POST',
      body: formData,
    }
  );
  
  return response.json();
};
