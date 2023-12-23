const {User}=require('../../database')
const bcrypt = require('bcrypt');

const userUpdController = async (id, newData)=>{
    try {
        const user = await User.findByPk(id);
    
        if (!user) {
          return { error: "Usuario no encontrado" };
        }

        if(!newData.password){
          // const hashedPassword = await bcrypt.hash(newData.password, 10);
          // Convertir campos a sus tipos respectivos antes de actualizar
          const parsedData = {
            //password:hashedPassword,
            given_name: newData.given_name,
            picture: newData.picture,
            nickname: newData.nickname,
            role: parseFloat(newData.role), //convertir a numero
            country: newData.country,
            enable: Boolean(newData.enable), // Convertir a booleano
          };
      
          // Validar que el campo numérico sea válido después de la conversión
          // if (
          //   isNaN(parsedData.role)
           
          // ) {
          //   return { error: "El campo numérico no es válido" };
          // }
      
          // Actualizar todos los campos
          await user.update(parsedData);
        } else {
          const hashedPassword = await bcrypt.hash(newData.password, 10);
          const parsedData = {
            password:hashedPassword,
          };
          await user.update(parsedData);
        }
        return user;
      } catch (error) {
        console.error("Error al actualizar el usuario:", error);
        return { error: "Error interno del servidor" };
      }
}

const userSUpdController = async (id, newData)=>{
  try {
      const user = await User.findByPk(id);
  
      if (!user) {
        return { error: "Usuario no encontrado" };
      }

      if(newData){
        const hashedPassword = await bcrypt.hash(newData.password, 10);
        // Convertir campos a sus tipos respectivos antes de actualizar
        const parsedData = {
          password:hashedPassword,
          given_name: newData.given_name,
          picture: newData.picture,
          nickname: newData.nickname,
          role: parseFloat(newData.role), //convertir a numero
          country: newData.country,
          enable: Boolean(newData.enable), // Convertir a booleano
          deleteAt: Boolean(newData.deleteAt),// Convertir a booleano
        };
    
        // Validar que el campo numérico sea válido después de la conversión
        // if (
        //   isNaN(parsedData.role)
         
        // ) {
        //   return { error: "El campo numérico no es válido" };
        // }
    
        // Actualizar todos los campos
        await user.update(parsedData);
      // } else {
      //   const hashedPassword = await bcrypt.hash(newData.password, 10);
      //   const parsedData = {
      //     password:hashedPassword,
      //   };
      //   await user.update(parsedData);
      }
      return user;
    } catch (error) {
      console.error("Error al actualizar el usuario:", error);
      return { error: "Error interno del servidor" };
    }
}


module.exports = {userUpdController, userSUpdController};