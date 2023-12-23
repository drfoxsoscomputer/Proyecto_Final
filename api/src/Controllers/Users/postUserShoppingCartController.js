const { Cart } = require("../../database");

const postUserShoppingCartController = async (userID, cartItems, req, res) => {
//console.log("userID: " + userID);
//console.log("cartItems: " + JSON.stringify(cartItems));
  try {
    
    const auxDestroy = await Cart.destroy({
        where: {
            userId: userID
        }
    });

    if(auxDestroy) {
        console.log("Old cart is destroy");
    } else {
        console.log("No old cart");
    }

    const auxCart = await Cart.bulkCreate(
        cartItems
    );

    if(auxCart) {
        const auxResult = auxCart.map(obj => {
            return {
                id: obj.gameId,
                quantity: obj.quantity
            };
        });
        return auxResult;
    } else {
        res.status(500).send("Cart not created");    
    }

  } catch (error) {
    
    res.status(500).send("postUserShoppingCartController not found");
  }
};

module.exports = postUserShoppingCartController;