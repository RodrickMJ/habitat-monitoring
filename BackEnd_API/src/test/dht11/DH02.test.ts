import request from 'supertest';
import { app } from '../../app';

describe('DH02 - Validación de campos requeridos', () => {
  it('Debe retornar 400 si falta temperatura', async () => {
    const response = await request(app)
      .post('/api/v1/dht11/data')
      .send({ humidity: 50 });

    expect(response.status).toBe(400);
  });

  it('Debe retornar 400 si falta humedad', async () => {
    const response = await request(app)
      .post('/api/v1/dht11/data')
      .send({ temperature: 24 });

    expect(response.status).toBe(400);
  });
});
