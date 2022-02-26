import { v2 } from 'cloudinary';

// config cloudinary to upload image
v2.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
  secure: true,
 
});

export default v2;
