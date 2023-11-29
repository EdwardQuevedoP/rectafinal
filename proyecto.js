const express = require('express');
const { Pool } = require('pg');
const app = express()
const multer = require('multer');
const path = require('path');
const {swaggerDocs: v1SwaggerDocs} = require('./swagger');
const port = process.env.PORT||3000;


app.use(express.json())

require('dotenv').config()


const pool = new Pool({
    user: 'default',
    host: 'ep-sweet-boat-69198589-pooler.us-east-1.postgres.vercel-storage.com',
    database: 'verceldb',
    password: 'n5JSZ2beFoNG',
    port: 5432,
    ssl: {rejectUnauthorized: false}
});

var fotonueva=''

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
    
  /*  const listUsersQuery = `CREATE TABLE students (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(50),
        lastname VARCHAR(50),
        notes TEXT
    );`;*/
    const listUsersQuery = `SELECT * FROM students`

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

/*
 * @swagger
 * /students:
 *   get:
 *     summary: Obtener la lista de estudiantes.
 *     description: Este endpoint devuelve la lista de estudiantes almacenados en la base de datos.
 *     responses:
 *       200:
 *         description: Lista de estudiantes obtenida con éxito.
 *         content:
 *           application/json:
 *             example:
 *               - id: 1
 *                 name: Juan
 *                 lastname: Perez
 *                 notes: "Buen estudiante"
 *               - id: 2
 *                 name: Maria
 *                 lastname: Rodriguez
 *                 notes: "Necesita mejorar en matemáticas"
 *       400:
 *         description: Error al obtener la lista de estudiantes.
 *         content:
 *           application/json:
 *             example:
 *               error: Hubo un error al procesar la solicitud.
 */


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const destinationPath = path.join(__dirname, '/fotos');
      cb(null, destinationPath);
    },
    filename: (req, file, cb) => {
      cb(null, file.originalname);
      fotonueva=file.originalname
    },
  });
  const upload = multer({ storage: storage });
  
  app.post('/upload/photo/:id', upload.single('file'), (req, res) => {
    const updateQuery = `UPDATE proyecto1 SET photo = 'edwardQuevedo/${fotonueva}' WHERE id = '${req.params.id}';`
    pool.query(updateQuery)
    .then(data => {
        console.log(res.rows);        
        return res.send(data)
    })
    .catch(err => {
        console.error(err);
        res.status(400)
        res.send("hubo un error"+err)
    });
    res.send(updateQuery);
  });

  app.get('/upload/get/:id', (req, res) => {
    const { id } = req.params;
    const getStudentQuery = `SELECT * FROM proyecto1 WHERE id = ${id}`;

    pool.query(getStudentQuery)
        .then(data => {
            console.log("proyecto1 by ID: ", data.rows);
            res.send(data.rows);
        })
        .catch(err => {
            console.error(err);
            res.status(400).send("Hubo un error");
        });
});

app.post('/agregar',(req, res) => {
    const insertar = `INSERT INTO proyecto1 (Project,Data,Name,Notes,Photo,Status) VALUES ('${req.body.project}','${req.body.Data}','${req.body.Name}','${req.body.Notes}','${req.body.Photo}','${req.body.Status}')`;
    pool.query(insertar)
    .then(data => {
        console.log(res.rows);        
        return res.send(data.rows)
    })
    .catch(err => {
        console.error(err);
        res.status(400)
        res.send("hubo un error2"+err)
    });
    console.log(req.body)
})

app.delete('/upload/delete/:id', (req, res) => {
  const { id } = req.params;
  const deleteQuery = 'DELETE FROM proyecto1 WHERE id = $1 RETURNING *';

  pool.query(deleteQuery, [id])
      .then(data => {
          if (data.rows.length === 0) {
              res.status(404).send("Record not found");
          } else {
              res.json({ message: 'Record deleted successfully', deletedRecord: data.rows[0] });
          }
      })
      .catch(err => {
          console.error(err);
          res.status(400).send("Error deleting record");
      });
});



module.exports = app;
app.listen(port, function () {
  console.log(`server in service`);
  v1SwaggerDocs(app, port);
});
