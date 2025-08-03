import request from 'supertest';
import { app } from '../../app';

jest.mock('../../../src/camera/application/CameraOnUseCase', () => {
  return {
    CameraOnUseCase: jest.fn().mockImplementation(() => ({
      run: jest.fn().mockRejectedValue(new Error('Error interno simulado al encender')),
    })),
  };
});

describe('CM03 - Error interno al encender cámara', () => {
  let authToken: string;

  beforeAll(async () => {
    const email = 'cm03@hamster.com';

    await request(app).post('/api/v1/auth/register').send({
      name: "Cam",
      lastname: "ErrorOn",
      email,
      password: "Secure123!"
    });

    const loginRes = await request(app).post('/api/v1/auth/login').send({
      email,
      password: "Secure123!"
    });

    authToken = loginRes.body.token;
  });

  it('Debe responder 500 si falla al encender la cámara', async () => {
    const res = await request(app)
      .get('/api/v1/camera/on')
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(500);
  });
});
