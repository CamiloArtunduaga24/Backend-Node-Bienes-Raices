import express  from "express";
import { body } from 'express-validator'
import { admin,
         crear,
        guardar,
        agregarImagen,
        almacenarImage,
        editarPropiedad,
        guardarCambios,
        eliminarPropiedad,
        mostrarPropiedad,
        enviarMensaje
        } from "../controllers/propiedad.controller.js";
import protegerRuta from "../middleware/protegerRuta.js";
import upload from "../middleware/subirImagen.js";
import identificarUsuario from "../middleware/identificarUsuario.js";

const router = express.Router();


router.get('/mis-propiedades', protegerRuta, admin);

router.get('/propiedades/crear', protegerRuta, crear);

router.post('/propiedades/crear',
        protegerRuta,
        body('titulo').notEmpty().withMessage('El titulo del anuncio es obligatorio'),
        body('descripcion')
            .notEmpty().withMessage('La descripción no puede ir vacia')
            .isLength({ max: 200 }).withMessage('La descripción es muy larga'),
        body('categoria').isNumeric().withMessage('Selecciona una categoria'),
        body('precio').isNumeric().withMessage('Selecciona un reango de precios'),
        body('habitaciones').isNumeric().withMessage('Selecciona la cantidad de habitaciones'),
        body('estacionamiento').isNumeric().withMessage('Selecciona la cantidad de estacionamiento'),
        body('wc').isNumeric().withMessage('Selecciona la cantidad de baños'),
        body('lat').notEmpty().withMessage('Ubica la propiedad en el mapa'),
        guardar
 );

 router.get('/propiedades/agregar-imagen/:id',
                protegerRuta,
                agregarImagen)


 router.post('/propiedades/agregar-imagen/:id', 
        protegerRuta,
        upload.single('imagen'),
        almacenarImage
)

 router.get('/propiedades/editar/:id', 
        protegerRuta,
        editarPropiedad)

 router.post('/propiedades/editar/:id',
        protegerRuta,
        body('titulo').notEmpty().withMessage('El titulo del anuncio es obligatorio'),
        body('descripcion')
            .notEmpty().withMessage('La descripción no puede ir vacia')
            .isLength({ max: 400 }).withMessage('La descripción es muy larga'),
        body('categoria').isNumeric().withMessage('Selecciona una categoria'),
        body('precio').isNumeric().withMessage('Selecciona un reango de precios'),
        body('habitaciones').isNumeric().withMessage('Selecciona la cantidad de habitaciones'),
        body('estacionamiento').isNumeric().withMessage('Selecciona la cantidad de estacionamiento'),
        body('wc').isNumeric().withMessage('Selecciona la cantidad de baños'),
        body('lat').notEmpty().withMessage('Ubica la propiedad en el mapa'),
        guardarCambios
 );

 router.post('/propiedades/eliminar/:id',
        protegerRuta,
        eliminarPropiedad
        )


//Area publica
 router.get('/propiedad/:id',
       identificarUsuario,
       mostrarPropiedad)


//Almacenar los mensajes
router.post('/propiedad/:id',
       identificarUsuario,
       body('mensaje').isLength({min:10}).withMessage('El mensaje no puede ir vacio o es muy corto'),
       enviarMensaje)


export default router