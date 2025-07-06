import request from 'supertest';
import { app } from '../../app';

describe('RG01 - Registro con datos válidos (Status: 201)', () => {
  
  it('should register user successfully with valid data and return 201', async () => {
    const validUserData = {
      name: "Juan",
      lastname: "Pérez",
      email: `juan.${Date.now()}@hamster.com`, // Email único
      password: "Secure123!"
    };

    const response = await request(app)
      .post('/api/v1/auth/register')
      .send(validUserData);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('message', 'User registered successfully');
    expect(response.body).toHaveProperty('success', true);
    expect(response.body).not.toHaveProperty('password');
    expect(response.body).not.toHaveProperty('token');
    
    const connection = global.testHelper.getConnection();
    if (connection) {
      const [users] = await connection.execute(
        'SELECT name, lastname, email FROM users WHERE email = ?', 
        [validUserData.email]
      );
      
      expect(users).toHaveLength(1);
      expect((users as any[])[0].name).toBe(validUserData.name);
      expect((users as any[])[0].lastname).toBe(validUserData.lastname);
    }
  });

  it('should hash the password correctly', async () => {
    const userData = {
      name: "TestPassword",
      lastname: "Verification",
      email: `password.${Date.now()}@hamster.com`, // Email único
      password: "PlainTextPassword123!"
    };

    const response = await request(app)
      .post('/api/v1/auth/register')
      .send(userData);

    expect(response.status).toBe(201);
    
    const connection = global.testHelper.getConnection();
    if (connection) {
      const [users] = await connection.execute(
        'SELECT password FROM users WHERE email = ?', 
        [userData.email]
      );
      
      expect(users).toHaveLength(1);
      const storedPassword = (users as any[])[0].password;
      
      expect(storedPassword).not.toBe(userData.password);
      expect(storedPassword).toMatch(/^\$2[aby]\$\d+\$/);
    }
  });
});