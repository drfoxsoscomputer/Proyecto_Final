const postCreateParchuseOrderController = require("../../Controllers/Payments/postCreateParchuseOrderController");
const createOrderInDBController = require("../../Controllers/Payments/createOrderInDBController");
const updateOrderProferenceIdController = require("../../Controllers/Payments/updateOrderProferenceIdController");

const postCreateParchuseOrderHandler = async (req, res) => {
  const { userID, userEmail, items } = req.body;

  if(!items || items.length === 0) {
    res.status(400).json({ error: "No items attached" });
  }

  const auxItems = items.map((item) => {
    return {
      id: item.id,
      quantity: item.quantity,
      unitPrice: item.unit_price,
      currencyId: item.currency_id
    };
  });

  try {
    //------------------------------

    const createOrderDB = await createOrderInDBController(userID, auxItems/*JSON.stringify(auxItems)*/);
    //console.log("createOrderDB: " + JSON.stringify(createOrderDB));
    const orderBodyMercadoPago = await postCreateParchuseOrderController(userID, userEmail, items, createOrderDB.id.toString());

    const updateOrder = await updateOrderProferenceIdController(createOrderDB.id, orderBodyMercadoPago.id);

    if(updateOrder) {
      res.status(201).json({ body: orderBodyMercadoPago});
    } else {
      res.status(500).send("Order_not_update");
    }
    
    //res.status(201).json({ body: "hi"});
    //------------------------------

    //res.status(201).json({ body: orderBody});
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

module.exports = postCreateParchuseOrderHandler;