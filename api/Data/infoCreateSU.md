# Creación del Super Usuario.

[Volver al README:](../README.md)
<br>

## Como ingresar la información:

El camino más fácil cuando estamos desarrollando la app del server es introducir la info de los usuarios por medio de un archivo .json o en su defecto por _"Thunder Client"_, _"Insomnia"_, _"Postman"_ etc. Pero en cuanto a la app no es la mejor manera, ya que debemos evitar que en el codigo de la misma quede alojada información sensible, todo debe ser dinámico; por lo tanto, el único camino que vimos correcto es el de las variables de entorno.

En la variable de entorno se crearon tres (3) variables: USER, PASS e IMG, en la primera se almacenan los usuarios, la información debe ir sin comillas, sin espacios y separadas por comas, en la segunda los passwords, ingresados siguiendo el mismo criterio, y en la tercera una única url de la imagen que se utilizará como avatar para el usuario (esta imagen es por defecto, pero luego, en la app se puede actualizar libremente).
<hr>

![captura de archivo.env](./imgs/Captura%20env.png)

<hr>
Bien, ya tenemos la información guardada en una manera que nos permite cuando desplegamos la app (deploy) guardar toda información sensible en las variables de entorno que nos ofrecen los diferentes servicios de hosting. 

Ahora tenemos que extraer y utilizar esa información en nuestra app de servidor, sería muy útil implementar un sistema que: cuando se inicie el servidor, si la base de datos no contiene usuarios, cree primero estos usuarios por defecto, con email, contraseña, y la imagen por defecto establecidas.
Para esto debemos extraer la info del .env, separar los emails y los passwords y darles el uso debido. 

Para toda esta tarea creamos un archivo dentro de la carpeta "utils" llamado **`createSUs.js`** , dentro de ese archivo existen cinco (5) funciones, `usGenerate, userInits, appUserTable, getUserIdByEmail y getEmails`  si bien estas cinco funciones están relacionadas en cuanto a su implementación, las dos últimas se exportan de manera independiente. 

Es cierto que son muchas funciones para un solo módulo, más lo que quisimos hacer al ponerlas juntas es que toda la funcionalidad de la creación y protección del super usuario Admin 1 y Admin 2 estén centralizadas de manera que importando a esta función la tabla "User" y las librerías "bcrypt" y "dotenv" no necesitamos más que exportar las tres funciones que saldrán de allí, la función *"appUserTable"* que es la encargada de tomar las variable de entorno y tanto verificar como crear los dos usuarios en la base de datos (Tabla User); la función *"getUserIdByEmail"* que a fines de proteger a esos usuarios toma sus emails y me devuelve sus ids (ya que estos son dinámicos, es decir en cada reinicio de la base de datos, en especial en desarrollo, cambian) y también sus passwords hasheados, a fin de verificar, y la función *"getEmails"* la cual toma el elemento "USER" de la variable de entorno (el cual contiene al menos dos emails) y lo convierte en un objeto al que podemos destructurar.

<br>

## Flujo de la creación del Super Usuario:

La información que estaría ingresando en la tabla User es la siguiente: 
```javascript
    A:  email: email,
    B:  password: hashedPassword,
    C:  nickname: nickname,
    D:  given_name: null,
    E:  picture: IMG, 
    F:  sub: null,
    G:  role: 0,
    H:  enable: true,
    I:  deleteAt: false,

```
Los nombres y la disposición de esta info está formulada en armonía con la información que auth0 nos da al loguearse un usuario (utilizamos en la app tanto usuario y password como auth0).

A: El email proporcionado.

B: El password proporcionado ya encriptado en estas instancias.

C: El nickname o apodo está conformado en un principio por el email proporcionado hasta el @.

D: El given_name va a ser determinado por el usuario, aqui esta en null.

E: IMG es el nombre de la variable de entorno donde esta alojada la url de la imagen.

F: El sub es una identificación única alfanumerica proporcionada por auth0.

G: El rol en este caso es 0 para admin, 1 para usuario, 2 para moderador.

H: El enable: true significa que el usuario no está bloquedo.

I: El deleteAt: false declara que el usuario existe (borrado lógico).

Dicho esto vamos por las funciones: 
<hr>

## La funcionalidad:

Las importaciones para todo el modulo `createSUs.js` son las siguientes:

```javascript
const { User } = require('../database'); 
const bcrypt = require('bcrypt')
require ('dotenv').config();
```
### Función *"usGenerate"*.

La función *"usGenerate"*  verifica la existencia y la validez de las variables de entorno, las sincroniza y llama a *"userInits"* para insertar a los usuarios en la base de datos.

```javascript
const usGenerate = async () => {
  try {
    const { USER, PASS, IMG } = process.env;
    // Verifica si las variables de entorno USER y PASS están definidas
    if (!USER || !PASS) {
      console.error('Faltan las variables de entorno USER o PASS.');
      return;
    }
    // Separa los emails y contraseñas usando split(',')
    const emails = USER.split(',');
    const passwords = PASS.split(',');
    
    // Verifica si la cantidad de emails y contraseñas coincide
    if (emails.length !== passwords.length) {
      console.error('La cantidad de emails y contraseñas no coincide.');
      return;
    }
    //Itera y sincroniza cada email con su password
    for (let i = 0; i < emails.length; i++) {
      const email = emails[i];
      const password = passwords[i];
      
      // Obtiene el nickname a partir del email
      const nickname = email.split('@')[0];
      
      // Crea el usuario utilizando la función userInits
      const result = await userInits(email, password, nickname, IMG);
      
      if (result.isCreate) {
        console.log(`Usuario creado con éxito: ${result.user.email}`);
      } else {
        console.log(`Error al crear usuario: ${result.error.message}`);
      }
    }
  } catch (error) {
    console.error('Error en usGenerate:', error);
  }
};

```
### Función *"userInits"*

La función *"userInits"* recibe los parametros de *"usGenerate"* e inserta a los usuarios en la base de datos.

```javascript
const userInits = async (email, password, nickname, IMG) => {
// Toma el password recibido y lo encripta utilizando la función hash de bcrypt.
  const hashedPassword = await bcrypt.hash(password, 10);
  
  try {
    // Crea al usuario en la base de datos: 

    const newUser = await User.create({
      email: email,
      password: hashedPassword,
      nickname: nickname,
      given_name: null,
      picture: IMG, 
      sub: null,
      role: 0,
      enable: true,
      deleteAt: false,
    });
    
    const result = { isCreate: true, user: newUser };
    return result;
  } catch (error) {
    console.error('Error al crear usuario:', error);
    return { isCreate: false, error: error };
  }
};
```
### Función *"appUserTables"*:

La función *"appUserTables"* al inicializar el servidor verifica si existen usuarios, si no existen los crea llamando a usGenerate.
```javascript
const appUserTable =async ()=>{

// Verifica si existen usuarios en la base de datos:
      const existusers = await User.findAll();
      if (existusers.length ===0 ) {
// Invoca a la función "usGenerate" para llenar la tabla
          await usGenerate();
          console.log(`Users created!`);
        } else {
          console.log(`The users already exists!!.`);
        }
}
```

De todas estas funciones *`"appUserTables"`* es la única que se exporta, 
```javascript

module.exports = {
  appUserTable,
  getEmails,
  getUserIdByEmail
};

```
invocándose en el archivo *`index.js`* que es donde se inicializa la aplicación.

```javascript
const server = require("./src/server");
const { sequelize } = require("./src/database");
const {appUserTable} = require('./src/utils/createSUs');
require("dotenv").config();
const { PORT } = process.env;


server.listen(PORT, async () => {
  try {
    await sequelize.sync({ force:false});
    await appUserTable();
    console.log(`Server is running on port ${PORT} ✔️`);
  } catch (error) {res.status(500).json({ error: error.message });}
});
```
## Las funciones restantes:

### Función *"getUserIdByEmail"*:

La función *"getUserIdByEmail"* fue creada a partir de la necesidad de proteger a estos usuarios superadmin contra edición y borrado. La app del frontend cuenta con una sección de configuración adonde se puede establecer y/o cambiar la contraseña, y una sección de administrador con un panel que tiene un paginado de todos los usuarios, el cual permite bloquear o borrar a un usuario. Por supuesto, estos dos super usuarios deben en todo momento estar fuera del alcance del bloqueo, borrado o actualizacion de contraseña. 

La solución adoptada para esto fue:

1- Hacer invisible a los super usuarios en el panel de edición de usuarios del administrador.

Esto se logró por medio de condicionar en el controller la forma en que se piden los datos, que aparezcan solo los que deben aparecer, creamos asi la función *"getEmails"*.

2- En el panel de configuración de usuario permitir la configuración del nombre, apodo, e imagen pero nunca de la contraseña.

Esto lo llevamos a cabo por medio de un middleware que se explica en otra sección.

Para implementar ese middleware se necesita obtener el id del email en cuestión, ya que en una ruta de actualización se utiliza el id como parámetro, eso dio origen a la función *"getUserIdByEmail"*


[Ver funcionamiento del middleware (click aquí)](../Data/infoMiddle.md#función-verifyuspas)

### Función *"getUserIdByEmail"*:

Esta funcion utiliza el email suministrado para por medio de él tomar su Id y su password (el password esta vez no fue necesario, pero en el momento de desarrollar la función no sabiamos exactamente si lo ibamos a necesitar para alguna otra función).

```javascript
const getUserIdByEmail = async (email) => {
  try {
    const user = await User.findOne({
      where: {
        email: email
      },
      attributes: ['id', 'password']
    });
    return user;
  } catch (error) {
    console.error('Error en getUserIdByEmail:', error);
    throw error;
  }
};
```
### Función *"getEmail"*:

La funcion getEmails se utiliza para hacer de la variable de entorno "USER" un objeto con emails que se pueda destructurar.
Esta se utiliza en los lugares adonde se necesite los emails de los superusuarios.

```javascript
const getEmails = () => {
  const { USER } = process.env;
//Verifica si la variable de entorno USER esta definida.

  if (!USER) {
    console.error('La variable de entorno USER no está definida.');
    return {};
  }
// Separa los emails por medio de la función split a través de sus comas.
  const emails = USER.split(',');

// Crea un objeto con propiedades email1, email2, etc.
  const emailObject = {};
  emails.forEach((email, index) => {
    emailObject[`email${index + 1}`] = email.trim(); // trim para eliminar posibles espacios en blanco
  });

  return emailObject;
};
```
Esta función la utilizamos para que los emails de los super usuarios no aparezcan en la vista de usuarios del administrador: 

```javascript
const {User}=require('../../database');
const { Op } = require('sequelize');
const { getEmails}= require('../../utils/createSUs')

const getUser = async( page, size, req, res )=>{
    const {email1, email2}=getEmails();
    try {
        const { count, rows } = await User.findAndCountAll({
            where:{
                deleteAt:false,
                email: {
                    [Op.notIn]: [email1, email2] // Lista de correos electrónicos a excluir
                }
            },
        });
//     resto del codigo...(Se excluyeron líneas de codigo innecesarias para el ejemplo a fin de simplificar)
    }
}
```
En este caso el transformar los correos en un objeto nos hizo trabajar un poco más pero consultando con chat Gpt encontramos algunas ventajas:

**Facilidad de uso:**  *Al transformar los correos electrónicos en un objeto, se pueden acceder fácilmente a ellos utilizando las propiedades email1, email2, etc. Esto puede hacer que sea más claro y fácil entender qué correos electrónicos se están excluyendo.*

**Escalabilidad:**  *Si en el futuro necesitas manejar más correos electrónicos o realizar operaciones adicionales con ellos, tenerlos en un objeto puede facilitar la expansión del código.*

**Reutilización de código:**  *La función getEmails se puede reutilizar en otros lugares si necesitas obtener y transformar correos electrónicos de la misma manera.*

**Claridad del código:**  *Al utilizar un objeto con propiedades específicas, el código puede ser más legible y autodescriptivo en cuanto a la intención del desarrollador.*

Aqui terminamos esta breve explicación, esperamos que sirva al lector, ya sea del equipo de desarrollo o simplemente un buscador autodidacta de soluciones e ideas, lo que somos nosotros en este momento. Si resulta útil, el proposito de este readme estará más que cumplido. ¡¡Exitos!!

[Volver al README:](../README.md)