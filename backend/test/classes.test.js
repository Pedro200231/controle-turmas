import request from 'supertest';
import { expect } from 'chai';
import app from '../src/app.js';
import { connectTestDB, closeTestDB, clearTestDB } from './setup.js';

describe('Classes API', () => {
  let adminToken, profToken, alunoId, profId, courseId;

  before(async () => {
    await connectTestDB();
  });

  after(async () => {
    await closeTestDB();
  });

  beforeEach(async () => {
    await clearTestDB();

    await request(app)
      .post('/users/register')
      .send({ name: 'Admin', email: 'a@a.com', password: '123', role: 'admin' });
    const adminLogin = await request(app)
      .post('/users/login')
      .send({ email: 'a@a.com', password: '123' });
    adminToken = adminLogin.body.token;

    await request(app)
      .post('/users/register')
      .send({ name: 'Prof', email: 'p@p.com', password: '123', role: 'professor' });
    const profLogin = await request(app)
      .post('/users/login')
      .send({ email: 'p@p.com', password: '123' });
    profToken = profLogin.body.token;
    profId = profLogin.body.token && (await request(app).get('/users?role=professor')
      .set('Authorization', `Bearer ${adminToken}`)).body[0]._id;

    await request(app)
      .post('/users/register')
      .send({ name: 'Aluno', email: 'al@a.com', password: '123', role: 'aluno' });
    const alunos = (await request(app)
      .get('/users?role=aluno')
      .set('Authorization', `Bearer ${adminToken}`)).body;
    alunoId = alunos[0]._id;

    const courseRes = await request(app)
      .post('/courses')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: 'Biologia' });
    courseId = courseRes.body._id;
  });

  it('admin should create a class', async () => {
    const res = await request(app)
      .post('/classes')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ course: courseId, professor: profId });
    expect(res.status).to.equal(201);
    expect(res.body).to.include({ course: courseId });
  });

  it('professor should list only their classes', async () => {
    await request(app)
      .post('/classes')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ course: courseId, professor: profId });
    const otherProfId = adminToken; 
    await request(app)
      .post('/classes')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ course: courseId, professor: otherProfId });

    const res = await request(app)
      .get('/classes')
      .set('Authorization', `Bearer ${profToken}`);
    expect(res.status).to.equal(200);
    expect(res.body).to.be.an('array').with.lengthOf(1);
    expect(res.body[0].professor._id).to.equal(profId);
  });

  it('professor can add student to their class', async () => {
    const cls = await request(app)
      .post('/classes')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ course: courseId, professor: profId });

    const res = await request(app)
      .post(`/classes/${cls.body._id}/students`)
      .set('Authorization', `Bearer ${profToken}`)
      .send({ studentId: alunoId });

    expect(res.status).to.equal(200);
    expect(res.body.students).to.include(alunoId);
  });

  it('admin and professor can list students', async () => {
    const cls = await request(app)
      .post('/classes')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ course: courseId, professor: profId });

    await request(app)
      .post(`/classes/${cls.body._id}/students`)
      .set('Authorization', `Bearer ${profToken}`)
      .send({ studentId: alunoId });

    const resAdmin = await request(app)
      .get(`/classes/${cls.body._id}/students`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect(resAdmin.body).to.be.an('array').with.lengthOf(1);

    const resProf = await request(app)
      .get(`/classes/${cls.body._id}/students`)
      .set('Authorization', `Bearer ${profToken}`);
    expect(resProf.body).to.be.an('array').with.lengthOf(1);
  });
});
