const postVideogamesByIdsController = require("../../Controllers/VideoGames/postVideogamesByIdsController");
const { PurchaseOrder, PurchaseOrderItems } = require("../../database");

const getParchuseOrderController = async ( orderId, req, res ) => {
  console.log("orderId: " + typeof orderId + ": " + orderId);
  try {
    //const orderDataResult = await PurchaseOrder.findByPk(orderId);
    const orderDataResult = await PurchaseOrder.findOne({
      where: {
        id: orderId
      }
      /*through: {
        attributes: [],
      }*/
    });

    if(orderDataResult)
    {
      const orderVideogamesResult = await PurchaseOrderItems.findAll({
        where: {
          orderId: orderId
        }
        /*through: {
          attributes: [],
        }*/
      });

      if(orderVideogamesResult) {
        let totalCost = 0;
        const ids = orderVideogamesResult.map(item => {
          totalCost += item.quantity * item.unitPrice;
          return item.itemId;
        });
        const videogamesByIds = await postVideogamesByIdsController(ids);
        if(videogamesByIds) {
          const videogamesResult = videogamesByIds.map(item => {
            const auxObj = orderVideogamesResult.find(obj => obj.itemId === item.id);
            return {
              ...item,
              quantity: auxObj.quantity,
              unitPrice: auxObj.unitPrice,
              currencyId: auxObj.currencyId
            };
          });
          orderDataResult.totalCost = totalCost;
          return {
            orderData: orderDataResult,
            videogamesData: videogamesResult
          };
        } else {
          res.status(500).send("No_videogames_data");
        }
      } else {
        res.status(500).send("No_videogamesInOrder_exists");
      }
    } else {
      res.status(500).send("No_order_exists");
    }
    /*const { count, rows } = await PurchaseOrder.findAndCountAll({
      where: {
        id: orderId
      }
    });

    return {
      order: rows
    };*/
  } catch (error) {
    res.status(500).send("getVideogames not found");
  }
};

module.exports = getParchuseOrderController;
