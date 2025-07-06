import request from 'supertest';
import { app } from '../../app';

describe('RG02 - Registro con email duplicado (Status: 409)', () => {
  
  it('should reject registration with existing email and return 409', async () => {
    const userData = {
      name: "Juan",
      lastname: "Pérez",
      email: "duplicate.test@hamster.com",
      password: "Secure123!"
    };

    // Primer registro - debe ser exitoso
    const firstResponse = await request(app)
      .post('/api/v1/auth/register')
      .send(userData);

    expect(firstResponse.status).toBe(201);
    expect(firstResponse.body).toHaveProperty('success', true);

    // Segundo registro con el mismo email - debe fallar con 409
    const secondResponse = await request(app)
      .post('/api/v1/auth/register')
      .send(userData);

    expect(secondResponse.status).toBe(409);
    expect(secondResponse.body).toHaveProperty('error', 'Email duplicado');
    expect(secondResponse.body).toHaveProperty('message', 'El correo electrónico ya está en uso por otro usuario.');
    expect(secondResponse.body).toHaveProperty('code', 409);
    expect(secondResponse.body).toHaveProperty('success', false);
  });

  it('should reject duplicate email with different case sensitivity', async () => {
    const userData1 = {
      name: "Test",
      lastname: "User1",
      email: "case.test@hamster.com",
      password: "Secure123!"
    };

    const userData2 = {
      name: "Test",
      lastname: "User2", 
      email: "CASE.TEST@HAMSTER.COM",
      password: "Different456!"
    };

    // Registrar primer usuario
    const firstResponse = await request(app)
      .post('/api/v1/auth/register')
      .send(userData1);

    expect(firstResponse.status).toBe(201);

    // Intentar registrar con email en mayúsculas
    const secondResponse = await request(app)
      .post('/api/v1/auth/register')
      .send(userData2);

    expect(secondResponse.status).toBe(409);
    expect(secondResponse.body).toHaveProperty('error', 'Email duplicado');
    expect(secondResponse.body).toHaveProperty('success', false);
  });

  it('should allow registration after user deletion', async () => {
    const userData = {
      name: "Temporal",
      lastname: "User",
      email: "temporal.test@hamster.com", 
      password: "Secure123!"
    };

    // Registrar usuario
    const registerResponse = await request(app)
      .post('/api/v1/auth/register')
      .send(userData);

    expect(registerResponse.status).toBe(201);

    // Eliminar usuario de la base de datos
    const connection = global.testHelper.getConnection();
    if (connection) {
      await connection.execute(
        'DELETE FROM users WHERE email = ?',
        [userData.email]
      );
    }

    // Debe permitir registrar nuevamente
    const reRegisterResponse = await request(app)
      .post('/api/v1/auth/register')
      .send(userData);

    expect(reRegisterResponse.status).toBe(201);
  });
});