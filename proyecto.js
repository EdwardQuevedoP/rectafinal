const express = require('express');
const { Pool } = require('pg');
const app = express()
const multer = require('multer');
const path = require('path');
const port = process.env.PORT||3000;

const swaggerUi = require('swagger-ui-express');

const swaggerJsdoc = require('swagger-jsdoc');

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
// Definir la configuración de Swagger
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Mi API',
      version: '1.0.0',
    },
  },
  apis: ['proyecto.js'], // Ruta al archivo que contiene las rutas de tu API
};


var fotonueva=''

const specs = swaggerJsdoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Definir tus rutas aquí
app.get('/', (req, res) => {
  res.send('Hola, mundo!');
});

/**
 * @swagger
 * /:
 *   get:
 *     summary: Retorna un saludo
 *     responses:
 *       200:
 *         description: Respuesta exitosa
 */
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
  
  app.post('/upload/:id', upload.single('file'), (req, res) => {
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

app.put('/actualizar',(req,res)=>{
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
})


app.listen(port,()=>console.log("el server esta prendido"))

module.exports = app;