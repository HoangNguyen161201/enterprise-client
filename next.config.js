/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    API_URL: 'https://cms-server-fxwc.onrender.com',
    CLIENT_URL: 'https://entershipweb-9tb11ug2z-hoangnguyen161201.vercel.app',
    CLOUD_NAME: 'hoang161201',
    API_KEY: '127883878126518',
    API_SECRET: 'xZXAKvbsWtkYgsZZhG8OQrv5Kqs',
    UPLOAD_PRESET: 'ideaSubmission',
    UPLOAD_PRESET_AVATAR: 'avatar',
  },
};

module.exports = nextConfig;
