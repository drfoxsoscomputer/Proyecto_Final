const { Videogame, Genre, Platform } = require("../../database");

const postVideogamesByIdsController = async (ids, req, res ) => {
    console.log("ids : " + JSON.stringify(ids));
    try {
      const result = await Videogame.findAll({
        where: {
            id: ids
            //id: ["394469b7-e82d-4445-a993-501b96819343", "456353c3-4b50-4f05-9e1d-b997383df32b", "ede9e455-9c8d-4186-98fb-1858893395fd", "a412f0dd-900c-4feb-b9ac-a6b691ede8ad"]
        },
        include: [
          {
            model: Genre,
            attributes: ["name"],
            through: {
              attributes: [],
            },
          },
          {
            model: Platform,
            attributes: ["name"],
            through: {
              attributes: [],
            },
          },
        ],
        distinct: true,
      });

      //return result;
  
      let videogamesData = [];
      if (result) {
        videogamesData = result.map((game) => {
          let auxGame = { ...game.get() }; //En el contexto de Sequelize, el método .get() se utiliza para obtener una representación simple del modelo, excluyendo las propiedades y métodos internos de Sequelize. Cuando se realiza una consulta con Sequelize, el resultado incluye instancias del modelo, y el método .get() se utiliza para obtener un objeto plano que representa los datos del modelo sin las propiedades y métodos internos de Sequelize.
  
          auxGame.Genres = game.Genres.map((auxGenre) => {
            return auxGenre.name;
          });
          auxGame.Platforms = game.Platforms.map((auxGenre) => {
            return auxGenre.name;
          });
  
          auxGame.genresText = auxGame.Genres.join(", ");
          auxGame.platformsText = auxGame.Platforms.join(", ");
  
          return auxGame;
        });
      }
      return videogamesData;

    } catch (error) {
      res.status(500).send("getVideogames not found");
    }
  };
  
  module.exports = postVideogamesByIdsController;