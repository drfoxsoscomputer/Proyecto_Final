const postVideogamesByIdsController = require("../../Controllers/VideoGames/postVideogamesByIdsController");
const { PurchaseOrder, PurchaseOrderItems } = require("../../database");
const { Op } = require("sequelize");
//const getOrdersByUserIdController = async ( userID, page, size, statusfilters, orderFilter, req, res ) => {
const getOrdersByUserIdController = async ( filters, page, size, req, res ) => {
    page = +page;
    size = +size;
    //console.log("userID: " + typeof userID + ": " + userID);
    console.log("page: " + typeof page + ": " + page);
    console.log("size: " + typeof size + ": " + size);
    //console.log("status: " + typeof status + ": " + status);
  try {
    const { count, rows } = await PurchaseOrder.findAndCountAll({
        where: filters,
        //order: orderFilter,
        limit: size,
        offset: page * size,
        distinct: true,
    });
    //return rows;
    let userOrdersData = [];
    if(count)
    {
        for(let i = 0; i < rows.length; i++){
            const orderVideogamesResult = await PurchaseOrderItems.findAll({
                where: {
                    orderId: rows[i].id
                },
                attributes: ["itemId", "quantity", "unitPrice", "currencyId"],
                through: {
                    attributes: [],
                }
            });
            //return orderVideogamesResult;
            if(orderVideogamesResult) {
                let ids = [];
                let totalCost = 0;
                orderVideogamesResult.forEach(element => {
                    ids.push(element.itemId);
                    totalCost += element.quantity * element.unitPrice;
                });
                /*const ids = orderVideogamesResult.map(item => {
                    return item.itemId;
                });*/
                const videogamesByIds = await postVideogamesByIdsController(ids);
                //return videogamesByIds;
                if(videogamesByIds) {
                    userOrdersData.push({
                        ...rows[i].get(),
                        items: videogamesByIds.map(item => {
                            const auxObj = orderVideogamesResult.find(obj => obj.itemId === item.id);
                            return {
                                ...item,
                                quantity: auxObj.quantity,
                                unitPrice: auxObj.unitPrice,
                                currencyId: auxObj.currencyId
                            };
                        }),
                        totalCost: totalCost
                    })
                }
            }
        }
    }

    const auxTotalPages = Math.ceil(count / size);
    const auxPrevPage = page - 1 >= 0 ? page - 1 : -1;
    const auxNextPage = page + 1 < auxTotalPages ? page + 1 : -1;
    const auxHasPrevPage = page - 1 >= 0 ? true : false;
    const auxHasNextPage = page + 1 < auxTotalPages ? true : false;

    return {
        ordersData: userOrdersData,
        PaginationData: {
            totalItems: count,
            limit: size,
            totalPages: auxTotalPages,
            currentPage: page,
            hasPrevPage: auxHasPrevPage,
            hasNextPage: auxHasNextPage,
            prevPage: auxPrevPage,
            nextPage: auxNextPage,
        }
    }
  } catch (error) {
    console.log("ERROR 2");
    res.status(500).send("getVideogames not found");
  }
};

module.exports = getOrdersByUserIdController;
