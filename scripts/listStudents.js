const { Pool } = require('pg');

const pool = new Pool({
    user: 'default',
    host: 'ep-orange-smoke-08960365.us-east-1.postgres.vercel-storage.com',
    database: 'verceldb',
    password: 'bf3BTmnKYd4P',
    port: 5432,
    ssl: {rejectUnauthorized: false}
});


const listUsersQuery = `SELECT * FROM students;`;

pool.query(listUsersQuery)
    .then(res => {
        console.log("List students: ", res.rows);
        pool.end();
    })
    .catch(err => {
        console.error(err);
        pool.end();
    });