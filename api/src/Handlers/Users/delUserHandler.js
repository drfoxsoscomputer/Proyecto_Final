const delUser = require("../../Controllers/Users/delUser");

const delUserHandler = async (req, res) => {
  const { id } = req.params;
  try {
    const response = await delUser(id);
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = delUserHandler;
