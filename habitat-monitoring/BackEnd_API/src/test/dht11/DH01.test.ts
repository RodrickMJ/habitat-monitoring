import request from 'supertest';
import { app } from '../../app';

describe('DH01 - Guardar datos de sensor exitosamente', () => {
  it('Debe guardar correctamente y responder 201', async () => {
    const response = await request(app)
      .post('/api/v1/dht11/data')
      .send({ temperature: 25.4, humidity: 60.2 });

    expect(response.status).toBe(201);
    expect(response.body.message).toContain('DHT11 data saved successfully');
  });
});
