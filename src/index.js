const express = require('express');
const encryptRoute = require('./routes/encrypt');
const decryptRoute = require('./routes/decrypt');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.get('/health', (_, res) => res.json({ status: 'ok' }));
app.use('/v1/encrypt', encryptRoute);
app.use('/v1/decrypt', decryptRoute);
app.use(errorHandler);

if (require.main === module) {
  app.listen(port, () =>
    console.log(`Crypto service listening on port ${port}`)
  );
}

module.exports = app;
