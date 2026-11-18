-- Up Migration

CREATE TABLE users (
  id            BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  email         TEXT        NOT NULL,
  password_hash TEXT        NOT NULL,
  name          TEXT        NOT NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX users_email_lower_idx ON users (lower(email));

CREATE TABLE applications (
  id              BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id         BIGINT      NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  company         TEXT        NOT NULL,
  position        TEXT        NOT NULL,
  job_url         TEXT,
  job_description TEXT,
  platform        TEXT,
  work_mode       TEXT CHECK (work_mode IN ('remote', 'hybrid', 'onsite')),
  status          TEXT        NOT NULL DEFAULT 'saved'
                  CHECK (status IN ('saved', 'applied', 'technical_test', 'interview', 'offer', 'rejected', 'withdrawn')),
  applied_at      DATE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX applications_user_id_status_idx ON applications (user_id, status);

-- Down Migration

DROP TABLE applications;
DROP TABLE users;