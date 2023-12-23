const { where } = require("sequelize");
const { Genre, Platform, Videogame } = require("../../../database");
const {datamaped} = require("../../../utils/dataMaped");

// const getAllGames = async () => {
//   try {
//     const allGames = await Videogame.findAll({
//       where: { enable: true },
//       include: [
//         {
//           model: Genre,
//           attributes: ["name"],
//           through: { attributes: [] },
//         },
//         {
//           model: Platform,
//           attributes: ["name"],
//           through: { attributes: [] },
//         },
//       ],
//     });
//     // Transformar los datos antes de devolverlos
//     const transformedGames = allGames.map((game) => datamaped(game));

//     return transformedGames;
//   } catch (error) {
//     throw new Error({ error: error.message });
//   }
// };

const getAllGamesAdminController = async (
  page,
  size,
  filters,
  platformsFilters,
  genresFilters,
  orderFilter,
  req,
  res
) => {
  page = +page;
  size = +size;

  try {
    const videogames = await Videogame.findAll({attributes: ["name"], where: {deleteAt: false}});
    const nombres = videogames?.map(videogame => videogame.get({ plain: true })).map(vg=>vg.name);
    console.log(nombres);

    const { count, rows } = await Videogame.findAndCountAll({
      where: filters,
      order: orderFilter,
      include: [
        {
          model: Genre,
          attributes: ["name"],
          where: { 
            ...genresFilters,
            deleteAt: false, // Agrega la condición deleteAt: false para Genre
          },
          //where: genresFilters,
          /*where: {
                        //name: ["Actions", "Puzzle", "Indie"]
                        name: { [Op.in]: ["Actions", "Puzzle", "Indie"] }
                    },*/
          through: {
            attributes: [],
          },
        },
        {
          model: Platform,
          attributes: ["name"],
          where: { 
            ...platformsFilters,
            deleteAt: false, // Agrega la condición deleteAt: false para Platform
          },
          //where: platformsFilters,
          through: {
            attributes: [],
          },
        },
      ],
      limit: size,
      offset: page * size,
      distinct: true,
    });

    let videogamesData = [];
    if (count) {
      videogamesData = rows.map((game) => {
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
        /*return {
                    ...game.get(),
                    genresText: game.Genres.map((auxGenre) => {
                        return auxGenre.name;
                    }).join(", "),
                    platformsText: game.Platforms.map((auxPlatf) => {
                        return auxPlatf.name;
                    }).join(", "),
                    Genres: game.Genres.map((auxGenre) => {
                        return auxGenre.name;
                    }),
                    Platforms: game.Platforms.map((auxGenre) => {
                        return auxGenre.name;
                    })
                };*/
      });
    }
    
    const auxTotalPages = Math.ceil(count / size);
    const auxPrevPage = page - 1 >= 0 ? page - 1 : -1;
    const auxNextPage = page + 1 <= auxTotalPages ? page + 1 : -1;
    const auxHasPrevPage = page - 1 >= 0 ? true : false;
    const auxHasNextPage = page + 1 < auxTotalPages ? true : false;

    return {
      videogames: videogamesData,
      nombres,
      PaginationData: {
        totalItems: count,
        limit: size,
        totalPages: auxTotalPages,
        currentPage: page,
        hasPrevPage: auxHasPrevPage,
        hasNextPage: auxHasNextPage,
        prevPage: auxPrevPage,
        nextPage: auxNextPage,
      },
    };
  } catch (error) {
    res.status(500).send("getVideogames not found");
  }
}

const genres = async (req, res) => {
  const genresDb = await Genre.findAll({where: {deleteAt: false}, order: [['name', 'ASC']]});
  return genresDb;
};

const platforms = async (req, res) => {
  const platformsDb = await Platform.findAll({where: {deleteAt: false}, order: [['name', 'ASC']]});
  return platformsDb;
};

module.exports = {
  getAllGamesAdminController,
  genres,
  platforms,
};
