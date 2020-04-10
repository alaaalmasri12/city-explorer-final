DROP TABLE IF EXISTS users;

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(255),
    last_name VARCHAR(255)
);

INSERT INTO users (first_name,last_name) VALUES ('Bushra','Bilal');