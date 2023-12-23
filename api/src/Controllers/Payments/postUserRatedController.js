const { Rating, PurchaseOrderItems } = require("../../database");

const postUserRatedController = async (userID, itemID, comment, score, req, res) => {
    //const { ids } = req.body;
//console.log("userID: " + userID);
//console.log("cartItems: " + JSON.stringify(cartItems));
  try {
    const ratedData = await Rating.create({
        itemId: itemID,
        comment: comment,
        score: score,
        userId: userID
    });

    if(ratedData) {
        const [numUpdatedItemsRows, updatedItemsOrder] = await PurchaseOrderItems.update(
        { 
            isRated: true
        },
        {
            where: {
                itemId: itemID,
                userId: userID,
                isRated: false
            },
            returning: true, // Devolver los registros actualizados
        }
        );
        if(numUpdatedItemsRows !== 0) {
            return ratedData;
        } else {
            console.log("Error no hay items");
            return res.status(404).json({ mensaje: 'items no encontrados' });
        }
        return ratedData;
    } else {
        console.log("Error reted no creado");
        res.status(500).send("Rated_not_created");    
    }

  } catch (error) {
    
    res.status(500).send("postUserShoppingCartController not found");
  }
};

module.exports = postUserRatedController;