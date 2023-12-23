const { Cart } = require("../../database");

const getUserShoppingCartController = async (userID, req, res) => {
    //console.log("userID 2: " + userID);
    //console.log("cartItems: " + cartItems);
  try {
    const auxCart = await Cart.findAll({
        where: {
            userId: userID
        }
    });

    let arrayCart = [];
    if(auxCart) {
        arrayCart = auxCart.map(obj => {
            return {
                id: obj.gameId,
                quantity: obj.quantity
            };
        });
    }

    //console.log("auxCart: " + JSON.stringify(arrayCart));

    return arrayCart;

  } catch (error) {
    
    res.status(500).send("putUserShoppingCartController not found");
  }
};

module.exports = getUserShoppingCartController;