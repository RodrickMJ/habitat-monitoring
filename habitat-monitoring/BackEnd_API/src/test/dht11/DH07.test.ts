import request from 'supertest';
import { app } from '../../app';

describe('DH07 - Validación de rangos de temperatura', () => {
  it('Debe retornar 400 si temperatura es demasiado baja', async () => {
    const res = await request(app)
      .post('/api/v1/dht11/data')
      .send({ temperature: -100, humidity: 50 });

    expect(res.status).toBe(400);
  });

  it('Debe retornar 400 si temperatura es demasiado alta', async () => {
    const res = await request(app)
      .post('/api/v1/dht11/data')
      .send({ temperature: 150, humidity: 50 });

    expect(res.status).toBe(400);
  });
});
