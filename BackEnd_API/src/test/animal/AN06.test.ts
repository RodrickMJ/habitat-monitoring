import request from 'supertest';
import { app } from '../../app';

describe('AN06 - Obtener lista de todos los animales', () => {
  let authToken: string;
  let createdAnimalIds: string[] = [];

  beforeEach(async () => {
    // Registrar usuario para las pruebas
    await request(app)
      .post('/api/v1/auth/register')
      .send({
        name: "TestUser",
        lastname: "AllAnimals",
        email: "testuser.allanimals@hamster.com",
        password: "Secure123!"
      });

    // Hacer login para obtener token
    const loginResponse = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: "testuser.allanimals@hamster.com",
        password: "Secure123!"
      });

    authToken = loginResponse.body.token;

    // Crear múltiples animales para las pruebas
    const animalsData = [
      {
        name: "Luna Test",
        breed: "Golden Retriever",
        species: "Perro",
        age: 3,
        gender: "Female",
        color: "Golden",
        size: "Large",
        notes: "Primer animal de prueba"
      },
      {
        name: "Max Test",
        breed: "Siamés",
        species: "Gato",
        age: 2,
        gender: "Male",
        color: "White",
        size: "Medium",
        notes: "Segundo animal de prueba"
      },
      {
        name: "Polly Test",
        breed: "Canario",
        species: "Ave",
        age: 1,
        gender: "Female",
        color: "Yellow",
        size: "Small",
        notes: "Tercer animal de prueba"
      }
    ];

    // Crear todos los animales
    for (const animalData of animalsData) {
      const response = await request(app)
        .post('/api/v1/animal/register')
        .set('Authorization', `Bearer ${authToken}`)
        .send(animalData);
      
      if (response.body.animal?.id) {
        createdAnimalIds.push(response.body.animal.id);
      }
    }
  });

  it('should retrieve all animals successfully when user is authenticated', async () => {
    // Act - Obtener lista de todos los animales
    const response = await request(app)
      .get('/api/v1/animal/all')
      .set('Authorization', `Bearer ${authToken}`);

    // Assert - Verificar respuesta exitosa
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('success', true);
    expect(response.body).toHaveProperty('animals');  // ✅ CAMBIADO: 'animals' en lugar de 'message'
    expect(Array.isArray(response.body.animals)).toBe(true);  // ✅ CAMBIADO: 'animals' en lugar de 'data'
    expect(response.body.animals.length).toBe(3); // Debe devolver los 3 animales creados
  });

  it('should return correct animal data structure in the list', async () => {
    // Act - Obtener lista de animales
    const response = await request(app)
      .get('/api/v1/animal/all')
      .set('Authorization', `Bearer ${authToken}`);

    // Assert - Verificar estructura de cada animal en la lista
    expect(response.status).toBe(200);
    expect(response.body.animals).toBeDefined();  // ✅ CAMBIADO: 'animals'
    expect(Array.isArray(response.body.animals)).toBe(true);  // ✅ CAMBIADO: 'animals'

    // Verificar que cada animal tiene la estructura correcta
    response.body.animals.forEach((animal: any) => {  // ✅ CAMBIADO: 'animals'
      expect(animal).toHaveProperty('id');
      expect(animal).toHaveProperty('name');
      expect(animal).toHaveProperty('species');
      expect(animal).toHaveProperty('breed');
      expect(animal).toHaveProperty('age');
      expect(animal).toHaveProperty('gender');
      expect(animal).toHaveProperty('color');
      expect(animal).toHaveProperty('size');
      expect(animal).toHaveProperty('ownerId');
      expect(animal).toHaveProperty('notes');
      
      // Verificar tipos de datos
      expect(typeof animal.id).toBe('string');
      expect(typeof animal.name).toBe('string');
      expect(typeof animal.species).toBe('string');
      expect(typeof animal.age).toBe('number');
    });
  });

  it('should return animals belonging only to the authenticated user', async () => {
    // Arrange - Crear otro usuario con sus animales
    await request(app)
      .post('/api/v1/auth/register')
      .send({
        name: "OtherUser",
        lastname: "Test",
        email: "otheruser.allanimals@hamster.com",
        password: "Secure123!"
      });

    const otherLoginResponse = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: "otheruser.allanimals@hamster.com",
        password: "Secure123!"
      });

    const otherUserToken = otherLoginResponse.body.token;

    // Crear animal del otro usuario
    await request(app)
      .post('/api/v1/animal/register')
      .set('Authorization', `Bearer ${otherUserToken}`)
      .send({
        name: "Animal Otro Usuario",
        breed: "Labrador",
        species: "Perro",
        age: 4,
        gender: "Male",
        color: "Black",
        size: "Large",
        notes: "Animal que no debe aparecer en la lista del primer usuario"
      });

    // Act - Usuario original obtiene su lista
    const response = await request(app)
      .get('/api/v1/animal/all')
      .set('Authorization', `Bearer ${authToken}`);

    // Assert - Solo debe ver sus propios animales (3), no el del otro usuario
    expect(response.status).toBe(200);
    expect(response.body.animals.length).toBe(3);  // ✅ CAMBIADO: 'animals'
    
    // Verificar que ningún animal en la lista pertenece al otro usuario
    const animalNames = response.body.animals.map((animal: any) => animal.name);  // ✅ CAMBIADO: 'animals'
    expect(animalNames).not.toContain('Animal Otro Usuario');
    expect(animalNames).toContain('Luna Test');
    expect(animalNames).toContain('Max Test');
    expect(animalNames).toContain('Polly Test');
  });

  it('should return empty array when user has no animals', async () => {
    // Arrange - Crear usuario nuevo sin animales
    await request(app)
      .post('/api/v1/auth/register')
      .send({
        name: "EmptyUser",
        lastname: "Test",
        email: "emptyuser.allanimals@hamster.com",
        password: "Secure123!"
      });

    const emptyUserLoginResponse = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: "emptyuser.allanimals@hamster.com",
        password: "Secure123!"
      });

    const emptyUserToken = emptyUserLoginResponse.body.token;

    // Act - Usuario sin animales obtiene su lista
    const response = await request(app)
      .get('/api/v1/animal/all')
      .set('Authorization', `Bearer ${emptyUserToken}`);

    // Assert - Debe devolver array vacío
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('success', true);
    expect(response.body).toHaveProperty('animals');  // ✅ CAMBIADO: 'animals'
    expect(Array.isArray(response.body.animals)).toBe(true);  // ✅ CAMBIADO: 'animals'
    expect(response.body.animals.length).toBe(0);  // ✅ CAMBIADO: 'animals'
  });

  it('should return 401 when no authorization token is provided', async () => {
    // Act - Intentar obtener lista sin token
    const response = await request(app)
      .get('/api/v1/animal/all');

    // Assert - Verificar error de autorización
    expect([401, 403]).toContain(response.status);
    expect(response.body).not.toHaveProperty('animals');  // ✅ CAMBIADO: 'animals'
  });

  it('should return 401 when invalid token is provided', async () => {
    // Act - Intentar obtener lista con token inválido
    const response = await request(app)
      .get('/api/v1/animal/all')
      .set('Authorization', 'Bearer invalid_token_here');

    // Assert - Verificar error de autorización
    expect([401, 403]).toContain(response.status);
    expect(response.body).not.toHaveProperty('animals');  // ✅ CAMBIADO: 'animals'
  });

  it('should handle large number of animals correctly', async () => {
    // Arrange - Crear muchos animales adicionales
    const additionalAnimals = [];
    for (let i = 4; i <= 10; i++) {
      additionalAnimals.push({
        name: `Animal ${i}`,
        breed: `Breed ${i}`,
        species: "Perro",
        age: i,
        gender: i % 2 === 0 ? "Male" : "Female",
        color: `Color ${i}`,
        size: "Medium",
        notes: `Animal número ${i} para prueba de volumen`
      });
    }

    // Crear animales adicionales
    for (const animalData of additionalAnimals) {
      await request(app)
        .post('/api/v1/animal/register')
        .set('Authorization', `Bearer ${authToken}`)
        .send(animalData);
    }

    // Act - Obtener lista completa
    const response = await request(app)
      .get('/api/v1/animal/all')
      .set('Authorization', `Bearer ${authToken}`);

    // Assert - Debe devolver todos los animales (3 originales + 7 adicionales = 10)
    expect(response.status).toBe(200);
    expect(response.body.animals.length).toBe(10);  // ✅ CAMBIADO: 'animals'
    expect(Array.isArray(response.body.animals)).toBe(true);  // ✅ CAMBIADO: 'animals'
  });

  it('should return consistent response structure', async () => {
    // Act - Obtener lista de animales
    const response = await request(app)
      .get('/api/v1/animal/all')
      .set('Authorization', `Bearer ${authToken}`);

    // Assert - Verificar estructura consistente de respuesta
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('success', true);
    expect(response.body).toHaveProperty('animals');  // ✅ CAMBIADO: 'animals'
    
    expect(typeof response.body.success).toBe('boolean');
    expect(Array.isArray(response.body.animals)).toBe(true);  // ✅ CAMBIADO: 'animals'
    
    // Verificar que no hay propiedades sensibles expuestas
    expect(response.body).not.toHaveProperty('password');
    expect(response.body).not.toHaveProperty('token');
    expect(response.body).not.toHaveProperty('sql');
  });

  it('should handle concurrent requests for animal list', async () => {
    // Act - Realizar múltiples requests concurrentes
    const concurrentRequests = [
      request(app).get('/api/v1/animal/all').set('Authorization', `Bearer ${authToken}`),
      request(app).get('/api/v1/animal/all').set('Authorization', `Bearer ${authToken}`),
      request(app).get('/api/v1/animal/all').set('Authorization', `Bearer ${authToken}`),
      request(app).get('/api/v1/animal/all').set('Authorization', `Bearer ${authToken}`)
    ];

    const responses = await Promise.all(concurrentRequests);

    // Assert - Todas las respuestas deben ser consistentes
    responses.forEach(response => {
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body.animals.length).toBe(3);  // ✅ CAMBIADO: 'animals'
      expect(Array.isArray(response.body.animals)).toBe(true);  // ✅ CAMBIADO: 'animals'
    });
  });

  it('should return animals with different species correctly', async () => {
    // Act - Obtener lista de animales
    const response = await request(app)
      .get('/api/v1/animal/all')
      .set('Authorization', `Bearer ${authToken}`);

    // Assert - Verificar que se devuelven diferentes especies
    expect(response.status).toBe(200);
    expect(response.body.animals.length).toBe(3);  // ✅ CAMBIADO: 'animals'

    const species = response.body.animals.map((animal: any) => animal.species);  // ✅ CAMBIADO: 'animals'
    expect(species).toContain('Perro');
    expect(species).toContain('Gato');
    expect(species).toContain('Ave');

    // Verificar que cada animal conserva sus datos específicos
    const luna = response.body.animals.find((animal: any) => animal.name === 'Luna Test');  // ✅ CAMBIADO: 'animals'
    const max = response.body.animals.find((animal: any) => animal.name === 'Max Test');  // ✅ CAMBIADO: 'animals'
    const polly = response.body.animals.find((animal: any) => animal.name === 'Polly Test');  // ✅ CAMBIADO: 'animals'

    expect(luna).toBeDefined();
    expect(luna.species).toBe('Perro');
    expect(luna.breed).toBe('Golden Retriever');

    expect(max).toBeDefined();
    expect(max.species).toBe('Gato');
    expect(max.breed).toBe('Siamés');

    expect(polly).toBeDefined();
    expect(polly.species).toBe('Ave');
    expect(polly.breed).toBe('Canario');
  });

  it('should maintain performance with reasonable response time', async () => {
    const startTime = Date.now();

    // Act - Obtener lista de animales
    const response = await request(app)
      .get('/api/v1/animal/all')
      .set('Authorization', `Bearer ${authToken}`);

    const endTime = Date.now();
    const responseTime = endTime - startTime;

    // Assert - Verificar rendimiento y respuesta
    expect(response.status).toBe(200);
    expect(responseTime).toBeLessThan(5000); // Menos de 5 segundos
    expect(response.body.animals.length).toBe(3);  // ✅ CAMBIADO: 'animals'
  });

  afterEach(async () => {
    // Limpiar datos de test después de cada prueba
    try {
      await global.testHelper?.cleanUserData("testuser.allanimals@hamster.com");
      await global.testHelper?.cleanUserData("otheruser.allanimals@hamster.com");
      await global.testHelper?.cleanUserData("emptyuser.allanimals@hamster.com");
      
      // Limpiar animales creados
      for (const name of ['Luna Test', 'Max Test', 'Polly Test', 'Animal Otro Usuario']) {
        await global.testHelper?.cleanAnimalData(name);
      }
      
      // Limpiar animales adicionales si existen
      for (let i = 4; i <= 10; i++) {
        await global.testHelper?.cleanAnimalData(`Animal ${i}`);
      }
      
      createdAnimalIds = [];
    } catch (error) {
      console.warn('⚠️ Error limpiando datos de test:', error);
    }
  });
});