const bcrypt = require('bcrypt');
require('dotenv').config();
const {SUDO_AUTH } = process.env;
const { getEmails, getUserIdByEmail}= require('./createSUs')

//! Este es un modulo que contiene solo Middlewares.

//* Funcion validUserCreat: verifica que la info contenga email, password o sub, al mismo tiempo hashea el password.

const validUserCreate = async(req, res, next)=>{
    const { email, password, sub } = req.body;

    if (!email) {
        return res.status(400).json({ error: "missing email" });
    }
    if (!password && !sub) {
        return res.status(400).json({ error: "missing password or sub" });
    }
    if (password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        req.body.password = hashedPassword;
    }
    


    next();
};
 //* Funcion validUserLog: verifica que la informacion contenga tanto email como password.

const validUserLog = (req, res, next)=>{
    const { email, password } = req.body;
    if (!email) {return res.status(400).json({ error: "missing email" });}
    if (!password) {return res.status(400).json({ error: "missing password" });}
    next ();
};

//* Funcion validUserSu: verifica que se provea un token especifico y lo compara con el provisto por medio de una variable de entorno.

const validUserSu = (req, res, next)=>{
        const providedToken = req.headers['x-access-token'];
        // Verifica si el token está presente
        if (!providedToken) {return res.status(401).json({ error: 'Acceso no autorizado.' });}
        if (providedToken !== SUDO_AUTH) {return res.status(403).json({ error: 'Acceso no autorizado.' });}
        next();
    
};

//* Funcion verifyUsPas: Esta funcion está en una ruta de actualizacion y verifica que si los ids provistos pertenecen a "email1" o "email2" puedan realizar cualquier accion de actualizacion excepto actualizar el password. Utiliza para ellos las funciones "getEmails" y "getUserIdByEmail".

const verifyUsPas = async (req, res, next) => {
  const {email1, email2}=getEmails();
  try {
    const adminEmails = [email1, email2];
    const id = req.params.id;
    const { password } = req.body;
    for (const adminEmail of adminEmails) {
      const user = await getUserIdByEmail(adminEmail);
      if (id === user.id) {
        if (password || (adminEmail !== email1 && adminEmail !== email2)) { return res.status(403).json({ error: ' Acción no permitida.' });}
      }
    }
       return next();
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
};

const verifyDoNotDel = async (req, res, next) => {
  const {email1, email2}=getEmails();
  try {
    const adminEmails = [email1, email2];
    const id = req.params.id;
    for (const adminEmail of adminEmails) {
      const user = await getUserIdByEmail(adminEmail);
      if (id === user.id){return res.status(403).json({ error: ' Acción no permitida.' });}
        return next();
    }
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
};


module.exports= { 
    validUserCreate,
    validUserLog,
    validUserSu,
    verifyUsPas,
    verifyDoNotDel
    
}
