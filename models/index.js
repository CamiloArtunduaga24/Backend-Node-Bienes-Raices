import Propiedad from './propiedad.js';
import Precio from './precio.js';
import Categoria from './categoria.js';
import Usuario from './usuario.js';


//Precio.hasOne(Propiedad)
Propiedad.belongsTo(Precio, {foreignKey: 'precioId'})
Propiedad.belongsTo(Categoria, {foreignKey: 'categoriaId'});
Propiedad.belongsTo(Usuario, {foreignKey: 'usuarioId'});



export {
    Propiedad,
    Precio,
    Usuario,
    Categoria
}
