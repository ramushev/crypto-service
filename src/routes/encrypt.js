const express = require('express');
const router = express.Router();
const { encrypt } = require('../crypto');

router.post('/', (req, res, next) => {
  try {
    const { text, aad } = req.body;
    const result = encrypt(text, aad);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
