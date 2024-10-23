const getAllUsers = async (req, res) => {
  res.send("getall");
};
const getSingleUser = async (req, res) => {
  res.send("single");
};
const showCurrentUser = async (req, res) => {
  res.send("showcurrent");
};
const updateUser = async (req, res) => {
  console.log("Yeah");

  res.send("update");
};
const updateUserPassword = async (req, res) => {
  res.send("updatepasswword");
};

module.exports = {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUser,
  updateUserPassword,
};
