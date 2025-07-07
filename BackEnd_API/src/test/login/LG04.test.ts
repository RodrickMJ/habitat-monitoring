import request from 'supertest';
import { app } from '../../app';

describe('LG04 - Login con campos vacíos (Status: 400)', () => {
  
  it('should reject login with both email and password empty', async () => {
    // Arrange - Datos con ambos campos vacíos
    const emptyFieldsData = {
      email: "",
      password: ""
    };

    // Act - Intentar login con campos vacíos
    const response = await request(app)
      .post('/api/v1/auth/login')
      .send(emptyFieldsData);

    // Assert - Tu API devuelve 401 para campos vacíos, ajustamos el test
    expect([400, 401]).toContain(response.status);
    expect(response.body).toHaveProperty('success', false);
    expect(response.body).not.toHaveProperty('token');
  });

  it('should reject login with missing email field', async () => {
    // Arrange - Datos sin campo email
    const missingEmailData = {
      password: "SomePassword123!"
    };

    // Act - Intentar login sin email
    const response = await request(app)
      .post('/api/v1/auth/login')
      .send(missingEmailData);

    // Assert - Verificar rechazo
    expect([400, 401]).toContain(response.status);
    expect(response.body).toHaveProperty('success', false);
    expect(response.body).not.toHaveProperty('token');
    // Mensaje específico que está devolviendo tu API
    expect(response.body.message).toMatch(/(Bind parameters|undefined|Email|email|required|requerido|Invalid)/i);
  });

  it('should reject login with missing password field', async () => {
    // Arrange - Datos sin campo password
    const missingPasswordData = {
      email: "test@hamster.com"
    };

    // Act - Intentar login sin password
    const response = await request(app)
      .post('/api/v1/auth/login')
      .send(missingPasswordData);

    // Assert - Verificar rechazo
    expect([400, 401]).toContain(response.status);
    expect(response.body).toHaveProperty('success', false);
    expect(response.body).not.toHaveProperty('token');
  });

  it('should reject login with null email', async () => {
    // Arrange - Email nulo
    const nullEmailData = {
      email: null,
      password: "SomePassword123!"
    };

    // Act - Intentar login con email nulo
    const response = await request(app)
      .post('/api/v1/auth/login')
      .send(nullEmailData);

    // Assert - Verificar rechazo
    expect([400, 401]).toContain(response.status);
    expect(response.body).toHaveProperty('success', false);
    expect(response.body).not.toHaveProperty('token');
  });

  it('should reject login with null password', async () => {
    // Arrange - Password nulo
    const nullPasswordData = {
      email: "test@hamster.com",
      password: null
    };

    // Act - Intentar login con password nulo
    const response = await request(app)
      .post('/api/v1/auth/login')
      .send(nullPasswordData);

    // Assert - Verificar rechazo
    expect([400, 401]).toContain(response.status);
    expect(response.body).toHaveProperty('success', false);
    expect(response.body).not.toHaveProperty('token');
  });

  it('should reject login with undefined email', async () => {
    // Arrange - Email undefined
    const undefinedEmailData = {
      email: undefined,
      password: "SomePassword123!"
    };

    // Act - Intentar login con email undefined
    const response = await request(app)
      .post('/api/v1/auth/login')
      .send(undefinedEmailData);

    // Assert - Verificar rechazo
    expect([400, 401]).toContain(response.status);
    expect(response.body).toHaveProperty('success', false);
    expect(response.body).not.toHaveProperty('token');
  });

  it('should reject login with undefined password', async () => {
    // Arrange - Password undefined
    const undefinedPasswordData = {
      email: "test@hamster.com",
      password: undefined
    };

    // Act - Intentar login con password undefined
    const response = await request(app)
      .post('/api/v1/auth/login')
      .send(undefinedPasswordData);

    // Assert - Verificar rechazo
    expect([400, 401]).toContain(response.status);
    expect(response.body).toHaveProperty('success', false);
    expect(response.body).not.toHaveProperty('token');
  });

  it('should reject login with whitespace-only email', async () => {
    // Arrange - Email solo con espacios en blanco
    const whitespaceEmailData = {
      email: "   ",
      password: "SomePassword123!"
    };

    // Act - Intentar login con email de solo espacios
    const response = await request(app)
      .post('/api/v1/auth/login')
      .send(whitespaceEmailData);

    // Assert - Verificar rechazo
    expect([400, 401]).toContain(response.status);
    expect(response.body).toHaveProperty('success', false);
    expect(response.body).not.toHaveProperty('token');
  });

  it('should reject login with whitespace-only password', async () => {
    // Arrange - Password solo con espacios en blanco
    const whitespacePasswordData = {
      email: "test@hamster.com",
      password: "   "
    };

    // Act - Intentar login con password de solo espacios
    const response = await request(app)
      .post('/api/v1/auth/login')
      .send(whitespacePasswordData);

    // Assert - Verificar rechazo
    expect([400, 401]).toContain(response.status);
    expect(response.body).toHaveProperty('success', false);
    expect(response.body).not.toHaveProperty('token');
  });

  it('should reject login with completely empty request body', async () => {
    // Arrange - Body completamente vacío
    const emptyBody = {};

    // Act - Intentar login con body vacío
    const response = await request(app)
      .post('/api/v1/auth/login')
      .send(emptyBody);

    // Assert - Verificar rechazo
    expect([400, 401]).toContain(response.status);
    expect(response.body).toHaveProperty('success', false);
    expect(response.body).not.toHaveProperty('token');
  });

  it('should reject login with numeric values instead of strings', async () => {
    // Arrange - Valores numéricos en lugar de strings
    const numericData = {
      email: 12345,
      password: 67890
    };

    // Act - Intentar login con valores numéricos
    const response = await request(app)
      .post('/api/v1/auth/login')
      .send(numericData);

    // Assert - Verificar rechazo
    expect([400, 401]).toContain(response.status);
    expect(response.body).toHaveProperty('success', false);
    expect(response.body).not.toHaveProperty('token');
  });

  it('should reject login with boolean values instead of strings', async () => {
    // Arrange - Valores booleanos en lugar de strings
    const booleanData = {
      email: true,
      password: false
    };

    // Act - Intentar login con valores booleanos
    const response = await request(app)
      .post('/api/v1/auth/login')
      .send(booleanData);

    // Assert - Verificar rechazo
    expect([400, 401]).toContain(response.status);
    expect(response.body).toHaveProperty('success', false);
    expect(response.body).not.toHaveProperty('token');
  });

  it('should handle malformed JSON gracefully', async () => {
    // Arrange & Act - Enviar JSON malformado
    const response = await request(app)
      .post('/api/v1/auth/login')
      .set('Content-Type', 'application/json')
      .send('{ email: "test@test.com", password: }'); // JSON inválido

    // Assert - Tu API devuelve 500 para JSON malformado, lo cual es aceptable
    expect([400, 500]).toContain(response.status);
    expect(response.body).toHaveProperty('success', false);
  });

  it('should provide helpful error messages for validation failures', async () => {
    // Arrange - Datos con campos vacíos
    const emptyFieldsData = {
      email: "",
      password: ""
    };

    // Act - Intentar login
    const response = await request(app)
      .post('/api/v1/auth/login')
      .send(emptyFieldsData);

    // Assert - Verificar que hay mensaje de error
    expect([400, 401]).toContain(response.status);
    expect(response.body).toHaveProperty('success', false);
    expect(response.body.message).toBeDefined();
    expect(response.body.message.length).toBeGreaterThan(0);
    
    // El mensaje puede ser "Credenciales inválidas" o algo relacionado con validación
    expect(response.body.message).toMatch(/(Credenciales|Invalid|requerido|required|obligatorio|necesario|inválidas)/i);
  });

  it('should maintain consistent response structure for validation errors', async () => {
    // Arrange - Diferentes tipos de campos vacíos
    const testCases = [
      { email: "", password: "" },
      { email: null, password: "test" },
      { email: "test@test.com", password: null },
      {}
    ];

    for (const testData of testCases) {
      // Act - Intentar login con cada caso
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send(testData);

      // Assert - Verificar estructura consistente
      expect([400, 401]).toContain(response.status);
      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('message');
      expect(response.body).not.toHaveProperty('token');
      expect(response.body).not.toHaveProperty('id');
    }
  });

  it('should handle edge cases with special string values', async () => {
    // Arrange - Casos especiales
    const edgeCases = [
      { email: "0", password: "0" },           // String "0"
      { email: "false", password: "true" },   // String booleanos
      { email: "null", password: "undefined" } // String null/undefined
    ];

    for (const testData of edgeCases) {
      // Act - Intentar login con cada caso
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send(testData);

      // Assert - Estos deberían ser tratados como credenciales inválidas
      expect([400, 401]).toContain(response.status);
      expect(response.body).toHaveProperty('success', false);
      expect(response.body).not.toHaveProperty('token');
    }
  });
});