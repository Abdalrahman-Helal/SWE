

DROP TABLE IF EXISTS basics.students;

CREATE TABLE basics.students(
  -- create an auto incrementing primary key column
  -- 1 -> 2 -> 3 -> 4 -> 5
  -- primary key is a unique identifier for each row in the table
  id SERIAL PRIMARY KEY,

  -- text - string data
  -- not null means that the column cannot be empty (required)
  -- postgres is going to reject if this 
  name TEXT NOT NULL,

  -- unique means that the column cannot have duplicate values
  -- no 2 students can have the same email address
  email TEXT NOT NULL UNIQUE,


  age INTEGER CHECK (age >= 18),

  -- TIMESTAMP is a date and time data type
  -- DEFAULT means if no value is provided for this column, it will automatically be set to the current date and time
  created_at TIMESTAMP DEFAULT NOW()
);


-- insert some data 


INSERT INTO basics.students( name , email, age)
VALUES
  ('Helal', 'helal@gmail.com', 25),
  ('Ahmed', 'ahmed@gmail.com', 22);
  
SELECT * FROM basics.students;
