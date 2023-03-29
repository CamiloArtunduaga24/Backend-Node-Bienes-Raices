import Propiedad from './propiedad.js';
import Precio from './precio.js';
import Categoria from './categoria.js';
import Usuario from './usuario.js';
import Mensaje from './mensaje.js';


//Precio.hasOne(Propiedad)
Propiedad.belongsTo(Precio, {foreignKey: 'precioId'})
Propiedad.belongsTo(Categoria, {foreignKey: 'categoriaId'});
Propiedad.belongsTo(Usuario, {foreignKey: 'usuarioId'});
Propiedad.hasMany(Mensaje, {foreignKey:'propiedadId'})

Mensaje.belongsTo(Propiedad, {foreignKey: 'propiedadId'});
Mensaje.belongsTo(Usuario, {foreignKey: 'usuarioId'});





export {
    Propiedad,
    Precio,
    Categoria,
    Usuario,
    Mensaje
}
