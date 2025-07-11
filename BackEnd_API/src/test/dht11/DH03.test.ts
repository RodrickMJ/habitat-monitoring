import request from 'supertest';
import { app } from '../../app';

describe('DH03 - Obtener todos los datos del sensor', () => {
  it('Debe responder con status 200 y un arreglo de datos', async () => {
    const response = await request(app).get('/api/v1/dht11/data');

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body.data)).toBe(true);

  });
});
