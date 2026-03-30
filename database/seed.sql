-- Seed admin user (password: admin123)
-- Hash generated with argon2 - replace if needed
INSERT INTO users (name, email, password_hash, role)
VALUES ('Admin', 'admin@studydigest.com', '$argon2id$v=19$m=65536,t=3,p=4$placeholder$placeholder', 'admin')
ON CONFLICT (email) DO NOTHING;

-- Seed student user (password: student123)
INSERT INTO users (name, email, password_hash, role)
VALUES ('Test Student', 'student@studydigest.com', '$argon2id$v=19$m=65536,t=3,p=4$placeholder$placeholder', 'student')
ON CONFLICT (email) DO NOTHING;
