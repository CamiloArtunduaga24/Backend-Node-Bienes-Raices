
import { Precio, Categoria, Propiedad} from '../models/index.js'

const inicio = async (req, res) => {

    const [ categorias, precios, casas, apartamentos ] = await Promise.all([
        Categoria.findAll({raw: true}),
        Precio.findAll({raw: true}),
        Propiedad.findAll({
            limit: 3,
            where: {
                categoriaId: 1
            },
            include: [
                {
                    model: Precio,
                    as: 'precio'
                }
            ],
            order: [
                ['createdAt', 'DESC']
            ]
        }),
        Propiedad.findAll({
            limit: 3,
            where: {
                categoriaId: 2
            },
            include: [
                {
                    model: Precio,
                    as: 'precio'
                }
            ],
            order: [
                ['createdAt', 'DESC']
            ]
        })
    ])

    // console.log(categorias);

    res.render('inicio', {
        pagina: 'Inicio',
        categorias,
        precios,
        casas,
        apartamentos
    })
}

const categoria = async (req, res) => {
    const { id } = req.params
    console.log(id);

    //Comprobar que la categoria exista
    const categoria = await Categoria.findByPk(id)
    if(!categoria) {
        return res.redirect('/404')
    }
    //Obtener propiedades  de la categoria
    const propiedades = await Propiedad.findAll({
        where: {
            categoriaId: id,
        },
        include: [
            { model: Precio, as: 'precio' }
        ]
    })

    res.render('categoria', {
        pagina: `${categoria.nombre}s en venta`,
        propiedades
    })
} 

const notFound = (req, res) => {
    res.render('404', {
        pagina: 'No encontrada'
    })
} 

const buscador = (req, res) => {

} 




export {
    inicio,
    categoria,
    notFound,
    buscador
}