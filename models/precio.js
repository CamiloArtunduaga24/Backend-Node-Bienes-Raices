import { DataTypes } from "sequelize";
import BD from '../config/db.js';

const Precio = BD.define('precios', {

    nombre: {
        type: DataTypes.STRING(70),
        allowNull: false
    }

});


export default Precio;