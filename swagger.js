const swaggerJSDOC = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// Metadata informacion. Pilas, el versionamiento es por que es comun tener 
// diferentes versiones de nuestra API
const options = {
    definition: {
        openapi: "3.0.0",
        info:{
            title: "proyecto.js",
            version: "1.0.0",
        }
    },
    apis:[
        './app.js'
    ]
}

// Documentacion en formato Json
// Obviamente json!!!
const swaggerSpec = swaggerJSDOC(options);

// Funcion para configurar la documentacion
// Si analizan esto es una ruta, un endpoint, se dan cuenta que 
// recibe una app (la misma d  express) y un puerto (el mismo de la app)
const swaggerDocs = (app,port)=>{
    app.use('/api-docs',swaggerUi.serve, swaggerUi.setup(swaggerSpec))
    
}

module.exports = {swaggerDocs}