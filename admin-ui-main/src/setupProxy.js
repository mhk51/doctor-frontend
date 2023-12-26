// setupProxy.js
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    '/patients',
    createProxyMiddleware({
      target: 'http://localhost:8000', // Replace with your Django server URL
      changeOrigin: true,
    })
  );
};
