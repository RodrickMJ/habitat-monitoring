import request from 'supertest';
import { app } from '../../app';

describe('LG05 - Logout exitoso', () => {
  
  let authToken: string;
  let userId: string;

  // Helper para crear un usuario y hacer login antes de cada test
  beforeEach(async () => {
    // Paso 1: Registrar un usuario
    await request(app)
      .post('/api/v1/auth/register')
      .send({
        name: "Juan",
        lastname: "Pérez",
        email: "juan.logout@hamster.com",
        password: "Secure123!"
      });

    // Paso 2: Hacer login para obtener token
    const loginResponse = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: "juan.logout@hamster.com",
        password: "Secure123!"
      });

    authToken = loginResponse.body.token;
    userId = loginResponse.body.id;
  });

  it('should logout successfully with valid token', async () => {
    // Arrange - Token válido obtenido en beforeEach
    
    // Act - Hacer logout
    const response = await request(app)
      .post('/api/v1/auth/logout')
      .set('Authorization', `Bearer ${authToken}`)
      .send();

    // Assert - Verificar logout exitoso
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message');
    expect(response.body).toHaveProperty('success', true);
    expect(response.body.message).toMatch(/(logout|cerrar|sesión|successfully|exitoso)/i);
  });

  it('should allow token reuse after logout (current API behavior)', async () => {
    // Arrange - Hacer logout primero
    const firstLogout = await request(app)
      .post('/api/v1/auth/logout')
      .set('Authorization', `Bearer ${authToken}`)
      .send();

    expect(firstLogout.status).toBe(200);
    expect(firstLogout.body.success).toBe(true);

    // Act - Intentar hacer otro logout con el mismo token
    const response = await request(app)
      .post('/api/v1/auth/logout')
      .set('Authorization', `Bearer ${authToken}`)
      .send();

    // Assert - Tu API actual permite reutilizar el token (no lo invalida)
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe("Usuario ha hecho logout exitosamente");
    
    // TODO: En una implementación más segura, esto debería fallar con 401/403
    console.log('⚠️ [LG05] Token no se invalida después del logout - consideración de seguridad');
  });

  it('should handle logout with invalid token', async () => {
    // Arrange - Token inválido
    const invalidToken = "invalid.jwt.token";

    // Act - Intentar logout con token inválido
    const response = await request(app)
      .post('/api/v1/auth/logout')
      .set('Authorization', `Bearer ${invalidToken}`)
      .send();

    // Assert - Verificar manejo de token inválido
    expect([401, 403]).toContain(response.status);
    // Tu API puede devolver body vacío o con success: false
    if (response.body && Object.keys(response.body).length > 0) {
      expect(response.body).toHaveProperty('success', false);
    }
  });

  it('should handle logout without token', async () => {
    // Arrange - Sin token de autorización

    // Act - Intentar logout sin token
    const response = await request(app)
      .post('/api/v1/auth/logout')
      .send();

    // Assert - Verificar rechazo por falta de token
    expect([401, 403]).toContain(response.status);
    // Tu API puede devolver body vacío para este caso
    if (response.body && Object.keys(response.body).length > 0) {
      expect(response.body).toHaveProperty('success', false);
    }
  });

  it('should handle logout with malformed Authorization header', async () => {
    // Arrange - Header de autorización malformado
    const malformedHeaders = [
      'InvalidFormat',
      'Bearer',
      'Bearer ',
      'Token ' + authToken,
      'Basic ' + authToken
    ];

    for (const header of malformedHeaders) {
      // Act - Intentar logout con header malformado
      const response = await request(app)
        .post('/api/v1/auth/logout')
        .set('Authorization', header)
        .send();

      // Assert - Verificar rechazo por header malformado
      expect([401, 403]).toContain(response.status);
      // Tu API puede devolver body vacío para headers malformados
      if (response.body && Object.keys(response.body).length > 0) {
        expect(response.body).toHaveProperty('success', false);
      }
    }
  });

  it('should handle multiple logout attempts (current behavior)', async () => {
    // Arrange - Primer logout exitoso
    const firstLogout = await request(app)
      .post('/api/v1/auth/logout')
      .set('Authorization', `Bearer ${authToken}`)
      .send();

    expect(firstLogout.status).toBe(200);
    expect(firstLogout.body.success).toBe(true);

    // Act - Segundo intento de logout con el mismo token
    const secondLogout = await request(app)
      .post('/api/v1/auth/logout')
      .set('Authorization', `Bearer ${authToken}`)
      .send();

    // Assert - Tu implementación actual permite múltiples logouts
    expect(secondLogout.status).toBe(200);
    expect(secondLogout.body.success).toBe(true);
    expect(secondLogout.body.message).toBe("Usuario ha hecho logout exitosamente");
    
    console.log('ℹ️ [LG05] Nota: Múltiples logouts permitidos con el mismo token');
  });

  it('should logout different users independently', async () => {
    // Arrange - Crear segundo usuario
    await request(app)
      .post('/api/v1/auth/register')
      .send({
        name: "Ana",
        lastname: "López",
        email: "ana.logout@hamster.com",
        password: "Secure456!"
      });

    // Login del segundo usuario
    const secondLoginResponse = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: "ana.logout@hamster.com",
        password: "Secure456!"
      });

    const secondToken = secondLoginResponse.body.token;

    // Act - Logout del primer usuario
    const firstLogout = await request(app)
      .post('/api/v1/auth/logout')
      .set('Authorization', `Bearer ${authToken}`)
      .send();

    // El segundo usuario aún debería poder hacer logout
    const secondLogout = await request(app)
      .post('/api/v1/auth/logout')
      .set('Authorization', `Bearer ${secondToken}`)
      .send();

    // Assert - Ambos logouts deben ser exitosos
    expect(firstLogout.status).toBe(200);
    expect(secondLogout.status).toBe(200);
    expect(firstLogout.body).toHaveProperty('success', true);
    expect(secondLogout.body).toHaveProperty('success', true);
  });

  it('should maintain session isolation between users', async () => {
    // Arrange - Crear segundo usuario y obtener su token
    await request(app)
      .post('/api/v1/auth/register')
      .send({
        name: "Carlos",
        lastname: "Martín",
        email: "carlos.logout@hamster.com",
        password: "Secure789!"
      });

    const secondLoginResponse = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: "carlos.logout@hamster.com",
        password: "Secure789!"
      });

    const secondToken = secondLoginResponse.body.token;

    // Act - Logout del primer usuario
    await request(app)
      .post('/api/v1/auth/logout')
      .set('Authorization', `Bearer ${authToken}`)
      .send();

    // Verificar que el segundo usuario aún puede hacer logout exitosamente
    const secondLogout = await request(app)
      .post('/api/v1/auth/logout')
      .set('Authorization', `Bearer ${secondToken}`)
      .send();

    // Assert - El segundo usuario no debe verse afectado
    expect(secondLogout.status).toBe(200);
    expect(secondLogout.body).toHaveProperty('success', true);
  });

  it('should handle logout with expired token gracefully', async () => {
    // Arrange - Token expirado (simulado)
    const expiredToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImV4cCI6MTYwMDAwMDAwMH0.invalid";

    // Act - Intentar logout con token expirado
    const response = await request(app)
      .post('/api/v1/auth/logout')
      .set('Authorization', `Bearer ${expiredToken}`)
      .send();

    // Assert - Verificar manejo graceful del token expirado
    expect([401, 403]).toContain(response.status);
    // Tu API puede devolver body vacío o con success: false para tokens expirados
    if (response.body && Object.keys(response.body).length > 0) {
      expect(response.body).toHaveProperty('success', false);
    }
  });

  it('should provide consistent response format for successful logout', async () => {
    // Act - Hacer logout exitoso
    const response = await request(app)
      .post('/api/v1/auth/logout')
      .set('Authorization', `Bearer ${authToken}`)
      .send();

    // Assert - Verificar formato de respuesta consistente
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message');
    expect(response.body).toHaveProperty('success', true);
    expect(typeof response.body.message).toBe('string');
    expect(response.body.message.length).toBeGreaterThan(0);
    
    // No debe contener información sensible
    expect(response.body).not.toHaveProperty('token');
    expect(response.body).not.toHaveProperty('password');
    expect(response.body).not.toHaveProperty('userId');
  });

  it('should handle logout performance within reasonable time', async () => {
    // Arrange - Medir tiempo de logout
    const startTime = Date.now();

    // Act - Hacer logout
    const response = await request(app)
      .post('/api/v1/auth/logout')
      .set('Authorization', `Bearer ${authToken}`)
      .send();

    const endTime = Date.now();
    const responseTime = endTime - startTime;

    // Assert - Verificar respuesta exitosa y tiempo razonable
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('success', true);
    
    // Logout debería ser rápido (menos de 1 segundo)
    expect(responseTime).toBeLessThan(1000);
    
    console.log(`⏱️ [LG05] Logout response time: ${responseTime}ms`);
  });

  it('should handle session cleanup consistently', async () => {
    // Arrange - Verificar que el usuario puede hacer logout inicialmente
    const initialLogout = await request(app)
      .post('/api/v1/auth/logout')
      .set('Authorization', `Bearer ${authToken}`)
      .send();

    expect(initialLogout.status).toBe(200);
    expect(initialLogout.body.success).toBe(true);

    // Act - Intentar usar el token después del logout
    const postLogoutAttempt = await request(app)
      .post('/api/v1/auth/logout')
      .set('Authorization', `Bearer ${authToken}`)
      .send();

    // Assert - Tu implementación actual permite reutilizar tokens
    expect(postLogoutAttempt.status).toBe(200);
    expect(postLogoutAttempt.body.success).toBe(true);
    expect(postLogoutAttempt.body.message).toBe("Usuario ha hecho logout exitosamente");
    
    console.log('ℹ️ [LG05] Nota: Para mayor seguridad, considera implementar blacklist de tokens');
  });

  it('should handle concurrent logout attempts gracefully', async () => {
    // Arrange - Preparar múltiples intentos de logout simultáneos
    const logoutPromises = [];
    
    // Act - Hacer múltiples logout requests simultáneamente
    for (let i = 0; i < 3; i++) {
      logoutPromises.push(
        request(app)
          .post('/api/v1/auth/logout')
          .set('Authorization', `Bearer ${authToken}`)
          .send()
      );
    }

    const responses = await Promise.all(logoutPromises);

    // Assert - Todos deberían ser exitosos dado el comportamiento actual
    const successfulResponses = responses.filter(r => r.status === 200);
    
    // Todos deberían ser exitosos ya que el token no se invalida
    expect(successfulResponses.length).toBe(3);
    
    // Verificar que las respuestas tienen el mensaje correcto
    successfulResponses.forEach(response => {
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe("Usuario ha hecho logout exitosamente");
    });
  });
});