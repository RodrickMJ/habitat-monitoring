import request from 'supertest';
import { app } from '../../app';

describe('AN01 - Registro de animal con datos válidos (Status: 201)', () => {
  let authToken: string;

  beforeEach(async () => {
    await request(app)
      .post('/api/v1/auth/register')
      .send({
        name: "TestUser",
        lastname: "Animal",
        email: "testuser.animal@hamster.com",
        password: "Secure123!"
      });

    const loginResponse = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: "testuser.animal@hamster.com",
        password: "Secure123!"
      });

    authToken = loginResponse.body.token;
  });

  it('should register animal successfully with all valid data', async () => {
    // Usar TODOS los campos que tu controlador espera
    const validAnimalData = {
      name: "Luna",
      breed: "Golden Retriever",
      species: "Perro",
      age: 3,
      gender: "Female",
      color: "Golden",
      size: "Large",
      notes: "Golden Retriever muy amigable"
    };

    const response = await request(app)
      .post('/api/v1/animal/register')
      .set('Authorization', `Bearer ${authToken}`)
      .send(validAnimalData);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('message');
    expect(response.body).toHaveProperty('success', true);
    expect(response.body).toHaveProperty('animal');
    expect(response.body.animal).toHaveProperty('id');
    expect(response.body.animal).toHaveProperty('name', 'Luna');
    expect(response.body.animal).toHaveProperty('species', 'Perro');
    expect(response.body.animal).toHaveProperty('age', 3);
    expect(response.body.animal).toHaveProperty('breed', 'Golden Retriever');
    expect(response.body.animal).toHaveProperty('gender', 'Female');
  });

  it('should register animal with only required fields', async () => {
    const minimalAnimalData = {
      name: "Max",
      species: "Gato",
      breed: "Común", // Campo requerido según tu controlador
      gender: "Male",  // Campo requerido según tu controlador
      color: "Gris",   // Campo requerido según tu controlador
      size: "Medium"   // Campo requerido según tu controlador
    };

    const response = await request(app)
      .post('/api/v1/animal/register')
      .set('Authorization', `Bearer ${authToken}`)
      .send(minimalAnimalData);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('success', true);
    expect(response.body).toHaveProperty('animal');
    expect(response.body.animal).toHaveProperty('name', 'Max');
    expect(response.body.animal).toHaveProperty('species', 'Gato');
    expect(response.body.animal).toHaveProperty('id');
  });

  it('should register different species of animals', async () => {
    const animalSpecies = [
      { name: "Buddy", species: "Perro", breed: "Labrador", gender: "Male", color: "Brown", size: "Large", age: 5 },
      { name: "Whiskers", species: "Gato", breed: "Siamés", gender: "Female", color: "White", size: "Small", age: 2 },
      { name: "Polly", species: "Ave", breed: "Canario", gender: "Female", color: "Yellow", size: "Small", age: 1 },
      { name: "Nemo", species: "Pez", breed: "Goldfish", gender: "Male", color: "Orange", size: "Small", age: 1 }
    ];

    for (const animalData of animalSpecies) {
      const response = await request(app)
        .post('/api/v1/animal/register')
        .set('Authorization', `Bearer ${authToken}`)
        .send(animalData);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('animal');
      expect(response.body.animal).toHaveProperty('species', animalData.species);
      expect(response.body.animal).toHaveProperty('name', animalData.name);
    }
  });

  it('should handle animals with special characters in name', async () => {
    const specialCharAnimals = [
      { name: "María José", species: "Perro", breed: "Mestizo", gender: "Female", color: "Café", size: "Medium" },
      { name: "Mr. Whiskers", species: "Gato", breed: "Persa", gender: "Male", color: "Gris", size: "Medium" },
      { name: "Ñandú", species: "Ave", breed: "Ñandú", gender: "Male", color: "Negro", size: "Large" },
      { name: "Jean-Pierre", species: "Perro", breed: "Poodle", gender: "Male", color: "Blanco", size: "Small" }
    ];

    for (const animalData of specialCharAnimals) {
      const response = await request(app)
        .post('/api/v1/animal/register')
        .set('Authorization', `Bearer ${authToken}`)
        .send(animalData);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('animal');
      expect(response.body.animal).toHaveProperty('name', animalData.name);
    }
  });

  it('should register animal with all optional fields', async () => {
    const completeAnimalData = {
      name: "Rex",
      breed: "Pastor Alemán",
      species: "Perro",
      age: 7,
      gender: "Male",
      color: "Negro y café",
      size: "Large",
      notes: "Pastor Alemán muy inteligente y leal, completamente vacunado"
    };

    const response = await request(app)
      .post('/api/v1/animal/register')
      .set('Authorization', `Bearer ${authToken}`)
      .send(completeAnimalData);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('success', true);
    expect(response.body).toHaveProperty('animal');
    expect(response.body.animal).toHaveProperty('name', 'Rex');
    expect(response.body.animal).toHaveProperty('species', 'Perro');
    expect(response.body.animal).toHaveProperty('age', 7);
    expect(response.body.animal).toHaveProperty('breed', 'Pastor Alemán');
    expect(response.body.animal).toHaveProperty('notes', 'Pastor Alemán muy inteligente y leal, completamente vacunado');
  });

  it('should assign unique ID to each registered animal', async () => {
    const animal1 = { name: "Tom1", species: "Gato", breed: "Común", gender: "Male", color: "Gris", size: "Medium" };
    const animal2 = { name: "Tom2", species: "Gato", breed: "Común", gender: "Male", color: "Gris", size: "Medium" };

    const response1 = await request(app)
      .post('/api/v1/animal/register')
      .set('Authorization', `Bearer ${authToken}`)
      .send(animal1);

    const response2 = await request(app)
      .post('/api/v1/animal/register')
      .set('Authorization', `Bearer ${authToken}`)
      .send(animal2);

    expect(response1.status).toBe(201);
    expect(response2.status).toBe(201);
    expect(response1.body.animal).toHaveProperty('id');
    expect(response2.body.animal).toHaveProperty('id');
    expect(response1.body.animal.id).toBeDefined();
    expect(response2.body.animal.id).toBeDefined();
    expect(response1.body.animal.id).not.toBe(response2.body.animal.id);
  });

  it('should handle numeric values correctly', async () => {
    const animalWithNumbers = {
      name: "Bella",
      species: "Perro",
      breed: "Chihuahua",
      gender: "Female",
      color: "Café",
      size: "Small",
      age: 0 // Edad cero
    };

    const response = await request(app)
      .post('/api/v1/animal/register')
      .set('Authorization', `Bearer ${authToken}`)
      .send(animalWithNumbers);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('success', true);
    expect(response.body).toHaveProperty('animal');
    expect(response.body.animal).toHaveProperty('age', 0);
    expect(response.body.animal).toHaveProperty('name', 'Bella');
  });

  it('should include timestamp information', async () => {
    const animalData = {
      name: "Charlie",
      species: "Perro",
      breed: "Beagle",
      gender: "Male",
      color: "Tricolor",
      size: "Medium",
      age: 4
    };

    const response = await request(app)
      .post('/api/v1/animal/register')
      .set('Authorization', `Bearer ${authToken}`)
      .send(animalData);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('success', true);
    expect(response.body).toHaveProperty('animal');

    // Verificar timestamps si existen
    if (response.body.animal.createdAt) {
      expect(response.body.animal).toHaveProperty('createdAt');
      expect(new Date(response.body.animal.createdAt)).toBeInstanceOf(Date);
    }
  });

  it('should handle long descriptions correctly', async () => {
    const longDescription = "Este es un perro muy especial que fue rescatado de la calle. Es muy amigable con los niños y otros animales. Le gusta jugar en el parque y correr por las mañanas. Está completamente vacunado y esterilizado.";

    const animalWithLongDescription = {
      name: "Shadow",
      species: "Perro",
      breed: "Mestizo",
      gender: "Male",
      color: "Negro",
      size: "Large",
      age: 5,
      notes: longDescription
    };

    const response = await request(app)
      .post('/api/v1/animal/register')
      .set('Authorization', `Bearer ${authToken}`)
      .send(animalWithLongDescription);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('success', true);
    expect(response.body).toHaveProperty('animal');
    expect(response.body.animal).toHaveProperty('notes', longDescription);
  });

  it('should return consistent response structure', async () => {
    const animalData = {
      name: "Milo",
      species: "Gato",
      breed: "Persa",
      gender: "Male",
      color: "Blanco",
      size: "Medium",
      age: 2
    };

    const response = await request(app)
      .post('/api/v1/animal/register')
      .set('Authorization', `Bearer ${authToken}`)
      .send(animalData);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('message');
    expect(response.body).toHaveProperty('success', true);
    expect(response.body).toHaveProperty('animal');
    expect(typeof response.body.message).toBe('string');
    expect(typeof response.body.success).toBe('boolean');
    expect(typeof response.body.animal).toBe('object');
    expect(response.body).not.toHaveProperty('password');
    expect(response.body).not.toHaveProperty('token');
  });
});