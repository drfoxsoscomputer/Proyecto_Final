const getParchuseOrderController = require("../../Controllers/Payments/getParchuseOrderController");

//Se recibe por param tanto el "collection_id/payment_id" como "external_reference"

const getParchuseOrderHandler = async (req, res) => {
    const { payment_id, external_reference } = req.query;

    const arrayReferenceData = external_reference.split("-_");
    console.log("payment_id: " + payment_id);
    console.log("arrayReferenceData: " + arrayReferenceData[0]);
    
    try {
      const orderData = await getParchuseOrderController(parseInt(arrayReferenceData[0]));
      
      res.status(201).json(orderData);

    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };
  
  module.exports = getParchuseOrderHandler;