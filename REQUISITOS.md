# Requisitos do Sistema

| ID   | Descrição                                                                              | Ator          |
| ---- | -------------------------------------------------------------------------------------- | ------------- |
| RF1  | O administrador deve cadastrar novos **alunos**.                                       | Administrador |
| RF2  | O administrador deve cadastrar novos **professores**.                                  | Administrador |
| RF3  | O administrador deve cadastrar novos **cursos**.                                       | Administrador |
| RF4  | O administrador deve criar **turmas** vinculadas a um curso e a um professor.          | Administrador |
| RF5  | O aluno autenticado deve **visualizar** suas turmas.                                   | Aluno         |
| RF6  | O professor autenticado deve **visualizar** todas as turmas.                           | Professor     |
| RF7  | O professor autenticado deve **incluir** alunos em suas turmas.                        | Professor     |
| RF8  | O sistema deve **autenticar** usuários (alunos, professores, administradores) via JWT. | Todos         |
| RF9  | O sistema deve aplicar **controle de acesso** baseado em função (RBAC).                | Todos         |
