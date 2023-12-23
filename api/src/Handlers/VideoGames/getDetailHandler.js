const getGameById = require('../../Controllers/VideoGames/gameDetailController')
const getRatedByItemIdController = require("../../Controllers/Payments/getRatedByItemIdController");


const getDetailHandler = async (req, res) => {
    const { id } = req.params;
    try {
      const response = await getGameById(id);
      const ratedItem = await getRatedByItemIdController(id);

      response.rated = ratedItem;

      res.status(200).json(response);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  };
  module.exports = getDetailHandler;