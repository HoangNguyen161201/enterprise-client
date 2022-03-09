/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    API_URL: 'https://cms-server-fxwc.onrender.com',
    CLOUD_NAME: 'hoang161201',
    API_KEY: '127883878126518',
    API_SECRET: 'xZXAKvbsWtkYgsZZhG8OQrv5Kqs',
    UPLOAD_PRESET: 'ideaSubmission',
    UPLOAD_PRESET_AVATAR: 'avatar',
  },
};

module.exports = nextConfig;
