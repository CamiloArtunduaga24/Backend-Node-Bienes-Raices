import { unlink } from 'node:fs/promises'
import { validationResult } from 'express-validator'
import { Precio, Categoria, Propiedad} from '../models/index.js'


const admin = async (req, res) => {

    const { id } = req.usuario

    const propiedades = await Propiedad.findAll({
        where: {
            usuarioId : id
        },
        include: [
            { model: Categoria, as: 'categoria' },
            { model: Precio, as: 'precio' }
        ]
    }) 

    console.log('el id ->',id);
    res.render('propiedades/admin', {
        pagina: 'Mis propiedades',
        propiedades,
        csrfToken: req.csrfToken(),
    })
}

//Formulario para crear una nueva propiedad
const crear = async (req, res) => {

    // Consultar modelo de precio y categorias
    const [categorias, precios] = await Promise.all([
        Categoria.findAll(),
        Precio.findAll()
    ]);

    res.render('propiedades/crear', {
        pagina: 'Crear propiedades',
        csrfToken: req.csrfToken(),
        categorias,
        precios,
        datos: {}
    })
}

const guardar = async (req, res) => {

    //validacion 
    let resultado = validationResult(req);

    if(!resultado.isEmpty()) {

        const [categorias, precios] = await Promise.all([
            Categoria.findAll(),
            Precio.findAll()
        ]);

        return res.render('propiedades/crear', {
            pagina: 'Crear propiedades',
            csrfToken: req.csrfToken(),
            categorias,
            precios,
            errores: resultado.array(),
            datos: req.body
        })
    }


    //Crear un registro

    const { titulo, 
            descripcion, 
            habitaciones, 
            estacionamiento, 
            wc, 
            calle, 
            lat, 
            lng, 
            precio: precioId,
            categoria: categoriaId} = req.body

     //console.log('====>',req.usuario.id);
     const { id: usuarioId } = req.usuario


    

    try {
        
        const propiedadGuardada = await Propiedad.create({
            titulo,
            descripcion,
            habitaciones,
            estacionamiento,
            wc,
            calle,
            lat,
            lng,
            precioId,
            categoriaId,
            usuarioId,
            img: ''
        })

        const { id } = propiedadGuardada


        res.redirect(`/propiedades/agregar-imagen/${id}`)

    } catch (error) {
        console.log('aqui va el error',error);
    }

}

const agregarImagen = async (req, res) => {
    const { id } = req.params


    //Validar que la propiedad exista 
    const propiedad = await Propiedad.findByPk(id)

    if(!propiedad) {
        return res.redirect('/mis-propiedades')
    }


    //Validar que no esté públicada
    if(propiedad.publicado) {
        return res.redirect('/mis-propiedades')
    }

    //Validar que la propiedad pertenece a quien visite la página

    if(req.usuario.id.toString() !== propiedad.usuarioId.toString() ){
        return res.redirect('/mis-propiedades')
    }


    res.render('propiedades/agregar-imagen', {
        pagina: `Agregar Imagen: ${propiedad.titulo}`,
        csrfToken: req.csrfToken(),
        propiedad,
    })
}


const almacenarImage = async (req, res, next) => {
    const { id } = req.params


    //Validar que la propiedad exista 
    const propiedad = await Propiedad.findByPk(id)

    if(!propiedad) {
        return res.redirect('/mis-propiedades')
    }


    //Validar que no esté públicada
    if(propiedad.publicado) {
        return res.redirect('/mis-propiedades')
    }

    //Validar que la propiedad pertenece a quien visite la página

    if(req.usuario.id.toString() !== propiedad.usuarioId.toString() ){
        return res.redirect('/mis-propiedades')
    }

    try {

        console.log(req.file);
        //Almacenar la imagen y publicar propiedad
        propiedad.img = req.file.filename
        propiedad.publicado = 1

        await propiedad.save()

        next()

    } catch (error) {
        console.log(error);
    }
}

const editarPropiedad = async (req, res) => {

    const {id} = req.params

    //Validar que la propiedad exista
    const propiedad = await Propiedad.findByPk(id)

    if(!propiedad) {
        return res.redirect('/mis-propiedades')
    }

    //Revisar que quien visita la URL, es quien creo la propiedad

    if(propiedad.usuarioId.toString() !== req.usuario.id.toString()) {
        return res.redirect('/mis-propiedades')

    }

    // Consultar modelo de precio y categorias
    const [categorias, precios] = await Promise.all([
        Categoria.findAll(),
        Precio.findAll()
    ]);

    res.render('propiedades/editar', {
        pagina: `Editar propiedad: ${propiedad.titulo}`,
        csrfToken: req.csrfToken(),
        categorias,
        precios,
        datos: propiedad
    })
}


const guardarCambios = async (req, res) => {

    //Verificar la validacion

    let resultado = validationResult(req);

    if(!resultado.isEmpty()) {

        const [categorias, precios] = await Promise.all([
            Categoria.findAll(),
            Precio.findAll()
        ]);

        res.render('propiedades/editar', {
            pagina: 'Editar propiedad',
            csrfToken: req.csrfToken(),
            categorias,
            precios,
            errores: resultado.array(),
            datos: req.body
        })
    }

    const {id} = req.params

    //Validar que la propiedad exista
    const propiedad = await Propiedad.findByPk(id)

    if(!propiedad) {
        return res.redirect('/mis-propiedades')
    }

    //Revisar que quien visita la URL, es quien creo la propiedad

    if(propiedad.usuarioId.toString() !== req.usuario.id.toString()) {
        return res.redirect('/mis-propiedades')

    }

    //Reescribir el objeto y actualizarlo

    try {

        const { titulo, 
            descripcion, 
            habitaciones, 
            estacionamiento, 
            wc, 
            calle, 
            lat, 
            lng, 
            precio: precioId,
            categoria: categoriaId} = req.body

        propiedad.set({
            titulo,
            descripcion,
            habitaciones,
            estacionamiento,
            wc,
            calle,
            lat,
            lng,
            precioId,
            categoriaId
        })

        await propiedad.save()

        res.redirect('/mis-propiedades')
        
    } catch (error) {
        console.log(error);
    }
}


const eliminarPropiedad = async (req, res) => {

    const {id} = req.params

    //Validar que la propiedad exista
    const propiedad = await Propiedad.findByPk(id)

    if(!propiedad) {
        return res.redirect('/mis-propiedades')
    }

    //Revisar que quien visita la URL, es quien creo la propiedad

    if(propiedad.usuarioId.toString() !== req.usuario.id.toString()) {
        return res.redirect('/mis-propiedades')

    }

    //Eliminar imagen
    await unlink(`public/uploads/${propiedad.img}`)

    //Eliminar la propiedad

    await propiedad.destroy();
    res.redirect('/mis-propiedades')
}


//Muestra una propiedad
const mostrarPropiedad = async(req, res) => {
    res.render('propiedades/mostrar',
    )
}

export {
    admin, 
    crear,
    guardar,
    agregarImagen,
    almacenarImage,
    editarPropiedad,
    guardarCambios,
    eliminarPropiedad,
    mostrarPropiedad
}