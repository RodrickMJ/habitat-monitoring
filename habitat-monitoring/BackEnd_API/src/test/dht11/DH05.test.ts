import request from 'supertest';
import { app } from '../../app';

describe('DH05 - Obtener datos por ID inexistente', () => {
  it('Debe retornar 404 si el ID no existe', async () => {
    const response = await request(app).get('/api/v1/dht11/data/999999');
    expect(response.status).toBe(404);
  });
});
