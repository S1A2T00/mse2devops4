const express = require('express');

const app = express();
const PORT = 8080;

app.get('/health', (req, res) => {
  res.json({ status: 'OK' });
});

app.listen(PORT, () => {
  console.log(`API listening on port ${PORT}`);
});
