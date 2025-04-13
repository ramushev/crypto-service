const express = require('express');
const router = express.Router();
const { decrypt } = require('../crypto');

router.post('/', (req, res, next) => {
  try {
    const { iv, authTag, ciphertext, aad } = req.body;
    const text = decrypt(iv, authTag, ciphertext, aad);
    res.json({ text });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
