const { Pool } = require('pg');

const pool = new Pool({
    user: 'default',
    host: 'ep-nameless-thunder-96715843-pooler.us-east-1.postgres.vercel-storage.com',
    database: 'verceldb',
    password: 's1uP8BqDAYGg',
    port: 5432,
    ssl: {rejectUnauthorized: false}
});


const listUsersQuery = `CREATE TABLE students (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50),
    lastname VARCHAR(50),
    notes TEXT
);`;
pool.query(listUsersQuery)
    .then(res => {
        console.log("Tabla creada");
        pool.end();
    })
    .catch(err => {
        console.error(err);
        pool.end();
    });
    