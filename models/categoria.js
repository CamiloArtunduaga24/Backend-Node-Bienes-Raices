import { DataTypes } from "sequelize";
import BD from '../config/db.js';

const Categoria = BD.define('categorias', {

    nombre: {
        type: DataTypes.STRING(30),
        allowNull: false
    }

});


export default Categoria;