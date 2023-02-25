
import express from "express";
import { 
    autenticar,
    formularioLogin, 
    formularioRegistro, 
    registrar,
    confirmar,
    formularioOlvidePassword,
    resetPaswword,
    comprobarToken,
    nuevoPassword } from "../controllers/usuario.controller.js";

const router = express.Router();

router.get('/login', formularioLogin);
router.post('/login', autenticar);

router.get('/registro', formularioRegistro);

router.post('/registro', registrar);

router.get('/confirmar/:token', confirmar);

router.get('/olvide-pass', formularioOlvidePassword);

router.post('/olvide-pass', resetPaswword);

//Almacena el nuevo password
router.get('/olvide-pass/:token', comprobarToken);
router.post('/olvide-pass/:token', nuevoPassword);






export default router