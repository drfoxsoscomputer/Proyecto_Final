const getUserShoppingCartController = require("../../Controllers/Users/getUserShoppingCartController");

const getUserShoppingCartHandler = async (req, res) => {
  const  { userID }  = req.params;

  //console.log("userID 1: " + userID);

  try {
    const response = await getUserShoppingCartController(userID);
    res.status(200).json(response);
    //res.status(200).json({res: "OK"});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = getUserShoppingCartHandler;