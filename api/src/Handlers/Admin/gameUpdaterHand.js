const {
  updateVideogame,
  updateGenre,
  updatePLatform } = require("../../Controllers/VideoGames/AdminControllers/gameUpdController");

const gameUpdaterHand = async (req, res) => {
  const { id } = req.params;
  const newData = req.body;
  try {
    const response = await updateVideogame(id, newData);
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const genreUpdaterHand = async (req, res) => {
  const { id } = req.params;
  const {name} = req.body;
  try {
    const response = await updateGenre(id, name);
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const platformUpdaterHand = async (req, res) => {
  const { id } = req.params;
  const {name} = req.body;
  try {
    const response = await updatePLatform(id, name);
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  gameUpdaterHand,
  genreUpdaterHand,
  platformUpdaterHand
};
  
