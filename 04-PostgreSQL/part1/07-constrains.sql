-- NOT NULL , UNIQUE, DEFAULT, CHECK


DROP TABLE IF EXISTS basics.accounts;

CREATE TABLE basics.accounts (
  id SERIAL PRIMARY KEY,

  full_name TEXT NOT NULL,

  email TEXT UNIQUE NOT NULL,

  is_active BOOLEAN DEFAULT true,

  age INTEGER CHECK (age >= 18),

  create_at TIMESTAMP DEFAULT NOW()
);

INSERT INTO basics.accounts (full_name, email, age) VALUES
  ('John Doe', 'john.doe@example.com', 25);


INSERT INTO basics.accounts (full_name,email, age) VALUES
  ('duplicate email user','john.doe@example.com', 25);

  
INSERT INTO basics.accounts (full_name,email, age) VALUES
  ('underage user','underage@gmail.com', 16);