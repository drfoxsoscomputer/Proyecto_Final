const getRatedPendingItemsByUserIdController = require("../../Controllers/Payments/getRatedPendingItemsByUserIdController");

//Se recibe por param tanto el "collection_id/payment_id" como "external_reference"

const getRatedPendingItemsByUserIdHandler = async (req, res) => {
    //const  { userID }  = req.params;
    const {
      userID,
      page = 0,
      size = 5
    } = req.query;

    //console.log("userID :: " + userID);
    //console.log("page :: " + page);
    //console.log("size :: " + size);
  
    try {
      const ratedPendingItems = await getRatedPendingItemsByUserIdController(userID, page, size);
      res.status(201).json(ratedPendingItems);
      //res.status(201).json("OK");
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };
  
  module.exports = getRatedPendingItemsByUserIdHandler;