const { Op } = require("sequelize");
const { User } = require("../../database");
const generateToken = require("../../utils/generate");
const bcrypt = require("bcrypt");
const sendEmail = require("../../nodemailer/sendEmail");
const saltRounds = 10; // Número de rondas de salt para bcrypt

//? Funcion userLogin (para crear o validar a un usuario en base a auth0)

const userCreate = async (
  email,
  password,
  nickname,
  given_name,
  picture,
  sub,
  req,
  res
) => {
  try {
    // Busca el usuario por el email
    const existingUser = await User.findOne({
      where: {
        email: email,
        deleteAt: false,
       // enable: true,
      },
    });

    if (existingUser) {
      if (existingUser.sub === "" && sub) {
        throw new Error("Ya hay un usuario registrado con este email");
      } else if (existingUser && existingUser.enable===false) {
          throw new Error("Usuario bloqueado");
        }else if (existingUser.sub) {
        if (existingUser.sub === sub) {
          const token = generateToken(existingUser);
          let result = { isCreate: false, user: existingUser };
          return { result, token };
        } else {
          throw new Error("Los subs no coinciden");
        }
      }
    } else {
      try {
        // El usuario no existe, créalo
        const [newUser, create] = await User.findOrCreate({
          where: {
            email: email,
            deleteAt: false,
          },
          defaults: {
            email,
            password,
            nickname,
            given_name,
            picture,
            sub,
          },
        });

        const result = { isCreate: create, user: newUser };
        // Genera el token
        await sendEmail(newUser.email);
        const token = generateToken(newUser);
        // Agrega el token al body de la respuesta
        return { result, token };
      } catch (error) {
        throw new Error("Error al ingresar nuevo usuario (auth0)");
      }
    }
  } catch (error) {
    console.error("¡Hubo un error!", error);
    throw error;
  }
};
//? Funcion UserwithPass para registrar a un nuevo usuario en base a pasword y...
//? validar a un usuario en base a password
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
const userwithPass = async (
  email,
  password,
  nickname,
  given_name,
  picture,
  sub,
  req,
  res
) => {
  // Método para registrar un nuevo usuario
  try {
    // Buscar el usuario por email
    const user = await User.findOne({
      where: {
        email: email,
        deleteAt: false,
      },
    });

    if (!user) {
      try {
        // Crear el nuevo usuario en la base de datos con la contraseña hasheada
        const newUser = await User.create({
          email: email,
          password: password,
          nickname: "",
          given_name: "",
          picture:
            "https://res.cloudinary.com/dmhxl1rpc/image/upload/c_scale,w_250/v1701669223/gameworld/avatar_gamer.jpg",
          sub: "",
        });
        const result = { isCreate: true, user: newUser };
        await sendEmail(newUser.email);
        const token = generateToken(newUser);
        return { result, token };
      } catch (error) {
        throw new Error("Error al crear el usuario con pass");
      }
    } else if (user) {
      throw new Error("El usuario ya tiene cuenta");
    }
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    throw error;
  }
};
//=================================================================================================
const userWithPassLogin = async (email, password) => {
  const user = await User.findOne({
    where: {
      email: email,
      deleteAt: false,
      //enable: true,
    },
  });
// console.log(email);
// console.log(password);
// console.log(user);
  try {
    if (user && user.enable === false){
      throw new Error("Usuario bloqueado");
    }
    if (user) {
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (passwordMatch) {
        // Contraseña válida, puedes generar y enviar un token de sesión aquí si es necesario
        let result = { isCreate: false, user: user };
        // Genera el token
        const token = generateToken(user);
        return { result, token };
      } else {
        // Contraseña incorrecta
        throw new Error("Email o password no validos");
      }
    } else {
      throw new Error("Usuario no registrado");
    }
  } catch (error) {
    throw error;
  }
};
//?>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
const userUpdPass = async (
  email,
  password,
  nickname,
  given_name,
  picture,
  sub,
  req,
  res
) => {
  try {
    const user = await User.findOne({
      where: {
        email: email,
        deleteAt: false
      },
    });

    if (!user.password) {
      // El usuario no tiene una contraseña almacenada, crea una nueva
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      await user.update({ password: hashedPassword });
    } else {
      // Verificar si la nueva contraseña es diferente de la actual
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        // Actualizar solo el campo de la contraseña
        await user.update({ password: password });
      }
    }

    const token = generateToken(user);
    return { user: user, token };
  } catch (error) {
    console.error("Error al colocar el password:", error);
    return { error: "Error interno del servidor" };
  }
};
//*=============================================================================================
const userUpdSub = async (
  email,
  password,
  nickname,
  given_name,
  picture,
  sub,
  req,
  res
) => {
  try {
    const user = await User.findOne({
      where: {
        email: email,
        deleteAt: false
      },
    });

    if (user && !user.sub) {
      // Actualizar solo el campo del sub
      await user.update({ sub: sub });
    }
    const token = generateToken(user);
    return { user: user, token };
  } catch (error) {
    console.error("Error al colocar el sub:", error);
    return { error: "Error interno del servidor" };
  }
};

module.exports = {
  userCreate,
  userwithPass,
  userUpdPass,
  userUpdSub,
  userWithPassLogin,
};
