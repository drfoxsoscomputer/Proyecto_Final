const { Router } = require("express");
const putRouter = Router();
//Importacion de funciones:
const {gameUpdaterHand,genreUpdaterHand,platformUpdaterHand} = require("../Handlers/Admin/gameUpdaterHand");
const {userUpdaterHand,userSUpdaterHand} = require('../Handlers/Users/userUpdaterHand');
const verifyToken= require('../utils/verifyToken')
const {validUserSu,verifyUsPas} = require('../utils/validateUsers')

//====================================================================================
putRouter.put("/games/:id", verifyToken, gameUpdaterHand); //Modulo games/videogames
putRouter.put('/user/:id', verifyToken, verifyUsPas, userUpdaterHand); //Modulo user
putRouter.put('/genre/:id', verifyToken, genreUpdaterHand); //Modulo genre
putRouter.put('/platform/:id', verifyToken, platformUpdaterHand); //Modulo platform
putRouter.put("/usersu/:id",   validUserSu , userSUpdaterHand) //Protegida


module.exports = putRouter;
