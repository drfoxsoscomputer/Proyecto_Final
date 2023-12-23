const { User } = require('../database'); 
const bcrypt = require('bcrypt')
require ('dotenv').config();


//* Función usGenerate: verifica la existencia y validez de las variables de entorno, las sincroniza y llama a userInits para insertar los usuarios en la base de datos.
const usGenerate = async () => {
  try {
    const { USER, PASS, IMG } = process.env;
    if (!USER || !PASS) {
      console.error('Faltan las variables de entorno USER o PASS.');
      return;
    }
    const emails = USER.split(',');
    const passwords = PASS.split(',');

    if (emails.length !== passwords.length) {
      console.error('La cantidad de emails y contraseñas no coincide.');
      return;
    }

    for (let i = 0; i < emails.length; i++) {
      const email = emails[i];
      const password = passwords[i];

      const nickname = email.split('@')[0];
      
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

//* Funcion userInits: recibe los parametros de usGenerate y crea los usuarios en la base de datos.

const userInits = async (email, password, nickname, IMG) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  
  try {
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

//*Función appUserTable: Al inicializar la app verifica si existen usuarios, si no existen los crea llamando a usGenerate.

const appUserTable =async ()=>{
      const existusers = await User.findAll();
      if (existusers.length ===0 ) {
          // Hacer una lectura de la data.json para llenar la tabla
          await usGenerate();
          console.log(`Users created!`);
        } else {
          console.log(`The users already exists!!.`);
        }
}

//* Esta funcion utiliza el email suministrado para por medio de él tomar su Id y su password.
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

//? La funcion getEmails se utiliza para hacer de la variable de entorno "USER" un objeto con emails que se pueda destructurar.
//? Esta se utiliza en los lugares adonde se necesite los emails de los superusuarios.

const getEmails = () => {
  const { USER } = process.env;

  if (!USER) {
    console.error('La variable de entorno USER no está definida.');
    return {};
  }

  const emails = USER.split(',');

  // Crear un objeto con propiedades email1, email2, etc.
  const emailObject = {};
  emails.forEach((email, index) => {
    emailObject[`email${index + 1}`] = email.trim(); // trim para eliminar posibles espacios en blanco
  });

  return emailObject;
};




module.exports = {
  getEmails,
  getUserIdByEmail,
  appUserTable
};

