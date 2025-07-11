import request from 'supertest';
import { app } from '../../app';

jest.mock('../../../src/camera/application/CameraOffUseCase', () => {
  return {
    CameraOffUseCase: jest.fn().mockImplementation(() => ({
      run: jest.fn().mockRejectedValue(new Error('Error interno simulado al apagar')),
    })),
  };
});

describe('CM04 - Error interno al apagar cámara', () => {
  let authToken: string;

  beforeAll(async () => {
    const email = 'cm04@hamster.com';

    await request(app).post('/api/v1/auth/register').send({
      name: "Cam",
      lastname: "ErrorOff",
      email,
      password: "Secure123!"
    });

    const loginRes = await request(app).post('/api/v1/auth/login').send({
      email,
      password: "Secure123!"
    });

    authToken = loginRes.body.token;
  });

  it('Debe responder 500 si falla al apagar la cámara', async () => {
    const res = await request(app)
      .get('/api/v1/camera/off')
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(500);
  });
});
