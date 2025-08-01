import request from 'supertest';
import { app } from '../../app';

describe('AN04 - Obtener animal por ID inexistente', () => {
  let authToken: string;

  beforeEach(async () => {
    // Registrar usuario para las pruebas
    await request(app)
      .post('/api/v1/auth/register')
      .send({
        name: "TestUser",
        lastname: "Animal",
        email: "testuser.animal4@hamster.com",
        password: "Secure123!"
      });

    // Hacer login para obtener token
    const loginResponse = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: "testuser.animal4@hamster.com",
        password: "Secure123!"
      });

    authToken = loginResponse.body.token;
  });

  it('should return 400 when animal ID does not exist in database', async () => {
    const nonExistentId = '999999';

    // Act - Intentar obtener animal con ID inexistente
    const response = await request(app)
      .get(`/api/v1/animal/${nonExistentId}`)
      .set('Authorization', `Bearer ${authToken}`);

    // Assert - Verificar respuesta de error por ID inexistente
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('success', false);
    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toMatch(/(not found|no encontrado|does not exist|no existe)/i);
    expect(response.body).not.toHaveProperty('data');
  });

  it('should return 400 for multiple non-existent IDs', async () => {
    const nonExistentIds = ['999999', '888888', '777777', '666666'];

    // Act & Assert - Probar múltiples IDs inexistentes
    for (const id of nonExistentIds) {
      const response = await request(app)
        .get(`/api/v1/animal/${id}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('message');
      expect(response.body).not.toHaveProperty('data');
    }
  });

  it('should return 400 for very large non-existent ID', async () => {
    const veryLargeId = '99999999999999999999';

    // Act - Intentar obtener animal con ID muy grande
    const response = await request(app)
      .get(`/api/v1/animal/${veryLargeId}`)
      .set('Authorization', `Bearer ${authToken}`);

    // Assert - Verificar manejo de ID muy grande
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('success', false);
    expect(response.body).toHaveProperty('message');
    expect(response.body).not.toHaveProperty('data');
  });

  it('should return 400 for zero ID', async () => {
    const zeroId = '0';

    // Act - Intentar obtener animal con ID cero
    const response = await request(app)
      .get(`/api/v1/animal/${zeroId}`)
      .set('Authorization', `Bearer ${authToken}`);

    // Assert - Verificar manejo de ID cero
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('success', false);
    expect(response.body).toHaveProperty('message');
    expect(response.body).not.toHaveProperty('data');
  });

  it('should return 400 for negative ID', async () => {
    const negativeId = '-1';

    // Act - Intentar obtener animal con ID negativo
    const response = await request(app)
      .get(`/api/v1/animal/${negativeId}`)
      .set('Authorization', `Bearer ${authToken}`);

    // Assert - Verificar manejo de ID negativo
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('success', false);
    expect(response.body).toHaveProperty('message');
    expect(response.body).not.toHaveProperty('data');
  });

  it('should return consistent error message format', async () => {
    const nonExistentId = '999999';

    // Act - Obtener respuesta de error
    const response = await request(app)
      .get(`/api/v1/animal/${nonExistentId}`)
      .set('Authorization', `Bearer ${authToken}`);

    // Assert - Verificar formato consistente de mensaje de error
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message');
    expect(response.body).toHaveProperty('success', false);
    expect(typeof response.body.message).toBe('string');
    expect(response.body.message.length).toBeGreaterThan(0);
    expect(response.body).not.toHaveProperty('data');
    expect(response.body).not.toHaveProperty('animal');
  });

  it('should return 401 when trying to access non-existent animal without token', async () => {
    const nonExistentId = '999999';

    // Act - Intentar obtener animal inexistente sin token
    const response = await request(app)
      .get(`/api/v1/animal/${nonExistentId}`);

    // Assert - Verificar error de autorización
    expect([401, 403]).toContain(response.status);
    expect(response.body).not.toHaveProperty('data');
  });

  it('should handle sequential requests for non-existent animals', async () => {
    const nonExistentIds = ['111111', '222222', '333333'];

    // Act - Realizar requests secuenciales
    for (const id of nonExistentIds) {
      const response = await request(app)
        .get(`/api/v1/animal/${id}`)
        .set('Authorization', `Bearer ${authToken}`);

      // Assert - Cada request debe devolver el mismo tipo de error
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('message');
    }
  });

  it('should handle concurrent requests for non-existent animals', async () => {
    const nonExistentIds = ['444444', '555555', '666666'];

    // Act - Realizar requests concurrentes
    const requests = nonExistentIds.map(id =>
      request(app)
        .get(`/api/v1/animal/${id}`)
        .set('Authorization', `Bearer ${authToken}`)
    );

    const responses = await Promise.all(requests);

    // Assert - Todas las respuestas deben ser consistentes
    responses.forEach((response, index) => {
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('message');
      expect(response.body).not.toHaveProperty('data');
    });
  });

  it('should not expose sensitive information in error messages', async () => {
    const nonExistentId = '999999';

    // Act - Obtener respuesta de error
    const response = await request(app)
      .get(`/api/v1/animal/${nonExistentId}`)
      .set('Authorization', `Bearer ${authToken}`);

    // Assert - Verificar que no hay información sensible expuesta
    expect(response.status).toBe(400);
    expect(response.body).not.toHaveProperty('sql');
    expect(response.body).not.toHaveProperty('query');
    expect(response.body).not.toHaveProperty('stack');
    expect(response.body).not.toHaveProperty('password');
    expect(response.body).not.toHaveProperty('token');
    expect(response.body).not.toHaveProperty('database');
    
    // El mensaje no debe contener información técnica sensible
    const message = response.body.message.toLowerCase();
    expect(message).not.toContain('sql');
    expect(message).not.toContain('database');
    expect(message).not.toContain('table');
    expect(message).not.toContain('select');
  });

  it('should maintain performance for non-existent ID queries', async () => {
    const nonExistentId = '999999';
    const startTime = Date.now();

    // Act - Medir tiempo de respuesta
    const response = await request(app)
      .get(`/api/v1/animal/${nonExistentId}`)
      .set('Authorization', `Bearer ${authToken}`);

    const endTime = Date.now();
    const responseTime = endTime - startTime;

    // Assert - Verificar que la respuesta es rápida (< 5 segundos)
    expect(response.status).toBe(400);
    expect(responseTime).toBeLessThan(5000); // Menos de 5 segundos
    expect(response.body).toHaveProperty('success', false);
  });

  it('should validate ID parameter format for non-existent animals', async () => {
    const invalidFormatIds = [
      'abc123',     // Letras y números
      'null',       // String "null"
      'undefined',  // String "undefined"
      '12.34',      // Decimal
      '1e10'        // Notación científica
    ];

    for (const id of invalidFormatIds) {
      const response = await request(app)
        .get(`/api/v1/animal/${id}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect([400, 404]).toContain(response.status);
      expect(response.body).not.toHaveProperty('data');
    }
  });

  afterEach(async () => {
    try {
      await global.testHelper?.cleanUserData("testuser.animal4@hamster.com");
    } catch (error) {
      console.warn('⚠️ Error limpiando datos de test:', error);
    }
  });
});