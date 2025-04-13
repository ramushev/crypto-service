const request = require('supertest');
const app = require('../src/index');

describe('POST /v1/encrypt and /v1/decrypt', () => {
  it('roundtrips correctly', async () => {
    const enc = await request(app)
      .post('/v1/encrypt')
      .send({ text: 'hello' });
    const { iv, authTag, ciphertext } = enc.body;
    const dec = await request(app)
      .post('/v1/decrypt')
      .send({ iv, authTag, ciphertext });
    expect(dec.statusCode).toBe(200);
    expect(dec.body.text).toBe('hello');
  });
});
