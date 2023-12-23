# GameWorld Server
[Volver al inicio](../README.md)

Este servidor cuenta con la instalacion de las siguientes dependencias:  express, axios, dotenv, nodemon, morgan, sequelize, postgres, pg, pg-hstore, cors, uuid, jsonwebtoken, bcrypt.

Para inicializar en desarrollo el comando es: ```npm run dev```, esto inicializa con nodemon.
El comando ```npm start``` también va a inicializar pero con node, a cada cambio lo deberiamos reiniciar manualmente, pero a la hora de deployarlo es necesario que esté así..
 
## Inicializando el server:
Para inicilizar el servidor (luego de haber clonado el repo) es necesario estando en la carpeta raíz (api) correr el comando `npm install`, luego hay que crear un archivo .env para las variables de entorno, del cual las keys están en el archivo env.txt. es importante que las que no estén comentadas (con #) estén completas, ya que sin estas no será posible poner en funcionamiento el server.

Se recomienda cambiar la clave secreta provista luego de haber inicializado el servidor 

[Acerca de la clave secreta (click aqui)](../api/Data/infoToken.md#comenzemos-con-la-cadena-secreta)


## Información util:

Les dejamos una explicación básica de lo que hicimos en el back y en el front acerca de la autenticación con JWT y la implementacion de interceptor en el front:

[En el Back: ](./Data/infoToken.md)

[En el Front: ](./Data/infoTokenFront.md)
<br>

### Creación de usuario admin (llave de la app):

Resolvimos luego de muchos intentos y pruebas el asunto de crear de manera dinámica uno o dos (en este caso dos) usuarios con contraseña y una imagen por defecto para los dos, a fin de que sirva como llave maestra para el proyecto y por medio de estos asignar a los futuros usuarios creados de manera gráfica en la app, permisos y roles.

[Creacion de super usuario (click aquí)](./Data/infoCreateSU.md)

Tambien se implementaron diferentes middlewares a fin de evitar que la información llegue de manera incorrecta a los handlers, además es una manera de proteger a los Super Usuarios de la edición de sus contraseñas, algo que no queremos que suceda. 

[Creación de middlewares (click aquí)](./Data/infoMiddle.md)

Esta explicación está lejos de ser una completa (en este mismo momento, al escribirla, estamos aprendiendo a documentar una app, y mas bien parece un tutorial, pero nuestra intención al hacerla es que cada uno aprenda aquellas cosas en las cuales no pudo intervenir directamente.)

## ¡Exitos muchachos!

[Volver al inicio](../README.md)
