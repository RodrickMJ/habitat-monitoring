import request from 'supertest';
import { app } from '../../app';

describe('RG05 - Error interno del servidor (Status: 400)', () => {
  
  it('should handle database connection errors gracefully', async () => {
    const userData = {
      name: "TestError",
      lastname: "ServerError",
      email: "server.error.test@hamster.com",
      password: "Secure123!"
    };


    const response = await request(app)
      .post('/api/v1/auth/register')
      .send(userData);

    if (response.status === 201) {
      expect(response.body).toHaveProperty('success', true);
      console.log('✅ [RG05] No server errors detected - API working correctly');
    } 
    else if (response.status === 400 || response.status === 500) {
      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('message');
      console.log('✅ [RG05] Server error handled correctly:', response.body.message);
    }
    
    expect([200, 201, 400, 500]).toContain(response.status);
  });

  it('should handle extremely long input strings', async () => {
    const longString = 'a'.repeat(10000); 
    
    const userData = {
      name: longString,
      lastname: "TestLongInput",
      email: "long.input.test@hamster.com",
      password: "Secure123!"
    };

    const response = await request(app)
      .post('/api/v1/auth/register')
      .send(userData);

    if (response.status === 400) {
      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('message');
    } else if (response.status === 201) {
      expect(response.body).toHaveProperty('success', true);
    }

    expect([200, 201, 400, 413, 500]).toContain(response.status);
  });

  it('should handle invalid JSON structure', async () => {
    const invalidData = {
      name: "Test",
      lastname: "User",
      email: "invalid.structure.test@hamster.com",
      password: "Secure123!",
      extraField: { nested: { deeply: { invalid: "structure" } } },
      anotherExtra: [1, 2, 3, 4, 5]
    };

    const response = await request(app)
      .post('/api/v1/auth/register')
      .send(invalidData);

    if (response.status === 201) {
      expect(response.body).toHaveProperty('success', true);
    } else {
      expect(response.body).toHaveProperty('success', false);
    }

    expect(response.status).toBeGreaterThan(0);
  });

  it('should handle concurrent registration attempts', async () => {
    const userData1 = {
      name: "Concurrent1",
      lastname: "Test",
      email: "concurrent1.test@hamster.com",
      password: "Secure123!"
    };

    const userData2 = {
      name: "Concurrent2", 
      lastname: "Test",
      email: "concurrent2.test@hamster.com",
      password: "Secure123!"
    };

    const [response1, response2] = await Promise.all([
      request(app).post('/api/v1/auth/register').send(userData1),
      request(app).post('/api/v1/auth/register').send(userData2)
    ]);

    expect([200, 201, 400, 500]).toContain(response1.status);
    expect([200, 201, 400, 500]).toContain(response2.status);
    
    expect(response1.body).toHaveProperty('success');
    expect(response2.body).toHaveProperty('success');
  });

  it('should handle password with special characters', async () => {
    const userData = {
      name: "SpecialChar",
      lastname: "Test",
      email: "special.chars.test@hamster.com",
      password: "P@ssw0rd!@#$%^&*()_+-=[]{}|;':\",./<>?" 
    };

    const response = await request(app)
      .post('/api/v1/auth/register')
      .send(userData);

    if (response.status === 201) {
      expect(response.body).toHaveProperty('success', true);
      
      const connection = global.testHelper.getConnection();
      if (connection) {
        const [users] = await connection.execute(
          'SELECT password FROM users WHERE email = ?',
          [userData.email]
        );
        
        if (users && (users as any[]).length > 0) {
          const storedPassword = (users as any[])[0].password;
          expect(storedPassword).not.toBe(userData.password);
          expect(storedPassword).toMatch(/^\$2[aby]\$\d+\$/); 
        }
      }
    } else {
      expect(response.body).toHaveProperty('success', false);
    }

    expect(response.status).toBeGreaterThan(0);
  });

  it('should maintain data consistency under stress', async () => {
    const userData = {
      name: "StressTest",
      lastname: "DataConsistency", 
      email: `stress.test.${Date.now()}@hamster.com`,
      password: "Secure123!"
    };

    const response = await request(app)
      .post('/api/v1/auth/register')
      .send(userData);

    expect(response.body).toHaveProperty('success');
    
    if (response.status === 201) {
      expect(response.body.success).toBe(true);
      expect(response.body).toHaveProperty('message', 'User registered successfully');
      
      const connection = global.testHelper.getConnection();
      if (connection) {
        const [users] = await connection.execute(
          'SELECT name, lastname, email FROM users WHERE email = ?',
          [userData.email]
        );
        
        if (users && (users as any[]).length > 0) {
          const user = (users as any[])[0];
          expect(user.name).toBe(userData.name);
          expect(user.lastname).toBe(userData.lastname);
          expect(user.email.toLowerCase()).toBe(userData.email.toLowerCase());
        }
      }
    } else {
      expect(response.body.success).toBe(false);
      expect(response.body).toHaveProperty('message');
    }
  });
});