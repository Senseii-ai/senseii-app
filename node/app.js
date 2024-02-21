const express = require('express');

const app = express();

app.get('/ping', (req, res) => {
  res.send('Pong');
});

app.listen(9090, () => {
  console.log('listening to port 9090');
});
