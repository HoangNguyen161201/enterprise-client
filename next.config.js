/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    API_URL:  'http://localhost:4000', //'https://cmsserverhht.herokuapp.com'
    CLIENT_URL: 'http://localhost:3000',//'https://entershipweb.vercel.app',
    CLOUD_NAME: 'hoang161201',
    API_KEY: '127883878126518',
    API_SECRET: 'xZXAKvbsWtkYgsZZhG8OQrv5Kqs',
    UPLOAD_PRESET: 'ideaSubmission',
    UPLOAD_PRESET_AVATAR: 'avatar',
  },
};

module.exports = nextConfig;
