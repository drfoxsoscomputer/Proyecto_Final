const { Sequelize } = require("sequelize");
const { Rating, User } = require("../../database");

const getRatedByItemIdController = async (itemID, req, res) => {
  console.log("itemID 2: " + itemID);
  //console.log("cartItems: " + cartItems);
  try {
    const avgRatedItem = await Rating.findOne({
      where: {
        itemId: itemID,
      },
      attributes: [[Sequelize.fn("AVG", Sequelize.col("score")), "avgScore"]],
    });
    //return avgRatedItem.get('avgScore');
    const ratedItemData = await Rating.findAll({
      where: {
        itemId: itemID,
      },
      attributes: [
        "score",
        [Sequelize.fn("COUNT", Sequelize.col("score")), "count"],
      ],
      group: ["score"],
    });
    //return ratedItemData;
    const registerCounter = await Rating.count({
      where: {
        itemId: itemID,
      },
    });
    //return registerCounter;
    let arrayScorePercentajes = ratedItemData.map((aux) => {
      const auxCount = +aux.get("count");
      return {
        score: aux.get("score"),
        count: auxCount,
        percent: (auxCount / registerCounter) * 100,
      };
    });

    const lastTenRatings = await Rating.findAll({
      where: {
        itemId: itemID,
      },
      limit: 10,
      order: [["createdAt", "DESC"]],
    });

    const userIdArray = lastTenRatings.map((user) => {
      return user.userId;
    });

    const usersData = await User.findAll({
      where: {
        id: userIdArray,
      },
    });

    let auxLastTenRatings = [];

    for (let i = 0; i < lastTenRatings.length; i++) {
      const auxUserData = usersData.find(
        (user) => user.id === lastTenRatings[i].userId
      );

      auxLastTenRatings.push({
        ...lastTenRatings[i].get(),
        picture: auxUserData.dataValues.picture,
        nickname:
          auxUserData.dataValues.nickname !== ""
            ? auxUserData.dataValues.nickname
            : auxUserData.dataValues.given_name !== ""
            ? auxUserData.dataValues.given_name
            : auxUserData.dataValues.email.split("@")[0],
      });
    }

    let auxArrayScorePercentaje = [];
    for (let i = 5; i >= 1; i--) {
      const auxStar = arrayScorePercentajes.find((star) => star.score === i);
      if (auxStar) {
        auxArrayScorePercentaje.push(auxStar);
      } else {
        auxArrayScorePercentaje.push({
          score: i,
          count: 0,
          percent: 0,
        });
      }
    }

    return {
      avgScore: +avgRatedItem.get("avgScore"),
      scorePercentajes: auxArrayScorePercentaje,
      lastTenRatings: auxLastTenRatings,
    };
  } catch (error) {
    res.status(500).send("putUserShoppingCartController not found");
  }
};

module.exports = getRatedByItemIdController;
