const { PurchaseOrder, PurchaseOrderItems } = require("../../database");

const createOrderInDBController = async ( userID, itemsData, req, res) => {
  
  //console.log("itemsData: " + JSON.stringify(itemsData));
  //return "ok";
  try {
    const createOrder = await PurchaseOrder.create({
      userId: userID,
      //itemsData: itemsData,
      //totalCost: 500,
      //status: "pending"
      status: "waiting"
      //preferenceId: preferenceId
    });

    const arrayItemsIds = itemsData.map((item) => {
      return item.id;
    });

    const itemsHistory = await PurchaseOrderItems.findAll({
      where: {
        itemId: arrayItemsIds,
        userId: userID,
        isRated: true
      },
    });
    //console.log("itemsHistory: " + JSON.stringify(itemsHistory));
    if (createOrder) {
      const arrayBulk = itemsData.map(item => {

        return {
          itemId: item.id,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          currencyId: item.currencyId,
          orderId: createOrder.id,
          userId: userID,
          isRated: itemsHistory.some(auxItem => auxItem.itemId === item.id),
          status: "waiting"
        };
      });

      const createOrderItems = await PurchaseOrderItems.bulkCreate(
        arrayBulk
      );
      
      if(createOrderItems) {
          return createOrder;
      } else {
          res.status(500).send("Items_not_created");    
      }
    } else {
      res.status(500).send("Order_not_created");
    }
    //return "Order_created";
  } catch (error) {
    console.log("Error 02");
    res.status(500).send("createOrderInDB not found");
  }
};

module.exports = createOrderInDBController;