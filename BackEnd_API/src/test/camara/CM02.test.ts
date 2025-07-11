import request from 'supertest';
import { app } from '../../app';

describe('CM02 - Apagar cámara exitosamente', () => {
  let authToken: string;

  beforeAll(async () => {
    const userEmail = 'cm02@hamster.com';
    const password = 'Secure123!';

    await request(app).post('/api/v1/auth/register').send({
      name: "Cam",
      lastname: "Off",
      email: userEmail,
      password: password,
    });

    const loginRes = await request(app).post('/api/v1/auth/login').send({
      email: userEmail,
      password: password,
    });

    authToken = loginRes.body.token;
  });

  it('Debe apagar la cámara y responder 200', async () => {
    const response = await request(app)
      .get('/api/v1/camera/off')
      .set('Authorization', `Bearer ${authToken}`);

    expect(response.status).toBe(200);
  });
});
