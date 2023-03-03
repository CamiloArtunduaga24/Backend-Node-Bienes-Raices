import  express  from 'express';
import { 
    inicio,
    categoria,
    notFound,
    buscador
   } from "../controllers/app.controller.js";

const router = express.Router();


//Pagina de Inicio
router.get('/', inicio)


//Pagina 404
router.get('/404', notFound)


//Categorias
router.get('/categorias/:id', categoria)



//Buscador
router.post('/buscador', buscador)


export default router;
