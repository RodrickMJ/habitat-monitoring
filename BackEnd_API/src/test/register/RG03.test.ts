import request from 'supertest';
import { app } from '../../app';

describe('RG03 - Registro con email inválido (Status: 400)', () => {
  
  it('should reject registration with invalid email format and return 400', async () => {
    const invalidEmailData = {
      name: "Juan",
      lastname: "Pérez",
      email: "correo-invalido", // Email sin formato válido
      password: "Secure123!"
    };

    const response = await request(app)
      .post('/api/v1/auth/register')
      .send(invalidEmailData);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error', 'Formato de email inválido');
    expect(response.body).toHaveProperty('message', 'El correo electrónico proporcionado no tiene un formato válido.');
    expect(response.body).toHaveProperty('code', 400);
    expect(response.body).toHaveProperty('success', false);
  });

  it('should reject email without @ symbol', async () => {
    const userData = {
      name: "Test",
      lastname: "User",
      email: "usuario.test.com", // Sin @
      password: "Secure123!"
    };

    const response = await request(app)
      .post('/api/v1/auth/register')
      .send(userData);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error', 'Formato de email inválido');
    expect(response.body).toHaveProperty('success', false);
  });

  it('should reject email without domain', async () => {
    const userData = {
      name: "Test",
      lastname: "User", 
      email: "usuario@", // Sin dominio
      password: "Secure123!"
    };

    const response = await request(app)
      .post('/api/v1/auth/register')
      .send(userData);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error', 'Formato de email inválido');
    expect(response.body).toHaveProperty('success', false);
  });

  it('should reject email with invalid characters', async () => {
    const userData = {
      name: "Test",
      lastname: "User",
      email: "user@domain..com", // Doble punto - ahora será detectado
      password: "Secure123!"
    };

    const response = await request(app)
      .post('/api/v1/auth/register')
      .send(userData);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error', 'Formato de email inválido');
    expect(response.body).toHaveProperty('success', false);
  });

  it('should reject empty email', async () => {
    const userData = {
      name: "Test",
      lastname: "User",
      email: "", // Email vacío
      password: "Secure123!"
    };

    const response = await request(app)
      .post('/api/v1/auth/register')
      .send(userData);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message', 'Faltan campos obligatorios en la solicitud.');
    expect(response.body).toHaveProperty('success', false);
  });

  it('should reject email with spaces', async () => {
    const userData = {
      name: "Test",
      lastname: "User",
      email: "user @domain.com", // Con espacios
      password: "Secure123!"
    };

    const response = await request(app)
      .post('/api/v1/auth/register')
      .send(userData);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error', 'Formato de email inválido');
    expect(response.body).toHaveProperty('success', false);
  });
});