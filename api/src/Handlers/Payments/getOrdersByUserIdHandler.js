const getOrdersByUserIdController = require("../../Controllers/Payments/getOrdersByUserIdController");
const { Op } = require("sequelize");
//Se recibe por param tanto el "collection_id/payment_id" como "external_reference"

const getParchuseOrderHandler = async (req, res) => {
    //const  { userID }  = req.params;
    const { userID, page = 0, size = 5, status } = req.query;
    //console.log("userID: " + userID);
    //console.log("external_reference: " + external_reference);

    /*console.log("userID :: " + userID);
    console.log("page :: " + page);
    console.log("size :: " + size);*/

    let filters = {
      userId: userID
    };

    if(status) {
      filters.status = status;
    } else {
      filters.status = {
        [Op.ne]: 'waiting'
      };
    }
  
    try {
      const ordersData = await getOrdersByUserIdController(filters, page, size);
      res.status(201).json(ordersData);

    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };
  
  module.exports = getParchuseOrderHandler;