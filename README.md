# Alnitak

Job application tracker with AI-powered CV-to-offer matching.

Named after the star in Orion's Belt, one of the first references used to navigate the night sky.

## Status

In development. Current phase: project foundation.

## Tech stack

- **API:** Node.js, Express
- **Database:** PostgreSQL
- **Background worker:** Java, Spring Boot
- **AI:** Claude API
- **Frontend:** HTML, CSS, JavaScript

## Project structure

```
alnitak/
├── api/                 Node.js + Express REST API
│   ├── src/
│   │   ├── config/      Environment and app configuration
│   │   ├── routes/      Endpoint definitions
│   │   ├── controllers/ Request handling
│   │   ├── services/    Business logic and external APIs
│   │   ├── middlewares/ Auth, validation, error handling
│   │   └── db/          Connection and migrations
│   └── tests/
├── worker/              Spring Boot service for reminders and reports
├── frontend/            Web client
└── docs/                Diagrams and technical documentation
```
## Local setup

### Database

Requires PostgreSQL. Create a dedicated user and database:

```sql
CREATE ROLE alnitak_app WITH LOGIN PASSWORD 'your_password';
CREATE DATABASE alnitak OWNER alnitak_app;
```

### API

```bash
cd api
cp .env.example .env   # then fill in DATABASE_URL
npm install
npm run dev
```

Health check: `GET http://localhost:3000/health`

## License

MIT
