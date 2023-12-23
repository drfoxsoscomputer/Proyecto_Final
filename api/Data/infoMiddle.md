# Acerca de los Middlewares en esta app:

[Volver al README:](../README.md)

La razón en crearlos fue proteger las rutas específicas de la app en las que no queremos que se acceda a menos que sepamos que es una persona autorizada (usuario o admin) y quien es ese usuario, es decir, muchas veces no solo los utilizaríamos como interceptores sino como tambien para obtener el id, o el email si fuere necesario.

Otra razón muy poderosa al ser entusiastas en ensuciar las rutas con estos interceptores es proteger a toda costa a nuestra base de datos, no solo a través de las validaciones en los handlers y en los controllers, sino también, dentro de lo posible no permitir que lleguen a los handlers peticiones que no cumplan con lo esperado, es decir, faltantes de información, o información alterada. 

También un una ocasión (el manejo de los passwords) se los hasheó en el mismo middleware que verificaba si estos existían, simplificando así la lógica del controller.

## Función verifyToken

Este es el primer middleware que creamos e implementamos y su función es verificar que el token exista, sea válido y no haya expirado

[VerifyToken (click aquí)](../Data/infoToken.md#función-verifytoken)

<hr>

### Su implementación:
Aquí veremos un pequeño ejemplo de su implementación:

[Implementación del verifyToken (click aquí)](../Data/infoToken.md#implementación-del-verifytoken)
 <hr>

## Función verifyUsPas:

Esta función está en una ruta de actualizacion y verifica que si los ids provistos pertenecen a "email1" o "email2" puedan realizar cualquier accion de actualizacion excepto actualizar el password. Utiliza para ellos las funciones "getEmails" y "getUserIdByEmail".

```javascript
const { getEmails, getUserIdByEmail}= require('./createSUs')
require ('dotenv').config();


const verifyUsPas = async (req, res, next) => {
// Aquí destructura el objeto de getEmails y obtiene dos emails
  const {email1, email2}=getEmails();
  try {
    const adminEmails = [email1, email2];
    //obtiene la información que viene por parametro y por body
    const id = req.params.id;
    const { password } = req.body;
// Por medio de "for of" ejecuta las funciones concernientes a cada uno de los elementos de adminEmails.
    for (const adminEmail of adminEmails) {
    //Obtiene el id correspondiente al email utilizando "getUserIdByEmail"
      const user = await getUserIdByEmail(adminEmail);
      
      // Verifica si la petición corresponde al ID y contraseña del usuario, si esta petición contiene "password" o no existe alguna igualdad con los emails protegidos (intento de edicion de email) la deniega.
      if (id === user.id) {
        if (password || (adminEmail !== email1 && adminEmail !== email2)) { return res.status(403).json({ error: ' Acción no permitida.' });}
     //Si la petición no contiene "password" le da paso hacia la función siguiente:
      }
    }
   return next();
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
};

```
[Volver a Creacion super usuario (click aquí)](../Data/infoCreateSU.md#funcic3b3n-getuseridbyemail-1)
 <hr>

### Implementación de "*verifyUsPas"*:
Aquí tenemos el ejemplo de su implementación en la ruta de actualización de los usuarios: 

```javascript
const { Router } = require("express");
const putRouter = Router();
//Importacion de funciones:
const {userUpdaterHand,userSUpdaterHand} = require('../Handlers/Users/userUpdaterHand');
const {validUserSu,verifyUsPas} = require('../utils/validateUsers')

//======================================================================

putRouter.put('/user/:id', verifyToken, verifyUsPas, userUpdaterHand); //Modulo user

//Se quitaron otras rutas que no son relevantes para el ejemplo
module.exports = putRouter;
```
## Función *"validUserCreate"*:
Esta función verifica que la info contenga email, password o sub, al mismo tiempo hashea el password. La misma se utiliza en una ruta post, para ingresar el usuario.
```javascript
const validUserCreate = async(req, res, next)=>{
    const { email, password, sub } = req.body;

    //verifica que no falte un email.
    if (!email) { return res.status(400).json({ error: "missing email" });}

    //verifica que no falte un password o un sub
    if (!password && !sub) { return res.status(400).json({ error: "missing password or sub" });}

    //Si contiene un password lo encripta utilizando la función hash de la libreria bcrypt y luego reemplaza el password original por la versión encriptada.
    if (password) { const hashedPassword = await bcrypt.hash(password, 10); req.body.password = hashedPassword;}

    //si las condiciones se cumplen sin negativas da paso a la siguiente función:
    next();
};
```
#### Nota: 
Investigando, nos encontramos con la frase en inglés "Guard Clauses", que habla sobre las buenas prácticas de poner primero las condiciones en las cuales NO se debe ejecutar el codigo para luego pasar a la ejecución si todo va bien.
Aqui está el comentario de chat GPT:

[Ver Nota (click aquí)](./notas.md#sobre-guard-clauses)
<hr>

### Implementación de *"validUserCreate"*:

Aqui tenemos un ejemplo de su implementación:

```javascript
const { Router } = require("express");
const postRouter = Router();
//Importacion de funciones:
const {userLogHandler, loginUserHand} = require('../Handlers/Users/userLogHandler')
const verifyToken= require('../utils/verifyToken')
const {validUserCreate, validUserLog} = require("../utils/validateUsers")

//===============================================================================

postRouter.post("/user", validUserCreate, userLogHandler);
postRouter.post("/user/login", validUserLog, loginUserHand);

module.exports = postRouter;

```
<hr>

En estas instancias diriamos que sería oportuno terminar ya que si bien hay otros middlewares, están construidos sobre la misma lógica y entendiendo estos es muy sencillo comprender a los otros ya que su lógica se resume a una simple verificación. 


[Volver al README:](../README.md)
