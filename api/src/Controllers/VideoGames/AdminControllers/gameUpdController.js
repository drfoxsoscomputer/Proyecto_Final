const { Videogame, Genre, Platform} = require("../../../database");

const updateVideogame = async (id, newData) => {
  try {
    const videogame = await Videogame.findByPk(id);

    if (!videogame) {
      return { error: "Videojuego no encontrado" };
    }

    //console.log("Nuevos datos (antes de la conversión):", newData);

    // Convertir campos a sus tipos respectivos antes de actualizar
    const parsedData = {
      name: newData.name,
      description: newData.description,
      image: newData.image,
      released: new Date(newData.released), // Convertir a fecha
      price: parseFloat(newData.price), // Convertir a número
      physicalGame: Boolean(newData.physicalGame), // Convertir a booleano
      stock: parseInt(newData.stock), // Convertir a entero
      enable: Boolean(newData.enable), // Convertir a booleano
    };

    // Validar que los campos numéricos sean válidos después de la conversión
    if (
      isNaN(parsedData.price) ||
      isNaN(parsedData.stock)
    ) {
      return { error: "Uno de los campos numéricos no es válido" };
    }

    // Actualizar todos los campos
    await videogame.update(parsedData);

    // Actualizar campos relacionados (platforms y genres)
    if (newData.platforms) {
      // Setea las plataformas directamente usando los IDs
      await videogame.setPlatforms(newData.platforms);
    }

    if (newData.genres) {
      // Setea los géneros directamente usando los IDs
      await videogame.setGenres(newData.genres);
    }

    //console.log(videogame);
    return videogame;
  } catch (error) {
    console.error("Error al actualizar el videojuego:", error);
    return { error: "Error interno del servidor" };
  }
};

const updateGenre = async (id, name) => {
  try {
    const genre = await Genre.findByPk(id);
    if (genre) {
      await genre.update({ name: name });
      return { message: "Genero actualizado exitosamente." };
    } 
    else {
      return { message: "Genero no encontrado." };
    }
  } catch (error) {
    return {error: error.message}
  }
};

const updatePLatform = async (id, name) => {
  try {
    const platform = await Platform.findByPk(id);
    if (platform) {
      await platform.update({ name: name });
      return { message: "Plataforma actualizada exitosamente." };
    } 
    else {
      return { message: "PLataforma no encontrada." };
    }
  } catch (error) {
    return {error: error.message}
  }
};

module.exports = {
  updateVideogame,
  updateGenre,
  updatePLatform
};
