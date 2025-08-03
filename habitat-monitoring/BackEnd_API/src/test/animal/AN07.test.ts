import request from 'supertest';
import { app } from '../../app'; // Asegúrate de que la ruta es correcta

describe('🛑 AN07 - Registro sin autenticación', () => {
  it('❌ No debe permitir registrar animal sin Authorization', async () => {
    const animalData = global.testHelper.createTestAnimal();

    const response = await request(app)
      .post('/api/v1/animal/register')
      .send(animalData);

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('error'); // opcional, si manejas mensaje de error
    console.log('🛑 AN07 - Response:', response.body);
  });
});
