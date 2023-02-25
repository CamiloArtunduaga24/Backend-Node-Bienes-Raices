
import  jwt  from 'jsonwebtoken';

const generarJwt = datos => jwt.sign({ id: datos.id, nombre: datos.nombre }, process.env.JWT_SECRET, {expiresIn: '1d'})



const generarId = () => Date.now().toString(32) + Math.random().toString(32).substring(2);

export {
    generarJwt,
    generarId
}
