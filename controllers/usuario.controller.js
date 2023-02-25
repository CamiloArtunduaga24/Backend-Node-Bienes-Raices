import { check, validationResult } from 'express-validator'
import bcrypt from 'bcrypt'
import  Usuario  from "../models/usuario.js";
import { generarId, generarJwt } from '../helpers/tokens.js';
import { emailRegistro, emailOlvidePassword} from '../helpers/emails.js';



const autenticar = async (req, res) => {

    await check('email').isEmail().withMessage('El e-mail es obligatorio').run(req);
    await check('password').notEmpty().withMessage('El password es obligatorio').run(req);

    let resultado = validationResult(req)

    

    if(!resultado.isEmpty()) {
    
        return res.render('auth/login', {
            pagina: 'Iniciar Sesión',
            csrfToken: req.csrfToken(),
            errores: resultado.array(),
        })
    }

    //Comprobar si el usuario existe
    const { email, password } = req.body;

    const usuario = await Usuario.findOne({ where: {email} })
    if( !usuario ) {
        return res.render('auth/login', {
            pagina: 'Iniciar Sesión',
            csrfToken: req.csrfToken(),
            errores: [{msg: 'El usuario no existe'}]
        })
    }

    //comprobar si el usuario esta confirmado
    if(!usuario.confirmado) {
        console.log('aqui va el confirmado',usuario.confirmado);
        return res.render('auth/login', {
            pagina: 'Iniciar Sesión',
            csrfToken: req.csrfToken(),
            errores: [{msg: 'Tu cuenta no ha sido confirmada'}]
        })
    }

    //Revisar el password
    if( !usuario.verificarPassword(password) ) {
        return res.render('auth/login', {
            pagina: 'Iniciar Sesión',
            csrfToken: req.csrfToken(),
            errores: [{msg: 'Las credenciales no son correctas'}]
        })
    }

    //Autenticar al usuario JWT

    const jsonWebToken = generarJwt({id: usuario.id, nombre: usuario.nombre})

    console.log(jsonWebToken);

    //Almacenar en un cookie
    return res.cookie('_token', jsonWebToken, {
        httpOnly: true,
        //secure: true
    }).redirect('/mis-propiedades')


}

const formularioLogin = (req, res) => {
    res.render('auth/login', {
        pagina: 'Iniciar Sesión',
        csrfToken: req.csrfToken()
    })
}

const formularioRegistro = (req, res) => {

    console.log()

    res.render('auth/registro', {
        pagina: 'Crear Cuenta',
        csrfToken: req.csrfToken()
    })
}

const registrar = async (req, res) => {

    //Validacion
    await check('nombre').notEmpty().withMessage('El nombre no puede ir vacio').run(req)
    await check('email').isEmail().withMessage('Eso no parece un e-mail').run(req)
    await check('password').isLength({ min: 6 }).withMessage('El password debe ser al menos de 6 caracteres').run(req)
    await check('repetir_password').equals(req.body.password).withMessage('Los passwords no son iguales').run(req)

    let resultado = validationResult(req)

    //Verificar resultado vacio

    if(!resultado.isEmpty()) {
        //Errores
        return res.render('auth/registro', {
            pagina: 'Crear Cuenta',
            csrfToken: req.csrfToken(),
            errores: resultado.array(),
            usuario: {
                nombre: req.body.nombre,
                email: req.body.email

            }
        })
    }

    //Extraer los datos
    const { nombre, email, password } = req.body

    //Verificar usuario no duplicado
    const existeUsuario = await Usuario.findOne({ where: {email} })

    if(existeUsuario) {
        return res.render('auth/registro', {
            pagina: 'Crear Cuenta',
            csrfToken: req.csrfToken(),
            errores: [{msg: 'El usuario ya esta registrado'}],
            usuario: {
                nombre: req.body.nombre,
                email: req.body.email

            }
        })
    }
    
    //Almacenar un usuario
    const usuario = await Usuario.create({
        nombre,
        email,
        password,
        token:generarId()
    })

    //Envia email de confirmacion

    emailRegistro({
        nombre : usuario.nombre,
        email: usuario.email,
        token: usuario.token
    })

    //Mostrar Mensaje de confirmacion

    res.render('template/mensaje', {
        pagina: 'Cuenta creada correctamente',
        mensaje: 'Hemos enviado un e-mail de confirmación, presiona en el enlace'
    })

}

//Funcion que comprueba una cuenta

const confirmar = async (req, res) => {

    const { token } = req.params

    //Verificar si el token es valido
    const usuario = await Usuario.findOne({ where: {token} })

    console.log(usuario);

    if(!usuario) {
        return res.render('auth/confirmar-cuenta', {
            pagina: 'Error al confirmar tu cuenta',
            mensaje: 'Hubo un error al confirmar tu cuenta, Intenta de nuevo',
            error: true
        })
    }


    //Confirmar la cuenta
    usuario.token = null;
    usuario.confirmado = true;
    await usuario.save();

    res.render('auth/confirmar-cuenta', {
        pagina: 'Cuenta confirmada',
        mensaje: 'La cuenta de confirmo correctamente'
    });
}

const formularioOlvidePassword = (req, res) => {
    res.render('auth/olvide-pass', {
        pagina: 'Recupera Acceso a Bienes Raices',
        csrfToken: req.csrfToken()
    })
}

const resetPaswword = async (req, res) => {

      //Validacion
      await check('email').isEmail().withMessage('Eso no parece un e-mail').run(req)
      
  
      let resultado = validationResult(req)

      //Verificar resultado vacio
  
      if(!resultado.isEmpty()) {
          //Errores
          return res.render('auth/olvide-pass', {
            pagina: 'Recupera Acceso a Bienes Raices',
            csrfToken: req.csrfToken(),
            errores: resultado.array()
          })
      }

      //Buscar el usuario

      const { email } = req.body

      const usuario = await Usuario.findOne({ where: {email} })

      console.log(usuario);

      if( !usuario ) {
        return res.render('auth/olvide-pass', {
            pagina: 'Recupera Acceso a Bienes Raices',
            csrfToken: req.csrfToken(),
            errores: [{msg: 'El e-mail no pertenece a ningún usuario'}]
          })
      }

      //Generar token y enviar email
      usuario.token = generarId();
      await usuario.save();

      //Enviar un email
      emailOlvidePassword({
        email: usuario.email,
        nombre: usuario.nombre,
        token: usuario.token
      })


      //Renderizar mensaje
      res.render('template/mensaje', {
        pagina: 'Reestablece tu password',
        mensaje: 'Hemos enviado un e-mail con las instrucciones'
    })

}

const comprobarToken = async (req, res) => {
    const { token } = req.params;

    const usuario = await Usuario.findOne({ where: {token} })

    if( !usuario ) {
        return res.render('auth/confirmar-cuenta', {
            pagina: 'Reestablece tu password',
            mensaje: 'Hubo un error al validar tu información, Intenta de nuevo',
            error: true
        })
    }

    //Mostrar Formulario para modificar el password
    res.render('auth/reset-password', {
        pagina: 'Reestablece tu password',
        csrfToken: req.csrfToken()
    })
}

const nuevoPassword = async (req, res) => {
    //Validar el password
    await check('password').isLength({ min: 6 }).withMessage('El password debe ser al menos de 6 caracteres').run(req)

    let resultado = validationResult(req)

    //Verificar resultado vacio

    if(!resultado.isEmpty()) {
        //Errores
        return res.render('auth/reset-password', {
            pagina: 'Reestablece tu password',
            csrfToken: req.csrfToken(),
            errores: resultado.array(),
        })
    }

    const { token } = req.params;

    const { password } = req.body;


    //Identificar quien hace el cambio

    const usuario = await Usuario.findOne({ where: {token} })

    //Hashear el nuevo password
    const salt = await bcrypt.genSalt(10)
    usuario.password = await bcrypt.hash( password, salt );
    usuario.token = null;

    await usuario.save();

    res.render('auth/confirmar-cuenta', {
        pagina: 'Password reestablecido',
        mensaje: 'El password se guardó correctamente'
    })
}

export {
    autenticar,
    formularioLogin ,
    formularioRegistro,
    registrar,
    confirmar,
    formularioOlvidePassword,
    resetPaswword,
    comprobarToken,
    nuevoPassword
}