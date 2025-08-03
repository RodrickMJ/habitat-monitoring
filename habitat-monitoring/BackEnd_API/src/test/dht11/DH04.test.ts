import request from 'supertest';
import { app } from '../../app';

describe('DH04 - Obtener datos por ID válido', () => {
  let createdId: string;

  it('Debe crear un dato nuevo y extraer su ID', async () => {
    const res = await request(app)
      .post('/api/v1/dht11/data')
      .send({ temperature: 22.5, humidity: 55 });
    
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('data');
    expect(res.body.data).toHaveProperty('id');

    createdId = res.body.data.id;
  });

  it('Debe retornar 200 con los datos del sensor', async () => {
    const res = await request(app)
      .get(`/api/v1/dht11/data/${createdId}`);
    
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('data');
    expect(res.body.data).toHaveProperty('id', createdId);
  });
});
