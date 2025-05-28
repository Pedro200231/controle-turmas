import request from 'supertest';
import { expect } from 'chai';
import app from '../src/app.js';
import { connectTestDB, closeTestDB, clearTestDB } from './setup.js';

describe('Courses API', () => {
  let adminToken;

  before(async () => {
    await connectTestDB();

    await request(app)
      .post('/users/register')
      .send({ name: 'Admin', email: 'a@a.com', password: '123', role: 'admin' });

    const res = await request(app)
      .post('/users/login')
      .send({ email: 'a@a.com', password: '123' });

    adminToken = res.body.token;
  });

  after(async () => {
    await closeTestDB();
  });

  beforeEach(async () => {
    await clearTestDB();
    await request(app)
      .post('/users/register')
      .send({ name: 'Admin', email: 'a@a.com', password: '123', role: 'admin' });
    const res = await request(app)
      .post('/users/login')
      .send({ email: 'a@a.com', password: '123' });
    adminToken = res.body.token;
  });

  it('should allow admin to create a course', async () => {
    const res = await request(app)
      .post('/courses')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: 'Matemática', description: 'Básico' });

    expect(res.status).to.equal(201);
    expect(res.body).to.include({ name: 'Matemática' });
  });

  it('should not allow non-admin to create a course', async () => {
    await request(app)
      .post('/users/register')
      .send({ name: 'Aluno', email: 'al@a.com', password: '123', role: 'aluno' });
    const login = await request(app)
      .post('/users/login')
      .send({ email: 'al@a.com', password: '123' });
    const tokenAluno = login.body.token;

    const res = await request(app)
      .post('/courses')
      .set('Authorization', `Bearer ${tokenAluno}`)
      .send({ name: 'Física' });
      

    expect(res.status).to.equal(403);
  });

  it('should list courses for any authenticated user', async () => {
    await request(app)
      .post('/courses')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: 'Arte' });
    await request(app)
      .post('/courses')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: 'História' });

    await request(app)
      .post('/users/register')
      .send({ name: 'Prof', email: 'p@p.com', password: '123', role: 'professor' });
    const loginProf = await request(app)
      .post('/users/login')
      .send({ email: 'p@p.com', password: '123' });
    const profToken = loginProf.body.token;

    const res = await request(app)
      .get('/courses')
      .set('Authorization', `Bearer ${profToken}`);

    expect(res.status).to.equal(200);
    expect(res.body).to.be.an('array').that.has.length(2);
  });
});
