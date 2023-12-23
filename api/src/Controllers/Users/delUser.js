const { User } = require('../../database');

const delUser = async (id) => {
  try {
    //Verificar si el usuario existe y si está en true
    const user = await User.findByPk(id);
    if (user && !user.deleteAt) {
      // Actualizar el campo 'deleteAt' a true (borrar)
      await user.update({ deleteAt: true });
      return { message: "Usuario borrado exitosamente." };
    } else if (user && user.deleteAt) {
      // Si ya está borrado, devolver un mensaje indicando eso
      return { message: "El usuario ya está borrado." };
    } else {
      // Si el usuario no existe, devolver un mensaje indicando eso
      return { message: "Usuario no encontrado." };
    }
  } catch (error) {
    throw new Error("Error al borrar el usuario.");
  }
};

module.exports = delUser;
