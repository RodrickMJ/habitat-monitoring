import request from 'supertest';
import { app } from '../../app';

describe('LG02 - Login con email inexistente (Status: 401)', () => {
  
  it('should reject login with non-existent email and return 401', async () => {
    const nonExistentLoginData = {
      email: "noexiste@test.com",
      password: "cualquiera"
    };

    const response = await request(app)
      .post('/api/v1/auth/login')
      .send(nonExistentLoginData);

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('message', 'Credenciales inválidas');
    expect(response.body).toHaveProperty('code', 401);
    expect(response.body).toHaveProperty('success', false);
    expect(response.body).not.toHaveProperty('token');
  });

  it('should reject login with email that looks valid but does not exist', async () => {
    const fakeLoginData = {
      email: `fake.user.${Date.now()}@hamster.com`, 
      password: "Secure123!"
    };

    const response = await request(app)
      .post('/api/v1/auth/login')
      .send(fakeLoginData);

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('message', 'Credenciales inválidas');
    expect(response.body).toHaveProperty('success', false);
    expect(response.body).not.toHaveProperty('token');
  });

  it('should reject login with empty email', async () => {
    const emptyEmailData = {
      email: "",
      password: "Secure123!"
    };

    const response = await request(app)
      .post('/api/v1/auth/login')
      .send(emptyEmailData);

    expect([400, 401]).toContain(response.status);
    expect(response.body).toHaveProperty('success', false);
    expect(response.body).not.toHaveProperty('token');
  });

  it('should reject login with malformed email format', async () => {
    const malformedEmailData = {
      email: "not-an-email",
      password: "Secure123!"
    };

    const response = await request(app)
      .post('/api/v1/auth/login')
      .send(malformedEmailData);

    expect([400, 401]).toContain(response.status);
    expect(response.body).toHaveProperty('success', false);
    expect(response.body).not.toHaveProperty('token');
  });

  it('should not reveal user existence information', async () => {
    const nonExistentEmail1 = {
      email: "definitely.not.exists@nowhere.com",
      password: "wrongpassword"
    };

    const nonExistentEmail2 = {
      email: "another.fake@nowhere.com", 
      password: "differentpassword"
    };

    const response1 = await request(app)
      .post('/api/v1/auth/login')
      .send(nonExistentEmail1);

    const response2 = await request(app)
      .post('/api/v1/auth/login')
      .send(nonExistentEmail2);

    expect(response1.status).toBe(401);
    expect(response2.status).toBe(401);
    expect(response1.body.message).toBe(response2.body.message);
    expect(response1.body).not.toHaveProperty('token');
    expect(response2.body).not.toHaveProperty('token');
  });

  it('should handle special characters in email', async () => {
    const specialEmailData = {
      email: "user+test@domain..com", 
      password: "Secure123!"
    };

    const response = await request(app)
      .post('/api/v1/auth/login')
      .send(specialEmailData);

    expect([400, 401]).toContain(response.status);
    expect(response.body).toHaveProperty('success', false);
    expect(response.body).not.toHaveProperty('token');
  });

  it('should reject login with email case variations of non-existent user', async () => {
    const baseEmail = `nonexistent.${Date.now()}@test.com`;
    
    const variations = [
      baseEmail.toLowerCase(),
      baseEmail.toUpperCase(),
      baseEmail.charAt(0).toUpperCase() + baseEmail.slice(1)
    ];

    for (const email of variations) {
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: email,
          password: "AnyPassword123!"
        });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('success', false);
      expect(response.body).not.toHaveProperty('token');
    }
  });

  it('should maintain consistent response time for security', async () => {
    const startTime = Date.now();
    
    const response = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: "timing.attack.test@nowhere.com",
        password: "irrelevant"
      });
    
    const endTime = Date.now();
    const responseTime = endTime - startTime;

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('success', false);
    
    expect(responseTime).toBeGreaterThan(5); 
    
    expect(responseTime).toBeLessThan(2000);
    
    console.log(`⏱️ [LG02] Response time for non-existent email: ${responseTime}ms`);
  });
});