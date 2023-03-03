
//const express = require('express'); //common js
import express from 'express';
import csurf from 'csurf';
import cookieParser from 'cookie-parser';
import usuarioRoutes from './routes/usuarioRoutes.js';
import propiedadesRoutes from './routes/propiedadesRoutes.js';
import appRoutes from './routes/appRoutes.js';
import apiRoutes from './routes/apiRoutes.js';
import BD from './config/db.js';


//Crear la app
const app = express();

//Habilitar lectura de Datos de FORMS
app.use( express.urlencoded({extended: true}) )

//Habilitar cookie parser
app.use( cookieParser() )

//Habilitar CSURF
app.use( csurf({ cookie: true }) )

//Conexión a la Base de Datos
try {

    await BD.authenticate();
    BD.sync()
    console.log('Conexion correcta a la BD');
    
} catch (error) {

    console.log(error);
    
}

//Habilitar PUG
app.set('view engine', 'pug');
app.set('views', './views')

//Carpeta publica

app.use( express.static('public') )



//Routing
app.use('/', appRoutes)

app.use('/auth', usuarioRoutes);

app.use('/', propiedadesRoutes)

app.use('/api', apiRoutes)



//Definir un puerto y arrancar el proyecto

const port = process.env.PORT || 3000;

app.listen( port, () => {
    console.log('El servidor estra funcionando en el puerto' + port);
});