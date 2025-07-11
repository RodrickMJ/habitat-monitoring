import request from 'supertest';
import { app } from '../../app';

describe('DH06 - Validación de formato de ID inválido', () => {
  it('Debe retornar 400 si el ID no es numérico', async () => {
    const response = await request(app).get('/api/v1/dht11/data/abc');
    expect(response.status).toBe(400);
  });
});
