const express = require('express');
const { Pool } = require('pg');
const app = express()
const port = 3000;
app.use(express.json())
require('dotenv').config()
const swaggerUi = require('swagger-ui-express');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup());
const pool = new Pool({
    user: 'default',
    host: 'ep-nameless-thunder-96715843-pooler.us-east-1.postgres.vercel-storage.com',
    database: 'verceldb',
    password: 's1uP8BqDAYGg',
    port: 5432,
    ssl: {rejectUnauthorized: false}
});

const API_KEY = process.env.API_KEY;
const apiKEYvalidations = (req,res, next) =>{
    const userapiKey = req.get('x-api-key')
    if(userapiKey && userapiKey === API_KEY){
        next();
    }else{
        res.status(401).send('codigo invalido ESTA MAL')
    }
}
app.use(apiKEYvalidations)
app.get('/students',(req,res)=>{
    
    const listUsersQuery = `CREATE TABLE students (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(50),
        lastname VARCHAR(50),
        notes TEXT
    );`;
pool.query(listUsersQuery)
    .then(res2 => {
        console.log("List students: ", res.rows);
    res.send(res2.rows)
       
    })
    .catch(err => {
        console.error(err);
        res.status(400)
        res.send("hubo un error")
    });
})
app.get('/students/:id',(req,res)=>{
    const id = req.params.id
    const listUsersQuery = `SELECT * FROM students WHERE id = ${id}`;
    pool.query(listUsersQuery)
    .then(data => {
        console.log("List students: ", res.rows);        
        return res.send(data.rows)

    })
    .catch(err => {
        console.error(err);
        res.status(400)
        res.send("hubo un error")
    });
})
app.post('/students',(req, res) => {
    const insertar = `INSERT INTO students (id,name,lastname,notes) VALUES ('${req.body.id}','${req.body.name}','${req.body.lastname}','${req.body.notes}')`;
    pool.query(insertar)
    .then(data => {
        console.log(res.rows);        
        return res.send(data.rows)
    })
    .catch(err => {
        console.error(err);
        res.status(400)
        res.send("hubo un error")
    });
    console.log(req.body)
})
app.put('/students/:id', (req, res) => {
    const updateQuery = `UPDATE students SET name = '${req.body.name}', lastname = '${req.body.lastname}', notes = '${req.body.notes}' WHERE id = '${req.params.id}';`;
        pool.query(updateQuery)
        .then(data => {
            console.log(res.rows);        
            return res.send(data)
        })
        .catch(err => {
            console.error(err);
            res.status(400)
            res.send("hubo un error")
        });
})
app.delete('/students/:id',(req,res)=>{
    const deleteQuery = `DELETE FROM students WHERE id = ${req.params.id}`;
        pool.query(deleteQuery)
        .then(data => {
            console.log(res.rows);        
            return res.send(data)
        })
        .catch(err => {
            console.error(err);
            res.status(400)
            res.send("hubo un error")
        });
})
app.listen(port,()=>console.log("el server esta prendido"))