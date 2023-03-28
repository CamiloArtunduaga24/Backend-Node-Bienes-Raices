import { DataTypes } from "sequelize";
import BD from '../config/db.js';

const Mensaje = BD.define('mensajes', {

    mensaje: {
        type: DataTypes.STRING(200),
        allowNull: false
    }

});


export default Mensaje;