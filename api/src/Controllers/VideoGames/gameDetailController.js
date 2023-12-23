const { Genre, Platform, Videogame } = require("../../database");
const {datamaped} = require("../../utils/dataMaped");

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
  
      if (!infodb|| infodb.deleteAt === true) {
        throw new Error("Videogame not found");
      }
  
      const infoWash = datamaped(infodb);
      return infoWash;
    } catch (error) {
      throw new Error({ error: error.message });
    }
  };
  

  module.exports=getGameById;