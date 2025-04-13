const request = require('supertest');
const app = require('../src/index');

describe('POST /v1/encrypt', () => {
  it('encrypts text', async () => {
    const res = await request(app)
      .post('/v1/encrypt')
      .send({ text: 'hello' });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('ciphertext');
    expect(res.body).toHaveProperty('iv');
    expect(res.body).toHaveProperty('authTag');
  });
});
