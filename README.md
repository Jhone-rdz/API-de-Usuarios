# 🟢 API de Usuários com Express.js, PostgreSQL, JWT e Upload de Avatar

Este projeto é uma API RESTful desenvolvida com **Node.js**, **Express** e **PostgreSQL**, incluindo:

- CRUD de usuários
- Registro e login com **JWT**
- Upload de **avatar**
- Proteção de rotas autenticadas
- Servidor de arquivos públicos (para imagem de perfil)

---

## 🚀 Funcionalidades

### 🔓 Rotas públicas:
- `POST /registro` → Cria um novo usuário
- `POST /login` → Realiza login e retorna um token JWT

### 🔐 Rotas protegidas (requer token JWT):
- `GET /usuarios` → Lista usuários
- `POST /usuarios` → Adiciona um novo
- `PUT /usuarios/:id` → Atualiza nome
- `DELETE /usuarios/:id` → Remove usuário
- `POST /upload` → Envia avatar do usuário logado
- `GET /perfil` → Retorna dados do usuário logado (id, nome, avatar)

---

## 🔧 Tecnologias Utilizadas

- Node.js
- Express
- PostgreSQL
- bcryptjs
- jsonwebtoken (JWT)
- multer

---

## 📁 Como executar

### 1. Clone o projeto:
```bash
git clone https://github.com/Jhone-rdz/api-usuarios.git
cd api-usuarios



2. Instale as dependências:
   ```bash
   npm install

3. Configure o banco de dados PostgreSQL:
   - Configure o banco de dados PostgreSQL:
   ```bash
   CREATE DATABASE apiusuarios;

\c apiusuarios

CREATE TABLE usuarios (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(100) NOT NULL
);

4. Execute a API:
   ```bash
   node index.js
5. Acesse via ferramentas como Postman ou Insomnia:
   - GET http://localhost:3000/usuarios
   - POST http://localhost:3000/usuarios
   - PUT http://localhost:3000/usuarios/2
   - DELETE http://localhost:3000/usuarios/1
