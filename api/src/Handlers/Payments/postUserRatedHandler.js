const postUserRatedController = require("../../Controllers/Payments/postUserRatedController");

const postUserRatedHandler = async (req, res) => {
  const { userID, itemID, comment, score } = req.body;
 console.log("userID: " + userID);
 console.log("itemID: " + itemID);
 console.log("comment: " + comment);
 console.log("score: " + score);

 //res.status(201).json("OK");

  try {
    const ratedData = await postUserRatedController(userID, itemID, comment, score);
    res.status(201).json(ratedData);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = postUserRatedHandler;
