const {
  createGameDB,
  createGenreDB,
  createPlatformDB} = require("../../Controllers/VideoGames/AdminControllers/gamesPostController");

const createGameHandler = async (req, res) => {
  const {
    name,
    description,
    image,
    released,
    genres,
    platforms,
    price,
    physicalGame,
    stock,
  } = req.body;
  console.log(req.body)
  if (!name) {
    return res
      .status(404)
      .json({ error: "A name is required to create a videogame" });
  }
  try {
    const response = await createGameDB(
      name,
      description,
      image,
      released,
      genres,
      platforms,
      price,
      physicalGame,
      stock
    );
    res.status(201).json(response);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const createGenreHandler = async (req, res) => {
  const { name } = req.body;
  try {
    const response = await createGenreDB(name);
    res.status(201).json(response);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const createPlatformHandler = async (req, res) => {
  const { name } = req.body;
  try {
    const response = await createPlatformDB(name);
    res.status(201).json(response);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  createGameHandler,
  createGenreHandler,
  createPlatformHandler

};
