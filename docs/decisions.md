# Technical decisions

Key decisions made while building Alnitak, the alternatives considered and why each was chosen. Updated at the end of every phase.

## Phase 1: Foundation

### Repository and workflow

| Decision | Alternative | Why |
| --- | --- | --- |
| Monorepo with `api/`, `worker/`, `frontend/` and `docs/` | One repository per service | One place to review the whole project; each service still evolves in its own folder |
| Protected `main`, every change through a pull request | Pushing directly to `main` | Mirrors a team workflow: every change is reviewed and linked to an issue |
| Squash merge only | Merge commits or rebase | One commit per issue keeps the `main` history readable |
| Conventional Commits (`feat:`, `fix:`, `docs:`, `chore:`) | Free-form messages | The type of each change is clear at a glance |
| `.gitattributes` with `eol=lf` | Configuring each editor | The rule lives in the repository and applies to anyone who clones it |
| Prettier with a pinned version | Manual formatting | Consistent style without debate; pinning avoids mass reformatting on upgrades |

### API

| Decision | Alternative | Why |
| --- | --- | --- |
| Separate `app.js` (configuration) from `server.js` (startup) | A single entry file | Tests can import the app without opening a port |
| Node's built-in `--env-file-if-exists` | The `dotenv` package | One dependency fewer; the `if-exists` variant does not fail when no `.env` is present, as in CI |
| Validate environment variables in `config/env.js` | Reading `process.env` wherever needed | The API refuses to start and names the missing variable, instead of failing later with an unclear error |
| `pg` connection pool | One connection per request | Reuses open connections; opening a PostgreSQL connection is expensive |
| 5 second connection timeout | No timeout | A request never hangs when the database is unreachable |
| `/health` checks the database and returns `503` when it fails | A static `200` | Deployment platforms can detect an unhealthy instance |
| Graceful shutdown on `SIGINT` and `SIGTERM` | Exiting immediately | In-flight requests finish and database connections close cleanly |

### Database

| Decision | Alternative | Why |
| --- | --- | --- |
| Dedicated `alnitak_app` role | Using the `postgres` superuser | Least privilege: the application controls only its own database |
| `node-pg-migrate` with plain SQL migrations | An ORM (Prisma, Sequelize) or tables created by hand | Versioned, reversible schema changes in readable SQL, without an extra abstraction layer |
| `GENERATED ALWAYS AS IDENTITY` | `SERIAL` | The SQL-standard approach; prevents inserting IDs by hand by mistake |
| `CHECK` constraint for application status | An `ENUM` type | Adding a status is a simple constraint change |
| Unique index on `lower(email)` | `UNIQUE` on `email` | Prevents duplicate accounts that differ only in letter case |
| `TIMESTAMPTZ` | `TIMESTAMP` | Stores the time zone, avoiding errors between local time and UTC servers |
| Schema diagram in Mermaid | An image exported from a database tool | Lives as text next to the migrations and is updated in the same pull request |
