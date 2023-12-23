const {
  getAllGamesAdminController,
  getGameById,
  genres,
  platforms,
} = require("../../Controllers/VideoGames/AdminControllers/gamesControllers");

// const getGamesHandler = async (req, res) => {
//   try {
//     const response = await getAllGames();
//     res.status(200).json(response);
//   } catch (error) {
//     res.status(404).json({ error: error.message });
//   }
// };

const getGamesAdminHandler = async (req, res) => {
  const {
    page = 0,
    size = 5,
    platforms,
    genres,
    minPrice,
    maxPrice,
    //onlyPrice,
    order,
    name,
  } = req.query;

  console.log("order: " + order);

  let filters = {deleteAt: false};
  let platformsFilters = {};
  let genresFilters = {};
  let orderFilter = [];

  //Verificar si se solicita algun ordenamiento
  if(order && order !== "none") {
    const auxArray = order.split("_");
    console.log("auxArray: " + auxArray)
    switch(auxArray[1]){
      case "N":
        orderFilter.push(["name", auxArray[0]]); 
        break;
      case "P":
        orderFilter.push(["price", auxArray[0]]);
        break;
    }
  }

  // Verifica si se proporciona el parámetro de filtro 'platform'
  if (platforms) {
    const arrayPlatforms = platforms.split(",");
    platformsFilters.name = { [Op.in]: arrayPlatforms };
  }

  // Verifica si se proporciona el parámetro de filtro 'genre'
  if (genres) {
    const arrayGenres = genres.split(",");
    genresFilters.name = { [Op.in]: arrayGenres };
  }

  // Verifica si se proporciona el parámetro de filtro 'precio'
  if (minPrice && maxPrice) {
    filters.price = { [Op.between]: [+minPrice, +maxPrice] };
  } else if (minPrice) {
    filters.price = { [Op.gte]: +minPrice };
  } else if (maxPrice) {
    filters.price = { [Op.lte]: +maxPrice };
  }

  //Verificar si se esta buscando algun nombre en particular
  if (name) {
    filters.name = { [Op.iLike]: `%${name}%` };
  }

  try {
    const videogamesData = await getAllGamesAdminController(
      page,
      size,
      filters,
      platformsFilters,
      genresFilters,
      orderFilter
    );
    res.status(201).json(videogamesData);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

const getGenresHandler = async (req, res) => {
  try {
    const response = await genres();
    if (response.length === 0) {
      res.status(404).json({ error: "No genres found" });
    } else {
      res.status(200).json(response);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getPlatformHandler = async (req, res) => {
  try {
    const response = await platforms();
    if (response.length === 0) {
      res.status(404).json({ error: "No platforms found" });
    } else {
      res.status(200).json(response);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getGamesAdminHandler,
  getGenresHandler,
  getPlatformHandler,
};
