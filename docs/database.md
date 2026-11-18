# Database

PostgreSQL schema, managed with versioned SQL migrations in `api/src/db/migrations`.

```mermaid
erDiagram
    users ||--o{ applications : "has"

    users {
        bigint id PK
        text email UK "unique, case-insensitive"
        text password_hash
        text name
        timestamptz created_at
        timestamptz updated_at
    }

    applications {
        bigint id PK
        bigint user_id FK
        text company
        text position
        text job_url "nullable"
        text job_description "nullable"
        text platform "nullable"
        text work_mode "remote, hybrid, onsite"
        text status "saved by default"
        date applied_at "nullable"
        timestamptz created_at
        timestamptz updated_at
    }
```

## Constraints and indexes

| Table | Name | Purpose |
| --- | --- | --- |
| users | `users_email_lower_idx` | Unique index on `lower(email)`: prevents duplicate accounts that differ only in letter case |
| applications | `user_id` foreign key | `ON DELETE CASCADE`: deleting a user removes their applications |
| applications | `status` check | Allowed values: `saved`, `applied`, `technical_test`, `interview`, `offer`, `rejected`, `withdrawn` |
| applications | `work_mode` check | Allowed values: `remote`, `hybrid`, `onsite` |
| applications | `applications_user_id_status_idx` | Speeds up the most common query: a user's applications filtered by status |

## Running migrations

```bash
cd api
npm run migrate -- up      # apply pending migrations
npm run migrate -- down    # revert the last migration
```

Any schema change must include an update to this document in the same pull request.