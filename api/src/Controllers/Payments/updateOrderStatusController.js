const { PurchaseOrder, PurchaseOrderItems } = require("../../database");

const updateOrderStatusController = async (orderDB_id, orderStatus, orderStatusDetail, orderTransactionId, req, res) => {
  console.log("orderPreferenceId: " + typeof orderDB_id + ": " + orderDB_id);
  console.log("orderStatus: " + typeof orderStatus + ": " + orderStatus);
  console.log("orderStatus: " + typeof orderStatusDetail + ": " + orderStatusDetail);
  console.log("orderTransactionId: " + typeof orderTransactionId + ": " + orderTransactionId);
  try {
    const [numUpdatedRows, updatedOrder] = await PurchaseOrder.update(
        { 
          status: orderStatus,
          statusDetail: orderStatusDetail,
          transactionId: orderTransactionId
        },
        {
          where: {
            id: orderDB_id,
          },
          returning: true, // Devolver los registros actualizados
        }
      );

    if (numUpdatedRows !== 0) {
      const [numUpdatedItemsRows, updatedItemsOrder] = await PurchaseOrderItems.update(
        { 
          status: orderStatus
        },
        {
          where: {
            orderId: orderDB_id
          },
          returning: true, // Devolver los registros actualizados
        }
      );
      if(numUpdatedItemsRows !== 0) {
        return updatedOrder;
      } else {
        console.log("Error no hay items");
        return res.status(404).json({ mensaje: 'items no encontrados' });
      }
    } else {
      console.log("Error no hay filas");
      return res.status(404).json({ mensaje: 'orden no encontrado' });
    }

  } catch (error) {
    console.log("Error Otro");
    res.status(500).send("putParchuseOrderStatusController not found");
  }
};

module.exports = updateOrderStatusController;