const { PurchaseOrder } = require("../../database");

const updateOrderProferenceIdController = async (orderId, orderPreferenceId, req, res) => {
    console.log("orderId: " + orderId);
    console.log("orderPreferenceId: " + orderPreferenceId);
  try {
    const [numUpdatedRows, updatedOrder] = await PurchaseOrder.update(
        { preferenceId: orderPreferenceId },
        {
          where: {
            id: orderId,
          },
          returning: true, // Devolver los registros actualizados
        }
      );

    if (numUpdatedRows === 0) {
        return res.status(404).json({ mensaje: 'orden no encontrado' });
    }

    return updatedOrder;

  } catch (error) {
    
    res.status(500).send("updateOrderProferenceIdController not found");
  }
};

module.exports = updateOrderProferenceIdController;