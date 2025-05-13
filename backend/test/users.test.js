// test/users.test.js
import request from 'supertest';
import { expect } from 'chai';
import app from '../src/app.js';        
import { connectTestDB, closeTestDB, clearTestDB } from './setup.js';

describe('Users API', () => {
  before(async () => {
    await connectTestDB();
  });

  after(async () => {
    await closeTestDB();
  });

  beforeEach(async () => {
    await clearTestDB();
  });

  it('should register a new user', async () => {
    const res = await request(app)
      .post('/users/register')
      .send({
        name: 'Teste',
        email: 'teste@example.com',
        password: 'senha123',
        role: 'admin'
      });
    expect(res.status).to.equal(201);
    expect(res.body).to.have.property('token');
  });

  it('should not allow duplicate emails', async () => {
    await request(app)
      .post('/users/register')
      .send({ name: 'A', email: 'a@a.com', password: '123', role: 'aluno' });
    const res2 = await request(app)
      .post('/users/register')
      .send({ name: 'B', email: 'a@a.com', password: '456', role: 'professor' });
    expect(res2.status).to.equal(400);
    expect(res2.body.message).to.match(/Email já cadastrado/i);
  });

  it('should login with valid credentials', async () => {
    await request(app)
      .post('/users/register')
      .send({ name: 'Login', email: 'login@ex.com', password: 'abc123', role: 'aluno' });
    const res = await request(app)
      .post('/users/login')
      .send({ email: 'login@ex.com', password: 'abc123' });
    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('token');
  });

  it('should reject invalid login', async () => {
    const res = await request(app)
      .post('/users/login')
      .send({ email: 'nao@ex.com', password: 'xyz' });
    expect(res.status).to.equal(400);
  });
});
