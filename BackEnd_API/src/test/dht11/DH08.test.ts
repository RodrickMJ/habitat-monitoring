import request from 'supertest';
import { app } from '../../app';

describe('DH08 - Validación de rangos de humedad', () => {
  it('Debe retornar 400 si humedad es demasiado baja', async () => {
    const res = await request(app)
      .post('/api/v1/dht11/data')
      .send({ temperature: 24, humidity: -10 });

    expect(res.status).toBe(400);
  });

  it('Debe retornar 400 si humedad es demasiado alta', async () => {
    const res = await request(app)
      .post('/api/v1/dht11/data')
      .send({ temperature: 24, humidity: 200 });

    expect(res.status).toBe(400);
  });
});
