
## Sobre JWT (json web token) 
[Documentación sobre JWT](https://jwt.io/introduction)

[Volver al README:](../README.md)


Vamos a intentar documentar brevemente lo que se implementó en cuanto a JWT en nuestra api, para esto se utilizó de JWT las funciones `sign` y `verify` utilizando tambien un string o cadena secreta. 
### Comenzemos con la cadena secreta: 

[Volver a README (click aqui)](../README.md#inicializando-el-server)

Es un string aleatorio que conformamos de la siguiente manera: 
```javascript
const crypto = require('crypto');

const generateSecret = () => {
  return crypto.randomBytes(32).toString('hex');
};

const secret = generateSecret();
console.log(`La cadena secreta generada es: ${secret}`);
```
Estas líneas de código (pedidas oportunamente a Chat GPT) son una pequeña función que dejamos comentada debajo de la función `generate.js`. Al descomentarla teniendo la consola con nodemon activo automaticamente se genera la clave secreta que con "copiar" "pegar" guardo en mi archivo .env con el nombre "SECRET_KEY" en este caso. 
Aquí una breve explicación de como funciona:

_El código que has proporcionado utiliza el módulo "crypto"  que proporciona funcionalidades criptográficas en Node.js para generar una cadena secreta aleatoria. Aquí está el desglose del código:_

```javascript
// Importa el módulo crypto
const crypto = require('crypto');

// Define la función generateSecret
const generateSecret = () => {
  // Utiliza crypto.randomBytes para generar 32 bytes de datos aleatorios
  const secretBytes = crypto.randomBytes(32);

  // Convierte los bytes en una cadena hexadecimal
  const secretHex = secretBytes.toString('hex');

  // Devuelve la cadena secreta generada
  return secretHex;
};

// Llama a la función generateSecret para obtener una cadena secreta
const secret = generateSecret();

// Imprime la cadena secreta en la consola
console.log(`La cadena secreta generada es: ${secret}`);

```

_Utiliza crypto.randomBytes(32) para generar 32 bytes de datos aleatorios. crypto.randomBytes es una función que proporciona una manera segura de generar bytes aleatorios._
_Convierte los bytes generados en el paso anterior en una cadena hexadecimal. Esto se hace llamando a toString('hex') en el objeto Buffer que representa los bytes._
_Luego, al llamar a la funcion generateSecret se imprime la cadena secreta en la consola. La cadena secreta es una cadena hexadecimal que representa datos aleatorios y puede utilizarse, por ejemplo, como una clave secreta para aplicaciones que requieran algún tipo de autenticación o cifrado._ (Gentileza de ChatGPT).

### JWT (Json Web Token)
Ahora, despues de instalar "jsonwebtoken" hacemos los middlewares, el primero utilizando la función "sign" de jwt es el "generate.js"

```javascript
const { sign } = require('jsonwebtoken');
require('dotenv').config();
const { SECRET_KEY } = process.env;

const generateToken = (user) => {
  const secretKey = SECRET_KEY;
  
  const token = sign({ userId: user.id, email: user.email }, secretKey, { expiresIn: '1m' });
  
  return token;
};

module.exports = generateToken;
```
Aqui tenemos un desglose de la función:

```javascript
const { sign } = require('jsonwebtoken');
require('dotenv').config();
const { SECRET_KEY } = process.env;

const generateToken = (user) => {
  // Obtiene la clave secreta desde la variable de entorno
  const secretKey = SECRET_KEY;

  //*) Crea un token JWT (JSON Web Token) utilizando la función `sign` de la biblioteca jsonwebtoken
  const token = sign({ userId: user.id, email: user.email }, secretKey, { expiresIn: '1h' });

  //Devuelve el token generado
  return token;
};

// Exporta la función para que pueda ser utilizada en otros archivos
module.exports = generateToken;

```
_La función toma como parámetro el objeto "user". Se espera que este objeto tenga propiedades como id y email, que se utilizarán para incluir en el payload del token._

_La opción 'expiresIn' indica el tiempo de expiración del token. Actualmente, estás configurando el tiempo de expiración en '1h', que significa una hora. Para configurar el token para que dure un minuto, simplemente cambia '1h' a '1m' para indicar un minuto._

_Tambien en jsonwebtoken, el tiempo de expiración (expiresIn) puede especificarse en segundos. Si deseas configurar el token para que dure, por ejemplo, 30 segundos, puedes hacerlo así:_
```javascript
const generateToken = (user) => {
  const secretKey = SECRET_KEY;

  // Cambiado el tiempo de expiración a 30 segundos
  const token = sign({ userId: user.id, email: user.email }, secretKey, { expiresIn: 30 });
  
  return token;
};
```
_En este ejemplo, el token expirará después de 30 segundos. Puedes ajustar ese valor según tus necesidades específicas. La opción expiresIn puede ser un número entero (que representa segundos) o una cadena en formato de duración, como '1m' para un minuto, '1h' para una hora o '2d' para dos días._
<hr>

### Función "verifyToken":
Esta funcion la utilizamos para verificar la validez del token que enviamos y en base a eso proteger las rutas.
Aqui un pequeño desglose de la misma:

```javascript
const { verify } = require('jsonwebtoken');
require('dotenv').config();
const { SECRET_KEY } = process.env;

const verifyToken = (req, res, next) => {
  // Obtiene el token del encabezado de la solicitud
  const token = req.headers['x-access-token'] || req.headers.authorization || req.headers.MiCabecera;

  // Verifica si el token está presente
  if (!token) {
    return res.status(401).json({ error: 'Acceso no autorizado. Token no proporcionado.' });
  }

  // Verifica el token
  verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ error: 'Token expirado.' });
      }
      return res.status(401).json({ error: 'Token inválido.' });
    }
    // Almacena el usuario decodificado en el objeto de solicitud para su uso posterior
    req.user = decoded;
     // Extrae el ID del usuario y lo almacena en req.user.id
     const userId = decoded.id;
     req.user.id = userId;
    next();
  });
};
```
_Declara una función llamada verifyToken que toma los objetos req (solicitud), res (respuesta) y next (siguiente middleware) como parámetros. Esta función se utiliza como middleware para verificar la autenticación basada en token._
_Obtiene el token de la solicitud. Puede estar presente en el encabezado como 'x-access-token' o 'authorization', o incluso en un encabezado personalizado llamado 'MiCabecera'._
_Verifica si el token está presente. Si no lo está, devuelve una respuesta de error indicando que el acceso no está autorizado y que el token no se proporcionó._
_Utiliza la función verify para verificar el token utilizando la clave secreta. Si hay un error durante la verificación, maneja los casos donde el token ha expirado o es inválido, devolviendo respuestas de error adecuadas._
_Si la verificación es exitosa, decodifica el token y almacena la información del usuario decodificado en req.user para su uso posterior._
_Para el caso en el que sea necesario, extrae el id del usuario y lo almacena en req.user.id para su posterior uso._
_Llama a next() para pasar al siguiente middleware en la cadena de manejo de solicitudes._

[Volver a Middlewares (click aquí)](infoMiddle.md#verifytoken)
 <hr>


 ### Implementación del verifyToken:

 ```javascript
 const {Router}=require('express');
const {charUsers,charUserById}= require('../handlers/userHandler');
const verifyToken =require('../helpers/verifyToken')
const charRouter =Router();
//---------------------------------------
charRouter.get('/character', charUsers );

charRouter.get('/character/:id', verifyToken, charUserById);

module.exports=charRouter;
 ```
 Este es el caso de una app de rickandmorty que usamos como modelo experimental, ya que tiene muy pocas funcionalidades y nos permite probar aisladamente las funciones, como ven se interpone simplemente en la ruta a proteger. 
 
[Volver a Middlewares (click aquí)](infoMiddle.md#su-implementación)



 [Volver al README:](../README.md)