import categorias from "./categorias.js";
import precios from "./precios.js";
import usuarios from "./usuarios.js";
// import Categoria from "../models/categoria.js";
// import Precio from "../models/precio.js";
import BD from '../config/db.js'
import db from "../config/db.js";
import { Categoria, Precio, Usuario } from "../models/index.js"

const importarDatos = async() => {
    try {
        //autenticar en la BD
        await BD.authenticate();


        //Generar las columnas
        await BD.sync()


        //Insertamos los datos
        //await Precio.bulkCreate(precios);

        await Promise.all([
            Precio.bulkCreate(precios),
            Categoria.bulkCreate(categorias),
            Usuario.bulkCreate(usuarios)
        ])

        console.log(precios);

        console.log('datos importados correctamente');
        exit(0);
        
    } catch (error) {
        console.log('ERROR',error);
        process.exit(1);
    }
}

const eliminarDatos = async () => {
    try {

        // await Promise.all([
        //     Precio.destroy({where: {}, truncate: true}),
        //     Categoria.destroy({where: {}, truncate: true})
        // ])

        await db.sync({force:true});

        console.log('datos eliminados correctamente');
        
    } catch (error) {
        console.log('ERROR',error);
        process.exit(1);
    }
}

if(process.argv[2] === "-i") {
    importarDatos();
}

if(process.argv[2] === "-e") {
    eliminarDatos();
}

