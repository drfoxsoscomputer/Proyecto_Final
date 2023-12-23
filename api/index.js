//?   dP""b8    db    8b    d8 888888 Yb        dP  dP"Yb  88""Yb 88     8888b.
//?  dP   `"   dPYb   88b  d88 88__    Yb  db  dP  dP   Yb 88__dP 88      8I  Yb
//?  Yb  "88  dP__Yb  88YbdP88 88""     YbdPYbdP   Yb   dP 88"Yb  88  .o  8I  dY
//?   YboodP dP""""Yb 88 YY 88 888888    YP  YP     YbodP  88  Yb 88ood8 8888Y"

//todo   .d  dP"Yb     dP   .d   .d    dP oP"Yb.  dP"Yb  oP"Yb. 88888
//todo .d88 dP   Yb   dP  .d88 .d88   dP  "' dP' dP   Yb "' dP'   .dP
//todo   88 Yb   dP  dP     88   88  dP     dP'  Yb   dP   dP'  o `Yb
//todo   88  YbodP  dP      88   88 dP    .d8888  YbodP  .d8888 YbodP
//-----------------------------------------------------------------------------------------

const server = require("./src/server");
const { sequelize } = require("./src/database");
const fillTables = require("./src/Controllers/VideoGames/databaseControllers/fillTables");
const {appUserTable} = require('./src/utils/createSUs');
require("dotenv").config();
const { PORT } = process.env;


server.listen(PORT, async () => {
  try {
    await sequelize.sync({ force:false});
    await fillTables();
    await appUserTable();
    console.log(`Server is running on port ${PORT} ✔️`);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }

});
