<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

<p align="center">
  <a href="https://nestjs.com" target="_blank"><img src="https://img.shields.io/badge/nestjs-%23E0234E.svg?style=for-the-badge&logo=nestjs&logoColor=white" alt="NestJS" /></a>
  <a href="https://www.docker.com" target="_blank"><img src="https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white" alt="Docker" /></a>
  <a href="https://www.postgresql.org" target="_blank"><img src="https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white" alt="Postgres" /></a>
  <a href="https://redis.io" target="_blank"><img src="https://img.shields.io/badge/redis-%23DD0031.svg?style=for-the-badge&logo=redis&logoColor=white" alt="Redis" /></a>
  <a href="https://www.typescriptlang.org" target="_blank"><img src="https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white" alt="Typescript" /></a>
  <a href="https://swagger.io" target="_blank"><img src="https://img.shields.io/badge/-Swagger-%23Clojure?style=for-the-badge&logo=swagger&logoColor=white" alt="Swagger" /></a>
  <a href="https://typeorm.io" target="_blank"><img src="https://img.shields.io/badge/typeorm-%23007ACC.svg?style=for-the-badge&logo=typeorm&logoColor=white" alt="TypeORM" /></a>
</p>

# Descrição

Este projeto é uma implementação de uma aplicação de catálogo de filmes com um sistema de autenticação JWT, seguindo as diretrizes fornecidas. A aplicação é construída com TypeScript e Nest.js, utilizando o TypeORM para interação com o banco de dados PostgreSQL. A documentação da API é fornecida utilizando o Swagger. O Redis é utilizado como cache para melhorar o desempenho da aplicação. O Docker é utilizado para criar e executar contêineres que encapsulam a aplicação, simplificando o processo de desenvolvimento, implantação e escalabilidade.

# Funcionalidades

Autenticação JWT: Implementação de um sistema de autenticação JWT para proteger os endpoints da API.

CRUD de Usuários: Fornece operações CRUD (Create, Read, Update, Delete) para gerenciar usuários.

CRUD de Catálogo de Filmes: Fornece operações CRUD (Create, Read, Update, Delete) para gerenciar um catálogo de filmes. Todas as operações estão protegidas e só podem ser acessadas por usuários autenticados.

Segurança Rate Limiting: Implementação de segurança Rate Limiting para prevenção de ataques de força bruta, limitando o número de solicitações que um cliente pode fazer em um determinado período de tempo.

Criptografia com Bcrypt: Utilização da criptografia com bcrypt para armazenar senhas de forma segura no banco de dados.

# Instalação

```bash
 npm install
```

<p>Configurar .env de acordo com o .env.example</p>

# Rodando Projeto

```bash
 docker compose up -d
```

# Migrations

```bash
# gerar migrations
npm run migration:generate -- src/database/migrations/{name-migration}

# executar migrations
npm run migration:run
```

# API Endpoints

**API Usuários**

```markdown
POST /user/create - Criar novo usuário
GET /user - Retornar todos os usuários
GET /user/{id} - Retornar um usuário
PUT /user/user/{id} - Atualizar um usuário
DELETE /user/delete/{id} - Deletar um usuário
```

**BODY**

```json
{
  "fullName": "",
  "cpf": "",
  "email": "",
  "password": ""
}
```

**API Login**

```markdown
POST /login
```

**BODY**

```json
{
  "email": "",
  "password": ""
}
```

**API Filmes**

```markdown
POST /movie/create - Criar novo filme
GET /movie - Retornar todos os filmes
GET /movie/{id} - Retornar um filme
PUT /movie/movie/{id} - Atualizar um filme
DELETE /movie/delete/{id} - Deletar um filme
```

**BODY**

```json
{
  "title": "",
  "director": "",
  "gender": "",
  "releaseYear": 2024,
  "synopsis": ""
}
```

# Documentação API

Para Acessar a Documentação da API com Swagger acesse localhost:{port}/api

# Test

```bash
# unit tests
npm run test
```

## Contato

- Autor - [Gabriel Gomes](https://www.linkedin.com/in/gabriel-gomes-amorim)
