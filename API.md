# Documentação da API

Você pode importar diretamente esta collection no Postman:

1. Baixe o arquivo `postman/controle-turmas-collection.json`.
2. No Postman: **Import** → **File** → selecione o JSON.

---

## Endpoints

| Método | Rota                  | Descrição                         |
| ------ | --------------------- | --------------------------------- |
| POST   | `/users/register`     | Cadastra novo usuário             |
| POST   | `/users/login`        | Autentica e retorna JWT           |
| GET    | `/users/profile`      | Pega informações do usuário       |
| GET   | `/users/admin`        | Verifica se o usuário é admin     |
| GET    | `/courses`            | Lista todos os cursos             |
| POST   | `/courses`            | Cria um novo curso (admin)        |
| GET    | `/classes`            | Lista turmas (filtrado por role)  |
| POST   | `/classes`            | Cria turma (admin)                |
| POST   | `/classes/:id/students`| Adiciona aluno à turma (prof)    |
| GET    | `/classes/:id/students`| Lista alunos da turma            |
