-- null means unknown / missing value
-- empty string -- a known value that has no characters
-- zero actual numerical value of 0

DROP TABLE IF EXISTS basics.value_exmaples;

CREATE TABLE basics.value_exmaples (
    id SERIAL PRIMARY KEY,
    nickname TEXT,
    bio TEXT,
    score INTEGER
);

INSERT INTO basics.value_exmaples (nickname, bio, score) 
VALUES
-- nickname as null
    (null, 'learning PostgreSQL', 10),

    ('', 'empty nickname', 20),
    ('helal', '', 0),
    ('john', null , null);


-- SELECT * FROM basics.value_exmaples;

SELECT * FROM basics.value_exmaples WHERE nickname IS NULL;
SELECT * FROM basics.value_exmaples WHERE nickname = '';
SELECT * FROM basics.value_exmaples WHERE score = 0;
SELECT * FROM basics.value_exmaples WHERE nickname IS NOT NULL;

