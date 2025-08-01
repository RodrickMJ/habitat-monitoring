import request from 'supertest';
import { app } from '../../app';

describe('AN05 - Obtener animal de otro usuario', () => {
  let user1Token: string;
  let user2Token: string;
  let user1AnimalId: string;
  let user2AnimalId: string;

  beforeEach(async () => {
    // ========= USUARIO 1 =========
    // Registrar primer usuario
    await request(app)
      .post('/api/v1/auth/register')
      .send({
        name: "Usuario1",
        lastname: "Test",
        email: "usuario1.an05@hamster.com",
        password: "Secure123!"
      });

    // Login usuario 1
    const user1LoginResponse = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: "usuario1.an05@hamster.com",
        password: "Secure123!"
      });

    user1Token = user1LoginResponse.body.token;

    // Crear animal del usuario 1
    const user1AnimalResponse = await request(app)
      .post('/api/v1/animal/register')
      .set('Authorization', `Bearer ${user1Token}`)
      .send({
        name: "Animal Usuario 1",
        breed: "Golden Retriever",
        species: "Perro",
        age: 3,
        gender: "Male",
        color: "Golden",
        size: "Large",
        notes: "Animal que pertenece al usuario 1"
      });

    user1AnimalId = user1AnimalResponse.body.animal.id;

    // ========= USUARIO 2 =========
    // Registrar segundo usuario
    await request(app)
      .post('/api/v1/auth/register')
      .send({
        name: "Usuario2",
        lastname: "Test",
        email: "usuario2.an05@hamster.com",
        password: "Secure123!"
      });

    // Login usuario 2
    const user2LoginResponse = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: "usuario2.an05@hamster.com",
        password: "Secure123!"
      });

    user2Token = user2LoginResponse.body.token;

    // Crear animal del usuario 2
    const user2AnimalResponse = await request(app)
      .post('/api/v1/animal/register')
      .set('Authorization', `Bearer ${user2Token}`)
      .send({
        name: "Animal Usuario 2",
        breed: "Labrador",
        species: "Perro",
        age: 2,
        gender: "Female",
        color: "Black",
        size: "Medium",
        notes: "Animal que pertenece al usuario 2"
      });

    user2AnimalId = user2AnimalResponse.body.animal.id;
  });

  it('should return 400 when user tries to access another users animal', async () => {
    // Act - Usuario 2 intenta acceder al animal del Usuario 1
    const response = await request(app)
      .get(`/api/v1/animal/${user1AnimalId}`)
      .set('Authorization', `Bearer ${user2Token}`);

    // Assert - Verificar que se niega el acceso
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('success', false);
    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toMatch(/(not found|does not belong|access denied|no pertenece|no encontrado)/i);
    expect(response.body).not.toHaveProperty('data');
    expect(response.body).not.toHaveProperty('animal');
  });

  it('should return 400 when user 1 tries to access user 2s animal', async () => {
    // Act - Usuario 1 intenta acceder al animal del Usuario 2
    const response = await request(app)
      .get(`/api/v1/animal/${user2AnimalId}`)
      .set('Authorization', `Bearer ${user1Token}`);

    // Assert - Verificar que se niega el acceso
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('success', false);
    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toMatch(/(not found|does not belong|access denied|no pertenece|no encontrado)/i);
    expect(response.body).not.toHaveProperty('data');
  });

  it('should allow users to access their own animals', async () => {
    // Act - Usuario 1 accede a su propio animal
    const user1Response = await request(app)
      .get(`/api/v1/animal/${user1AnimalId}`)
      .set('Authorization', `Bearer ${user1Token}`);

    // Act - Usuario 2 accede a su propio animal
    const user2Response = await request(app)
      .get(`/api/v1/animal/${user2AnimalId}`)
      .set('Authorization', `Bearer ${user2Token}`);

    // Assert - Ambos usuarios pueden acceder a sus propios animales
    expect(user1Response.status).toBe(200);
    expect(user1Response.body).toHaveProperty('success', true);
    expect(user1Response.body).toHaveProperty('data');
    expect(user1Response.body.data).toHaveProperty('name', 'Animal Usuario 1');

    expect(user2Response.status).toBe(200);
    expect(user2Response.body).toHaveProperty('success', true);
    expect(user2Response.body).toHaveProperty('data');
    expect(user2Response.body.data).toHaveProperty('name', 'Animal Usuario 2');
  });

  it('should not expose sensitive information when denying access', async () => {
    // Act - Usuario 2 intenta acceder al animal del Usuario 1
    const response = await request(app)
      .get(`/api/v1/animal/${user1AnimalId}`)
      .set('Authorization', `Bearer ${user2Token}`);

    // Assert - Verificar que no se expone información sensible
    expect(response.status).toBe(400);
    expect(response.body).not.toHaveProperty('ownerId');
    expect(response.body).not.toHaveProperty('userId');
    expect(response.body).not.toHaveProperty('data');
    expect(response.body).not.toHaveProperty('animal');
    
    // El mensaje no debe contener información específica del animal
    const message = response.body.message.toLowerCase();
    expect(message).not.toContain('animal usuario 1');
    expect(message).not.toContain('golden retriever');
  });

  it('should handle multiple unauthorized access attempts', async () => {
    // Arrange - Array de intentos no autorizados
    const unauthorizedAttempts = [
      { animalId: user1AnimalId, token: user2Token, description: 'User 2 -> User 1 animal' },
      { animalId: user2AnimalId, token: user1Token, description: 'User 1 -> User 2 animal' }
    ];

    // Act & Assert - Probar múltiples intentos
    for (const attempt of unauthorizedAttempts) {
      const response = await request(app)
        .get(`/api/v1/animal/${attempt.animalId}`)
        .set('Authorization', `Bearer ${attempt.token}`);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('message');
      expect(response.body).not.toHaveProperty('data');
    }
  });

  it('should maintain consistent error message format across different users', async () => {
    // Act - Obtener respuestas de diferentes usuarios intentando acceso no autorizado
    const response1 = await request(app)
      .get(`/api/v1/animal/${user1AnimalId}`)
      .set('Authorization', `Bearer ${user2Token}`);

    const response2 = await request(app)
      .get(`/api/v1/animal/${user2AnimalId}`)
      .set('Authorization', `Bearer ${user1Token}`);

    // Assert - Verificar consistencia en formato de respuesta
    expect(response1.status).toBe(400);
    expect(response2.status).toBe(400);
    
    expect(response1.body).toHaveProperty('success', false);
    expect(response2.body).toHaveProperty('success', false);
    
    expect(typeof response1.body.message).toBe('string');
    expect(typeof response2.body.message).toBe('string');
    
    expect(response1.body).not.toHaveProperty('data');
    expect(response2.body).not.toHaveProperty('data');
  });

  it('should prevent access even with valid animal ID but wrong owner', async () => {
    // Arrange - Crear un tercer usuario
    await request(app)
      .post('/api/v1/auth/register')
      .send({
        name: "Usuario3",
        lastname: "Test",
        email: "usuario3.an05@hamster.com",
        password: "Secure123!"
      });

    const user3LoginResponse = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: "usuario3.an05@hamster.com",
        password: "Secure123!"
      });

    const user3Token = user3LoginResponse.body.token;

    // Act - Usuario 3 intenta acceder a animales de Usuario 1 y Usuario 2
    const response1 = await request(app)
      .get(`/api/v1/animal/${user1AnimalId}`)
      .set('Authorization', `Bearer ${user3Token}`);

    const response2 = await request(app)
      .get(`/api/v1/animal/${user2AnimalId}`)
      .set('Authorization', `Bearer ${user3Token}`);

    // Assert - Usuario 3 no puede acceder a ningún animal de otros usuarios
    expect(response1.status).toBe(400);
    expect(response1.body).toHaveProperty('success', false);
    expect(response1.body).not.toHaveProperty('data');

    expect(response2.status).toBe(400);
    expect(response2.body).toHaveProperty('success', false);
    expect(response2.body).not.toHaveProperty('data');
  });

  it('should handle concurrent unauthorized access attempts', async () => {
    // Act - Realizar múltiples intentos concurrentes de acceso no autorizado
    const concurrentAttempts = [
      request(app).get(`/api/v1/animal/${user1AnimalId}`).set('Authorization', `Bearer ${user2Token}`),
      request(app).get(`/api/v1/animal/${user2AnimalId}`).set('Authorization', `Bearer ${user1Token}`),
      request(app).get(`/api/v1/animal/${user1AnimalId}`).set('Authorization', `Bearer ${user2Token}`),
      request(app).get(`/api/v1/animal/${user2AnimalId}`).set('Authorization', `Bearer ${user1Token}`)
    ];

    const responses = await Promise.all(concurrentAttempts);

    // Assert - Todas las respuestas deben negar el acceso
    responses.forEach((response, index) => {
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('message');
      expect(response.body).not.toHaveProperty('data');
    });
  });

  it('should verify that animal ownership is correctly enforced', async () => {
    // Act - Verificar que cada usuario solo puede ver su animal
    const user1OwnAnimal = await request(app)
      .get(`/api/v1/animal/${user1AnimalId}`)
      .set('Authorization', `Bearer ${user1Token}`);

    const user2OwnAnimal = await request(app)
      .get(`/api/v1/animal/${user2AnimalId}`)
      .set('Authorization', `Bearer ${user2Token}`);

    const user1TryUser2Animal = await request(app)
      .get(`/api/v1/animal/${user2AnimalId}`)
      .set('Authorization', `Bearer ${user1Token}`);

    const user2TryUser1Animal = await request(app)
      .get(`/api/v1/animal/${user1AnimalId}`)
      .set('Authorization', `Bearer ${user2Token}`);

    // Assert - Verificar matriz de permisos
    // ✅ Usuarios pueden ver sus propios animales
    expect(user1OwnAnimal.status).toBe(200);
    expect(user1OwnAnimal.body.data.name).toBe('Animal Usuario 1');
    
    expect(user2OwnAnimal.status).toBe(200);
    expect(user2OwnAnimal.body.data.name).toBe('Animal Usuario 2');

    // ❌ Usuarios NO pueden ver animales de otros
    expect(user1TryUser2Animal.status).toBe(400);
    expect(user1TryUser2Animal.body).not.toHaveProperty('data');
    
    expect(user2TryUser1Animal.status).toBe(400);
    expect(user2TryUser1Animal.body).not.toHaveProperty('data');
  });

  it('should maintain security even with valid tokens from different users', async () => {
    // Act - Intentos de acceso cruzado con tokens válidos
    const crossAccessAttempt1 = await request(app)
      .get(`/api/v1/animal/${user1AnimalId}`)
      .set('Authorization', `Bearer ${user2Token}`); // Token válido, pero usuario incorrecto

    const crossAccessAttempt2 = await request(app)
      .get(`/api/v1/animal/${user2AnimalId}`)
      .set('Authorization', `Bearer ${user1Token}`); // Token válido, pero usuario incorrecto

    // Assert - Tokens válidos pero usuarios incorrectos deben ser rechazados
    expect(crossAccessAttempt1.status).toBe(400);
    expect(crossAccessAttempt1.body).toHaveProperty('message');
    expect(crossAccessAttempt1.body.message).toMatch(/(not found|does not belong|access denied)/i);

    expect(crossAccessAttempt2.status).toBe(400);
    expect(crossAccessAttempt2.body).toHaveProperty('message');
    expect(crossAccessAttempt2.body.message).toMatch(/(not found|does not belong|access denied)/i);
  });

  afterEach(async () => {
    // Limpiar datos de test después de cada prueba
    try {
      await global.testHelper?.cleanUserData("usuario1.an05@hamster.com");
      await global.testHelper?.cleanUserData("usuario2.an05@hamster.com");
      await global.testHelper?.cleanUserData("usuario3.an05@hamster.com");
      
      if (user1AnimalId) {
        await global.testHelper?.cleanAnimalData("Animal Usuario 1");
      }
      if (user2AnimalId) {
        await global.testHelper?.cleanAnimalData("Animal Usuario 2");
      }
    } catch (error) {
      console.warn('⚠️ Error limpiando datos de test:', error);
    }
  });
});