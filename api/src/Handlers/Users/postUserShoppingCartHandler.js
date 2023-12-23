const postUserShoppingCartController = require("../../Controllers/Users/postUserShoppingCartController");

const postUserShoppingCartHandler = async (req, res) => {
  const { userID, cartItems } = req.body;

  //console.log("userID: " + userID);
  //console.log("cartItems: " + JSON.stringify(cartItems));

  const auxArray = cartItems.map(obj => {
    return {
        userId: userID,
        gameId: obj.id,
        quantity: obj.quantity
    };
  });

  try {
    const response = await postUserShoppingCartController(userID, auxArray);
    res.status(200).json(response);
    //res.status(200).json({res: "OK"});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = postUserShoppingCartHandler;