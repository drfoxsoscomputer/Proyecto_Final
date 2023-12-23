const { Router } = require("express");
const postRouter = Router();
//Importacion de funciones:
//postRouter.post("/DBcreateParchuseOrder", createOrderInDBHandler);
//a0aecb343e7a8564efadfe1f64da4f3bd04fe889
const {
    createGameHandler,
    createGenreHandler,
    createPlatformHandler} = require("../Handlers/Admin/gamePostHandler");
const {userLogHandler, loginUserHand} = require('../Handlers/Users/userLogHandler')
//const validateUser = require('../Handlers/Users/validateUser')
const postCreateParchuseOrderHandler = require("../Handlers/Payments/postCreateParchuseOrderHandler");
const postPaymentResultWebhookHandler = require("../Handlers/Payments/postPaymentResultWebhookHandler");
const postUserShoppingCartHandler = require("../Handlers/Users/postUserShoppingCartHandler");
const postVideogamesByIdsHandler = require("../Handlers/VideoGames/postVideogamesByIdsHandler");
const postUserRatedHandler = require("../Handlers/Payments/postUserRatedHandler");
//const createOrderInDBHandler = require("../Handlers/Payments/createOrderInDBHandler");
const verifyToken= require('../utils/verifyToken')
const {validUserCreate, validUserLog} = require("../utils/validateUsers")

//===============================================================================
postRouter.post("/",  verifyToken, createGameHandler); //Modulo game/videogame
postRouter.post("/genre",  verifyToken, createGenreHandler);
postRouter.post("/platform", verifyToken, createPlatformHandler);
postRouter.post("/user", validUserCreate, userLogHandler);
postRouter.post("/user/login", validUserLog, loginUserHand);
//Payments:
postRouter.post("/paymentResultwebhook", postPaymentResultWebhookHandler);
postRouter.post("/createParchuseOrder", verifyToken, postCreateParchuseOrderHandler);
postRouter.post("/postUserRated", verifyToken, postUserRatedHandler);
//postRouter.post("/DBcreateParchuseOrder", createOrderInDBHandler);

//User Cart:
postRouter.post("/createShoppingCart", verifyToken, postUserShoppingCartHandler);

postRouter.post("/videogamesByIds", postVideogamesByIdsHandler);


module.exports = postRouter;
