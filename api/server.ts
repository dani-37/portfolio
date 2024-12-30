const express = require('express');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

app.use(cors());  // Enable CORS

app.use('/api', createProxyMiddleware({
  target: 'https://reason.gesdisc.eosdis.nasa.gov',  // NASA's server
  changeOrigin: true,
  pathRewrite: {'^/api': ''},
}));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
