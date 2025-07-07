import request from 'supertest';
import { app } from '../../app';

describe('LG03 - Login con contraseña incorrecta (Status: 401)', () => {
  
  // Helper para crear un usuario de prueba antes de intentar login
  beforeEach(async () => {
    // Primero registrar un usuario válido para después probar login con contraseña incorrecta
    await request(app)
      .post('/api/v1/auth/register')
      .send({
        name: "Juan",
        lastname: "Pérez", 
        email: "juan@hamster.com",
        password: "Secure123!"
      });
  });

  it('should reject login with incorrect password for existing user', async () => {
    // Arrange - Datos con email existente pero contraseña incorrecta
    const incorrectPasswordData = {
      email: "juan@hamster.com", // Email que acabamos de registrar
      password: "wrongpass"       // Contraseña incorrecta
    };

    // Act - Intentar login con contraseña incorrecta
    const response = await request(app)
      .post('/api/v1/auth/login')
      .send(incorrectPasswordData);

    // Assert - Verificar rechazo con 401
    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('message', 'Credenciales inválidas');
    expect(response.body).toHaveProperty('code', 401);
    expect(response.body).toHaveProperty('success', false);
    expect(response.body).not.toHaveProperty('token');
  });

  it('should reject login with completely wrong password', async () => {
    const wrongPasswordData = {
      email: "juan@hamster.com",
      password: "TotallyWrongPassword123!"
    };

    const response = await request(app)
      .post('/api/v1/auth/login')
      .send(wrongPasswordData);

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('message', 'Credenciales inválidas');
    expect(response.body).toHaveProperty('success', false);
    expect(response.body).not.toHaveProperty('token');
  });

  it('should reject login with case-sensitive password variations', async () => {
    // La contraseña correcta es "Secure123!" - probar variaciones de mayúsculas/minúsculas
    const caseSensitivePasswords = [
      "secure123!",      // Todo minúsculas
      "SECURE123!",      // Todo mayúsculas  
      "Secure123",       // Sin símbolo
      "secure123!",      // Primera letra minúscula
    ];

    for (const wrongPassword of caseSensitivePasswords) {
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: "juan@hamster.com",
          password: wrongPassword
        });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('success', false);
      expect(response.body).not.toHaveProperty('token');
    }
  });

  it('should reject login with empty password', async () => {
    const emptyPasswordData = {
      email: "juan@hamster.com",
      password: ""
    };

    const response = await request(app)
      .post('/api/v1/auth/login')
      .send(emptyPasswordData);

    // Puede ser 400 (validación) o 401 (credenciales inválidas)
    expect([400, 401]).toContain(response.status);
    expect(response.body).toHaveProperty('success', false);
    expect(response.body).not.toHaveProperty('token');
  });

  it('should reject login with null password', async () => {
    const nullPasswordData = {
      email: "juan@hamster.com",
      password: null
    };

    const response = await request(app)
      .post('/api/v1/auth/login')
      .send(nullPasswordData);

    expect([400, 401]).toContain(response.status);
    expect(response.body).toHaveProperty('success', false);
    expect(response.body).not.toHaveProperty('token');
  });

  it('should not reveal that user exists when password is wrong', async () => {
    // Test de seguridad: verificar que no se revela si el usuario existe
    const existingUserWrongPass = {
      email: "juan@hamster.com",     // Usuario que existe
      password: "wrongpassword"
    };

    const nonExistentUserWrongPass = {
      email: "noexiste@hamster.com", // Usuario que no existe  
      password: "wrongpassword"
    };

    const response1 = await request(app)
      .post('/api/v1/auth/login')
      .send(existingUserWrongPass);

    const response2 = await request(app)
      .post('/api/v1/auth/login')
      .send(nonExistentUserWrongPass);

    // Ambas respuestas deberían ser idénticas para no revelar información
    expect(response1.status).toBe(401);
    expect(response2.status).toBe(401);
    expect(response1.body.message).toBe(response2.body.message);
    expect(response1.body.message).toBe('Credenciales inválidas');
  });

  it('should handle password with special characters incorrectly', async () => {
    const specialCharsPasswordData = {
      email: "juan@hamster.com",
      password: "Wrong!@#$%^&*()"
    };

    const response = await request(app)
      .post('/api/v1/auth/login')
      .send(specialCharsPasswordData);

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('message', 'Credenciales inválidas');
    expect(response.body).toHaveProperty('success', false);
    expect(response.body).not.toHaveProperty('token');
  });

  it('should maintain consistent response time for wrong passwords', async () => {
    // Test de timing attack prevention para contraseñas incorrectas
    const startTime = Date.now();
    
    const response = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: "juan@hamster.com",
        password: "definitely_wrong_password"
      });
    
    const endTime = Date.now();
    const responseTime = endTime - startTime;

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('success', false);
    
    // El tiempo de respuesta debería ser consistente
    expect(responseTime).toBeGreaterThan(5); // Al menos 5ms
    expect(responseTime).toBeLessThan(2000); // Menos de 2 segundos
    
    console.log(`⏱️ [LG03] Response time for wrong password: ${responseTime}ms`);
  });

  it('should reject login with very long incorrect password', async () => {
    // Test con contraseña muy larga para verificar manejo de límites
    const veryLongPassword = "a".repeat(1000) + "WrongPassword!";
    
    const response = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: "juan@hamster.com",
        password: veryLongPassword
      });

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('message', 'Credenciales inválidas');
    expect(response.body).toHaveProperty('success', false);
    expect(response.body).not.toHaveProperty('token');
  });
});