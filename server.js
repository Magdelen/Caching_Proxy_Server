require('dotenv').config();
const path = require('path');
const express = require('express');
const proxyRoute = require('./routes/proxy');

const app = express();
const PORT = process.env.PORT || 3000;

app.use('/api', proxyRoute);
app.use('/admin', express.static(path.join(__dirname, 'public')));

app.listen(PORT, () => {
  console.log(`Caching proxy server running on http://localhost:${PORT}`);
});
