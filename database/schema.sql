CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE users (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name            VARCHAR(100)    NOT NULL,
    email           VARCHAR(255)    NOT NULL UNIQUE,
    password_hash   TEXT            NOT NULL,
    role            VARCHAR(20)     NOT NULL DEFAULT 'student'
                        CHECK (role IN ('student', 'admin')),
    created_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

CREATE TABLE uploads (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID            NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    original_name   VARCHAR(255)    NOT NULL,
    mime_type       VARCHAR(100)    NOT NULL,
    file_size       INTEGER         NOT NULL,
    extracted_text  TEXT            NOT NULL,
    created_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

CREATE TABLE generations (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    upload_id           UUID            NOT NULL REFERENCES uploads(id) ON DELETE CASCADE,
    user_id             UUID            NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    summary             TEXT            NOT NULL,
    structured_summary  JSONB            NOT NULL,
    question_type       VARCHAR(30)     NOT NULL
                            CHECK (question_type IN ('multiple_choice', 'short_answer')),
    questions           JSONB           NOT NULL,
    created_at          TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_uploads_user_id ON uploads(user_id);
CREATE INDEX idx_generations_user_id ON generations(user_id);
CREATE INDEX idx_generations_upload_id ON generations(upload_id);
