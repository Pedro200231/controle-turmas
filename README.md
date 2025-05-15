# Sistema de Controle de Turmas

## Descrição

App para cadastro e gerenciamento de cursos, professores, alunos e turmas com roles (admin, prof, aluno).

## Tecnologias

- Frontend: React + Vite + CSS Modules  
- Backend: Node.js + Express + MongoDB + Mongoose  
- Autenticação: JWT  
- Testes: Mocha, Chai, Supertest  
- CI/CD: GitHub Actions

## Setup

1. Clone o repositório  

   ```bash
   git clone https://github.com/SEU_USUARIO/controle-turmas.git
   cd controle-turmas
   ```

2. Backend

    ```bash
    cd backend
    npm install
    cp .env.example .env   # preencha .env com suas variáveis
    npm run dev            # inicia em <http://localhost:4000>
    ```

3. Frontend

    ```bash
    cd frontend
    npm install
    npm run dev            # inicia em http://localhost:5173 (ou porta configurada)
    ```

4. Testes

    ```bash
    # no backend
    npm test    
    ```
