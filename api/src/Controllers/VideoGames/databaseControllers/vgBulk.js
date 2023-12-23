const {infoVideoGame}=require('../../../../Data/indexData');
const {createGameDB}=require('../AdminControllers/gamesPostController');


const vgBulk = async()=>{
for (let i = 0; i <infoVideoGame.length; i++) {
    const game = infoVideoGame[i];

    try {
        // Llamar al controlador post aquí, usando los datos del juego
        await createGameDB(game.name, game.description, game.image, game.released, game.genres, game.platforms, game.price,game.physicalGame, game.stock);

        console.log(`Successfully: ${game.name}`);
    } catch (error) {
        console.error(`Error when posting the game ${game.name}: ${error.message}`);
    }
}
}

module.exports= vgBulk;
