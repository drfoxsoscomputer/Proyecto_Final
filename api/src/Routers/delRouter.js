const {Router}=require('express');
const delRouter=Router();
//Importacion de funciones
const delUserHandler = require('../Handlers/Users/delUserHandler');
const {
    delGameHand,
    delGenreHand,
    delPlatformHand} = require('../Handlers/Admin/delGameHand')
    const verifyToken= require('../utils/verifyToken');
const {verifyDoNotDel}=require('../utils/validateUsers')

//========================================================================
delRouter.delete('/games/:id', verifyToken, delGameHand);
delRouter.delete('/genres/:id', verifyToken, delGenreHand);
delRouter.delete('/platforms/:id', verifyToken, delPlatformHand);
delRouter.delete('/user/:id', verifyToken, verifyDoNotDel, delUserHandler);

module.exports= delRouter;