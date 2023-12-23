const getVideogames = require("../../Controllers/VideoGames/getVideogames");
const { Op } = require("sequelize");

const getVideogamesHandler = async (req, res) => {
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

  let filters = {enable: true, deleteAt: false};
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
    const videogamesData = await getVideogames(
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
};

module.exports = getVideogamesHandler;
