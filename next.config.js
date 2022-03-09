/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    API_URL: 'https://cmsserverhht.herokuapp.com',
    CLIENT_URL: 'https://entershipweb.vercel.app',
    CLOUD_NAME: 'hoang161201',
    API_KEY: '127883878126518',
    API_SECRET: 'xZXAKvbsWtkYgsZZhG8OQrv5Kqs',
    UPLOAD_PRESET: 'ideaSubmission',
    UPLOAD_PRESET_AVATAR: 'avatar',
  },
};

module.exports = nextConfig;
