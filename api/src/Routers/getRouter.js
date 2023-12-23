const { Router, request } = require("express");
const getRouter = Router();
//Importacion de funciones.
const {
  getGamesAdminHandler,
  getGenresHandler,
  getPlatformHandler,
} = require("../Handlers/Admin/gameshandlers");
const getUserHandler= require('../Handlers/Users/getUserHandler')
const getVideogamesHandler = require("../Handlers/VideoGames/getVideogamesHandler");
const getParchuseOrderHandler = require("../Handlers/Payments/getParchuseOrderHandler");
const getDetailHandler= require('../Handlers/VideoGames/getDetailHandler')
const verifyToken= require('../utils/verifyToken');
const {getUserDetailHand, getUserAllHand} = require("../Handlers/Users/detailUserHandler");
const getUserShoppingCartHandler = require("../Handlers/Users/getUserShoppingCartHandler");
const getOrdersByUserIdHandler = require("../Handlers/Payments/getOrdersByUserIdHandler");
const getRatedPendingItemsByUserIdHandler = require("../Handlers/Payments/getRatedPendingItemsByUserIdHandler");
const getRatedByItemIdHandler = require("../Handlers/Payments/getRatedByItemIdHandler");
const {validUserSu} = require('../utils/validateUsers')
//======================================================================================
getRouter.get("/videogames", getVideogamesHandler);//Modulos games/videogames (Libres)
getRouter.get("/games/:id", getDetailHandler); //Modulos games/videogames (Libres)
getRouter.get("/genres", getGenresHandler); //Protegida
getRouter.get("/platforms", getPlatformHandler); //Protegida
getRouter.get("/games", getGamesAdminHandler); //Libres
getRouter.get("/user", verifyToken, getUserHandler) //Protegida
getRouter.get("/user/:id", verifyToken, getUserDetailHand) //Libre
//===================================================================
getRouter.get("/usersu",   validUserSu , getUserAllHand) //Protegida

//Payments:
getRouter.get("/getParchuseOrder", getParchuseOrderHandler);
getRouter.get("/success", (req, res) => res.send("success"));
getRouter.get("/failure", (req, res) => res.send("failure"));
getRouter.get("/pending", (req, res) => res.send("pending"));
getRouter.get("/getOrdersByUserId", getOrdersByUserIdHandler);
getRouter.get("/getRatedPendingItemsByUserId", getRatedPendingItemsByUserIdHandler);
getRouter.get("/getRatedByItemId/:itemID", getRatedByItemIdHandler);

getRouter.get("/getUserShoppingCart/:userID", getUserShoppingCartHandler);

module.exports = getRouter;
