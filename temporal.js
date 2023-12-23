const getFilterVideoGamesHandler = async (req, res) => {
  const { platform, genre, minPrice, maxPrice } = req.query;
  try {
    const filtros = {};

    // Verifica si se proporciona el parámetro de filtro 'platform'
    if (platform) {
      const platform = Array.isArray(platform) ? platform : [platform];
      filtros.platform = { [Sequelize.Op.in]: platform };
    }

    // Verifica si se proporciona el parámetro de filtro 'genre'
    if (genre) {
      const genre = Array.isArray(genre) ? genre : [genre];
      filtros.genre = { [Sequelize.Op.in]: genre };
    }

    // Verifica si se proporciona el parámetro de filtro 'precioMin'
    if (minPrice) {
      filtros.price = { [Sequelize.Op.gte]: parseFloat(minPrice) };
    }

    // Verifica si se proporciona el parámetro de filtro 'precioMax'
    if (maxPrice) {
      if (!filtros.price) {
        filtros.price = {};
      }
      filtros.price[Sequelize.Op.lte] = parseFloat(maxPrice);
    }

    // Realiza la consulta con Sequelize y aplica los filtros
    const vgFiltrados = await getAllGames(filtros);

    // Usuario.findAll({
    //   where: filtros,
    // });

    vgFiltrados.length ? res.status(200).json(vgFiltrados) : res.status(400).send("Videogame not found");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error en el servidor");
  }
};

async (req, res) => {
  const { name } = req.query;
  try {
    const response = await getAllVideogames();
    if (!name) {
      res.status(200).json(response);
    } else {
      let vgName = response.filter((game) => {
        if (game.name.toUpperCase().includes(name.toUpperCase())) return game;
      });

      vgName.length ? res.status(200).json(vgName) : res.status(200).send("Videogame not found");
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
