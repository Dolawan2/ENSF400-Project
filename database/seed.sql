-- Seed admin user (password: admin123)
-- Hash generated with argon2 - replace if needed
INSERT INTO users (name, email, password_hash, role)
VALUES ('Admin', 'admin@studydigest.com', '$argon2id$v=19$m=65536,t=3,p=4$UjHHclR6nEzCdjPvrut7AQ$AJubQ0etr3i4fpS7KyPDBHcQwTd3qUxqyr6ap0lGrxo', 'admin')
ON CONFLICT (email) DO NOTHING;

-- Seed student user (password: student123)
INSERT INTO users (name, email, password_hash, role)
VALUES ('Test Student', 'student@studydigest.com', '$argon2id$v=19$m=65536,t=3,p=4$fj8dK9itaXJM4svC8M0pUw$5yYC5ERTilRWND9MVDAy2x0gKaKbKU8jZHRC+fOnUcY', 'student')
ON CONFLICT (email) DO NOTHING;
