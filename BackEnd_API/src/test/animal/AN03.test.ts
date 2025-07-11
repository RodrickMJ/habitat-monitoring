import request from 'supertest';
import { app } from '../../app';

describe('🔍 DEBUG AN03 - Diagnóstico de Get Animal', () => {
  let authToken: string;
  let testAnimalId: string;

  beforeEach(async () => {
    // Registrar usuario
    await request(app)
      .post('/api/v1/auth/register')
      .send({
        name: "TestUser",
        lastname: "Debug",
        email: "debug.an03@hamster.com",
        password: "Secure123!"
      });

    // Login
    const loginResponse = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: "debug.an03@hamster.com",
        password: "Secure123!"
      });

    authToken = loginResponse.body.token;
    
    console.log('🔍 DEBUG - Login response:', JSON.stringify(loginResponse.body, null, 2));

    // Crear animal
    const animalResponse = await request(app)
      .post('/api/v1/animal/register')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        name: "Debug Animal",
        breed: "Test Breed",
        species: "Perro",
        age: 3,
        gender: "Male",
        color: "Brown",
        size: "Medium",
        notes: "Debug animal"
      });

    console.log('🔍 DEBUG - Animal creation response:', JSON.stringify(animalResponse.body, null, 2));
    testAnimalId = animalResponse.body.animal?.id;
    console.log('🔍 DEBUG - Animal ID:', testAnimalId);
  });

  it('🔍 DEBUG: Verificar get animal', async () => {
    console.log('🔍 DEBUG - Intentando obtener animal con ID:', testAnimalId);
    console.log('🔍 DEBUG - Token:', authToken ? 'Available' : 'Missing');

    const response = await request(app)
      .get(`/api/v1/animal/${testAnimalId}`)
      .set('Authorization', `Bearer ${authToken}`);

    console.log('🔍 DEBUG - Get response status:', response.status);
    console.log('🔍 DEBUG - Get response body:', JSON.stringify(response.body, null, 2));
    console.log('🔍 DEBUG - Get response headers:', JSON.stringify(response.headers, null, 2));

    // No hacer assertions, solo mostrar información
    if (response.status === 400) {
      console.log('❌ Error 400 - Posibles causas:');
      console.log('   1. Problema de tipos userId (number vs string)');
      console.log('   2. Animal no encontrado en DB');
      console.log('   3. Mismatch en ownerId');
      console.log('   4. Error en use case o repository');
    }
  });

  afterEach(async () => {
    try {
      await global.testHelper?.cleanUserData("debug.an03@hamster.com");
    } catch (error) {
      console.warn('⚠️ Error limpiando:', error);
    }
  });
});