module.exports = {
  env: {
    Google_API_KEY: process.env.Google_API_KEY,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    VITE_Google_API_KEY: process.env.Google_API_KEY,
    VITE_RESEND_API_KEY: process.env.RESEND_API_KEY,
    VITE_DEPLOYMENT_ENV: 'vercel',
    VITE_API_BASE_URL: 'https://fbconsulting.vercel.app'
  },
  // Note: Use environment variables for sensitive information
};
