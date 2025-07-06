import request from 'supertest';
import { app } from '../../app';

describe('RG04 - Registro con campos faltantes (Status: 400)', () => {
  
  it('should reject registration with missing name field', async () => {
    const incompleteData = {
      name: "", // Campo vacío
      lastname: "Pérez",
      email: "test@test.com",
      password: "Secure123!"
    };

    const response = await request(app)
      .post('/api/v1/auth/register')
      .send(incompleteData);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message', 'Faltan campos obligatorios en la solicitud.');
    expect(response.body).toHaveProperty('success', false);
    expect(response.body).toHaveProperty('code', 400);
  });

  it('should reject registration with missing lastname field', async () => {
    const incompleteData = {
      name: "Juan",
      lastname: "", // Campo vacío
      email: "test2@test.com",
      password: "Secure123!"
    };

    const response = await request(app)
      .post('/api/v1/auth/register')
      .send(incompleteData);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message', 'Faltan campos obligatorios en la solicitud.');
    expect(response.body).toHaveProperty('success', false);
  });

  it('should reject registration with missing email field', async () => {
    const incompleteData = {
      name: "Juan",
      lastname: "Pérez",
      email: "", // Campo vacío
      password: "Secure123!"
    };

    const response = await request(app)
      .post('/api/v1/auth/register')
      .send(incompleteData);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message', 'Faltan campos obligatorios en la solicitud.');
    expect(response.body).toHaveProperty('success', false);
  });

  it('should reject registration with missing password field', async () => {
    const incompleteData = {
      name: "Juan",
      lastname: "Pérez",
      email: "test3@test.com",
      password: "" // Campo vacío
    };

    const response = await request(app)
      .post('/api/v1/auth/register')
      .send(incompleteData);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message', 'Faltan campos obligatorios en la solicitud.');
    expect(response.body).toHaveProperty('success', false);
  });

  it('should reject registration with undefined name field', async () => {
    const incompleteData = {
      // name: "Juan", // Campo no enviado
      lastname: "Pérez",
      email: "test4@test.com",
      password: "Secure123!"
    };

    const response = await request(app)
      .post('/api/v1/auth/register')
      .send(incompleteData);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message', 'Faltan campos obligatorios en la solicitud.');
    expect(response.body).toHaveProperty('success', false);
  });

  it('should reject registration with only spaces in name field', async () => {
    const incompleteData = {
      name: "   ", // Solo espacios
      lastname: "Pérez",
      email: "test5@test.com",
      password: "Secure123!"
    };

    const response = await request(app)
      .post('/api/v1/auth/register')
      .send(incompleteData);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message', 'Faltan campos obligatorios en la solicitud.');
    expect(response.body).toHaveProperty('success', false);
  });

  it('should reject registration with multiple missing fields', async () => {
    const incompleteData = {
      name: "",
      lastname: "",
      email: "test6@test.com",
      password: ""
    };

    const response = await request(app)
      .post('/api/v1/auth/register')
      .send(incompleteData);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message', 'Faltan campos obligatorios en la solicitud.');
    expect(response.body).toHaveProperty('success', false);
  });

  it('should reject registration with null values', async () => {
    const incompleteData = {
      name: null,
      lastname: "Pérez",
      email: "test7@test.com",
      password: "Secure123!"
    };

    const response = await request(app)
      .post('/api/v1/auth/register')
      .send(incompleteData);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message', 'Faltan campos obligatorios en la solicitud.');
    expect(response.body).toHaveProperty('success', false);
  });
});