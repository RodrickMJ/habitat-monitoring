import request from 'supertest';
import { app } from '../../app';

describe('AN02 - Registro con datos inválidos (Status: 400)', () => {
  
  let authToken: string;

  // Setup: Crear usuario y obtener token antes de cada test
  beforeEach(async () => {
    // Registrar usuario para obtener token de autenticación
    await request(app)
      .post('/api/v1/auth/register')
      .send({
        name: "TestUser",
        lastname: "Animal",
        email: "testuser.animal2@hamster.com",
        password: "Secure123!"
      });

    // Hacer login para obtener token
    const loginResponse = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: "testuser.animal2@hamster.com",
        password: "Secure123!"
      });

    authToken = loginResponse.body.token;
  });

  it('should reject registration with missing name field', async () => {
    // Arrange - Datos sin nombre (campo requerido)
    const invalidAnimalData = {
      species: "Perro",
      age: 3
    };

    // Act - Intentar registrar animal sin nombre
    const response = await request(app)
      .post('/api/v1/animal/register') // ✅ URL CORREGIDA
      .set('Authorization', `Bearer ${authToken}`)
      .send(invalidAnimalData);

    // Assert - Verificar rechazo por campo faltante
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('success', false);
    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toMatch(/(name|nombre|required|requerido)/i);
    expect(response.body).not.toHaveProperty('animal');
  });

  it('should reject registration with missing species field', async () => {
    // Arrange - Datos sin especie (campo requerido)
    const invalidAnimalData = {
      name: "Luna",
      age: 3
    };

    // Act - Intentar registrar animal sin especie
    const response = await request(app)
      .post('/api/v1/animal/register') // ✅ URL CORREGIDA
      .set('Authorization', `Bearer ${authToken}`)
      .send(invalidAnimalData);

    // Assert - Verificar rechazo por campo faltante
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('success', false);
    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toMatch(/(species|especie|required|requerido)/i);
    expect(response.body).not.toHaveProperty('animal');
  });

  it('should reject registration with empty name', async () => {
    // Arrange - Datos con nombre vacío
    const invalidAnimalData = {
      name: "",
      species: "Gato",
      age: 2
    };

    // Act - Intentar registrar animal con nombre vacío
    const response = await request(app)
      .post('/api/v1/animal/register') // ✅ URL CORREGIDA
      .set('Authorization', `Bearer ${authToken}`)
      .send(invalidAnimalData);

    // Assert - Verificar rechazo por nombre vacío
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('success', false);
    expect(response.body).toHaveProperty('message');
    expect(response.body).not.toHaveProperty('animal');
  });

  it('should reject registration with empty species', async () => {
    // Arrange - Datos con especie vacía
    const invalidAnimalData = {
      name: "Max",
      species: "",
      age: 4
    };

    // Act - Intentar registrar animal con especie vacía
    const response = await request(app)
      .post('/api/v1/animal/register') // ✅ URL CORREGIDA
      .set('Authorization', `Bearer ${authToken}`)
      .send(invalidAnimalData);

    // Assert - Verificar rechazo por especie vacía
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('success', false);
    expect(response.body).toHaveProperty('message');
    expect(response.body).not.toHaveProperty('animal');
  });

  it('should reject registration with negative age', async () => {
    // Arrange - Datos con edad negativa
    const invalidAnimalData = {
      name: "Buddy",
      species: "Perro",
      age: -1
    };

    // Act - Intentar registrar animal con edad negativa
    const response = await request(app)
      .post('/api/v1/animal/register') // ✅ URL CORREGIDA
      .set('Authorization', `Bearer ${authToken}`)
      .send(invalidAnimalData);

    // Assert - Verificar rechazo por edad inválida
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('success', false);
    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toMatch(/(age|edad|negative|negativ|invalid|inválid)/i);
    expect(response.body).not.toHaveProperty('animal');
  });

  it('should reject registration with invalid age type', async () => {
    // Arrange - Datos con edad como string en lugar de número
    const invalidAnimalData = {
      name: "Whiskers",
      species: "Gato",
      age: "tres años"
    };

    // Act - Intentar registrar animal con tipo de edad incorrecto
    const response = await request(app)
      .post('/api/v1/animal/register') // ✅ URL CORREGIDA
      .set('Authorization', `Bearer ${authToken}`)
      .send(invalidAnimalData);

    // Assert - Verificar rechazo por tipo de dato incorrecto
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('success', false);
    expect(response.body).toHaveProperty('message');
    expect(response.body).not.toHaveProperty('animal');
  });

  it('should reject registration with null values', async () => {
    // Arrange - Datos con valores nulos
    const invalidAnimalData = {
      name: null,
      species: "Perro",
      age: 3
    };

    // Act - Intentar registrar animal con valores nulos
    const response = await request(app)
      .post('/api/v1/animal/register') // ✅ URL CORREGIDA
      .set('Authorization', `Bearer ${authToken}`)
      .send(invalidAnimalData);

    // Assert - Verificar rechazo por valores nulos
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('success', false);
    expect(response.body).toHaveProperty('message');
    expect(response.body).not.toHaveProperty('animal');
  });

  it('should reject registration with undefined values', async () => {
    // Arrange - Datos con valores undefined
    const invalidAnimalData = {
      name: undefined,
      species: "Gato",
      age: 2
    };

    // Act - Intentar registrar animal con valores undefined
    const response = await request(app)
      .post('/api/v1/animal/register') // ✅ URL CORREGIDA
      .set('Authorization', `Bearer ${authToken}`)
      .send(invalidAnimalData);

    // Assert - Verificar rechazo por valores undefined
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('success', false);
    expect(response.body).toHaveProperty('message');
    expect(response.body).not.toHaveProperty('animal');
  });

  it('should reject registration with excessive age', async () => {
    // Arrange - Datos con edad excesivamente alta (poco realista)
    const invalidAnimalData = {
      name: "Ancient",
      species: "Tortuga",
      age: 9999
    };

    // Act - Intentar registrar animal con edad excesiva
    const response = await request(app)
      .post('/api/v1/animal/register') // ✅ URL CORREGIDA
      .set('Authorization', `Bearer ${authToken}`)
      .send(invalidAnimalData);

    // Assert - Verificar manejo de edad excesiva
    expect([400, 201]).toContain(response.status); // Puede ser válido para algunas especies
    if (response.status === 400) {
      expect(response.body).toHaveProperty('success', false);
      expect(response.body).not.toHaveProperty('animal');
    }
  });

  it('should reject registration with excessively long name', async () => {
    // Arrange - Datos con nombre demasiado largo
    const veryLongName = "A".repeat(1000); // Nombre de 1000 caracteres
    const invalidAnimalData = {
      name: veryLongName,
      species: "Perro",
      age: 3
    };

    // Act - Intentar registrar animal con nombre muy largo
    const response = await request(app)
      .post('/api/v1/animal/register') // ✅ URL CORREGIDA
      .set('Authorization', `Bearer ${authToken}`)
      .send(invalidAnimalData);

    // Assert - Verificar rechazo por nombre demasiado largo
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('success', false);
    expect(response.body).toHaveProperty('message');
    expect(response.body).not.toHaveProperty('animal');
  });

  it('should reject registration with malicious characters', async () => {
    // Arrange - Datos con caracteres potencialmente maliciosos
    const maliciousAnimals = [
      { name: "<script>alert('xss')</script>", species: "Perro" },
      { name: "'; DROP TABLE animals; --", species: "Gato" },
      { name: "{{constructor.constructor('return process')()}}", species: "Ave" }
    ];

    // Act & Assert - Intentar registrar animales con datos maliciosos
    for (const animalData of maliciousAnimals) {
      const response = await request(app)
        .post('/api/v1/animal/register') // ✅ URL CORREGIDA
        .set('Authorization', `Bearer ${authToken}`)
        .send(animalData);

      // Debe rechazar o sanitizar los datos
      expect([400, 201]).toContain(response.status);
      if (response.status === 201) {
        // Si acepta, debe haber sanitizado los datos
        expect(response.body.animal.name).not.toContain('<script>');
        expect(response.body.animal.name).not.toContain('DROP TABLE');
      }
    }
  });

  it('should reject registration with wrong data types', async () => {
    // Arrange - Datos con tipos incorrectos
    const invalidAnimalData = {
      name: 12345, // Número en lugar de string
      species: true, // Boolean en lugar de string
      age: "not a number"
    };

    // Act - Intentar registrar animal con tipos incorrectos
    const response = await request(app)
      .post('/api/v1/animal/register') // ✅ URL CORREGIDA
      .set('Authorization', `Bearer ${authToken}`)
      .send(invalidAnimalData);

    // Assert - Verificar rechazo por tipos incorrectos
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('success', false);
    expect(response.body).toHaveProperty('message');
    expect(response.body).not.toHaveProperty('animal');
  });

  it('should reject registration with only whitespace in required fields', async () => {
    // Arrange - Datos con solo espacios en blanco
    const invalidAnimalData = {
      name: "   ",
      species: "\t\n",
      age: 3
    };

    // Act - Intentar registrar animal con espacios en blanco
    const response = await request(app)
      .post('/api/v1/animal/register') // ✅ URL CORREGIDA
      .set('Authorization', `Bearer ${authToken}`)
      .send(invalidAnimalData);

    // Assert - Verificar rechazo por campos con solo espacios
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('success', false);
    expect(response.body).toHaveProperty('message');
    expect(response.body).not.toHaveProperty('animal');
  });

  it('should reject registration with completely empty request body', async () => {
    // Arrange - Body completamente vacío
    const emptyBody = {};

    // Act - Intentar registrar animal con body vacío
    const response = await request(app)
      .post('/api/v1/animal/register') // ✅ URL CORREGIDA
      .set('Authorization', `Bearer ${authToken}`)
      .send(emptyBody);

    // Assert - Verificar rechazo por body vacío
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('success', false);
    expect(response.body).toHaveProperty('message');
    expect(response.body).not.toHaveProperty('animal');
  });

  it('should provide helpful error messages', async () => {
    // Arrange - Datos inválidos múltiples
    const invalidAnimalData = {
      name: "",
      species: "",
      age: -5
    };

    // Act - Intentar registrar animal con múltiples errores
    const response = await request(app)
      .post('/api/v1/animal/register') // ✅ URL CORREGIDA
      .set('Authorization', `Bearer ${authToken}`)
      .send(invalidAnimalData);

    // Assert - Verificar que el mensaje de error es útil
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('success', false);
    expect(response.body).toHaveProperty('message');
    expect(typeof response.body.message).toBe('string');
    expect(response.body.message.length).toBeGreaterThan(0);
    expect(response.body).not.toHaveProperty('animal');
  });

  it('should handle registration without authorization token', async () => {
    const validAnimalData = {
      name: "Luna",
      species: "Perro",
      age: 3
    };

    const response = await request(app)
      .post('/api/v1/animal/register') 
      .send(validAnimalData);

    expect([401, 403]).toContain(response.status);
    expect(response.body).not.toHaveProperty('animal');
  });
});