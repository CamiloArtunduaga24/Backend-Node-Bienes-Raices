import { Sequelize } from "sequelize";
import dotenv from 'dotenv';
dotenv.config({path: '.env'})

const db = new Sequelize(
    process.env.BD_NOMBRE, 
    process.env.BD_USER, 
    process.env.BD_PASSWORD, {
    host: process.env.BD_HOST,
    port: 3306,
    dialect: 'mysql',
    define: {
        timestamps: true
    },
    pool: { //CONFIGURA EL COMPORTAMIENTO PARA CONEXCIONES NUEVAS O EXISTENTES
        max: 5,
        min: 0,
        acquire: 30000, //30 SEGUNDOS TRATANDO DE ELABORA UNA CONEXION ANTES DE MARCAR UN ERROR
        idle: 10000 //10 SEGUNDOS QUE NO VE NADA DE MOVIMIENTO PARA QUE LA CONEXION SE FINALICE
    },
    operatorsAliases: false 
});

export default db;

