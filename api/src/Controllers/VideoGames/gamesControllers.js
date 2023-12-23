const { Genre, Platform, Videogame } = require("../../database");
const {datamaped} = require("../../utils/dataMaped");

const getAllGames = async () => {
  try {
    const allGames = await Videogame.findAll({
      where: {deleteAt : false},
      include: [
        {
          model: Genre,
          attributes: ["name"],
          through: { attributes: [] },
        },
        {
          model: Platform,
          attributes: ["name"],
          through: { attributes: [] },
        },
      ],
    });
    // Transformar los datos antes de devolverlos
    const transformedGames = allGames.map((game) => datamaped(game));

    return transformedGames;
  } catch (error) {
    throw new Error({ error: error.message });
  }
};

const getGameById = async (id) => {
  try {
    const infodb = await Videogame.findByPk(id, {
      include: [
        {
          model: Genre,
          attributes: ["name"],
          through: { attributes: [] },
        },
        {
          model: Platform,
          attributes: ["name"],
          through: { attributes: [] },
        },
      ],
    });

    if (!infodb || infodb.deleteAt === true) {
      throw new Error("Videogame not found");
    }

    const infoWash = datamaped(infodb);
    return infoWash;
  } catch (error) {
    throw new Error({ error: error.message });
  }
};

const genres = async (req, res) => {
  const genresDb = await Genre.findAll({
    where:{deleteAt : false
    }
  });
  
  return genresDb;
};

const platforms = async (req, res) => {
  const platformsDb = await Platform.findAll({
    where: {
      deleteAt:false
    }
  });
  
  return platformsDb;
};

module.exports = {
  getAllGames,
  getGameById,
  genres,
  platforms,
};
