import request from 'supertest';
import { app } from '../../app';

describe('❗ AN08 - Validación de tipos de datos', () => {
  let authToken: string;

  beforeAll(async () => {
    // Registrar usuario
    await request(app)
      .post('/api/v1/auth/register')
      .send({
        name: "TipoErrorUser",
        lastname: "Tester",
        email: "tipo.error@hamster.com",
        password: "ValidPass123!"
      });

    // Iniciar sesión
    const loginResponse = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: "tipo.error@hamster.com",
        password: "ValidPass123!"
      });

    authToken = loginResponse.body.token;
  });

  it('❌ Debe fallar al registrar animal con tipos incorrectos', async () => {
    const invalidAnimalData = {
      name: 12345,              // número en lugar de string
      breed: "TestBreed",
      species: true,            // booleano en lugar de string
      age: "tres",              // string en lugar de número
      gender: "Male",
      color: "Brown",
      size: "Medium",
      notes: "Tipo incorrecto"
    };

    const response = await request(app)
      .post('/api/v1/animal/register')
      .set('Authorization', `Bearer ${authToken}`)
      .send(invalidAnimalData);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toMatch(/name.*string/i);     // valida que diga algo sobre name
    expect(response.body.message).toMatch(/species.*string/i);  
    expect(response.body.message).toMatch(/age.*number/i);     

    console.log('🧪 AN08 - Response:', response.body);
  });

  afterAll(async () => {
    try {
      await global.testHelper?.cleanUserData("tipo.error@hamster.com");
    } catch (error) {
      console.warn('⚠️ Error limpiando usuario AN08:', error);
    }
  });
});
