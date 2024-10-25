const express = require("express");
const router = express.Router();
const {
  createOrders,
  getAllOrders,
  getSingleOrder,
  getCurrentUserOrders,
  updateOrder,
} = require("../controllers/orderController");
const {
  authenticateUser,
  authorizePermissions,
} = require("../middlewares/authentication");
const { checkPermissions } = require("../utils");

router
  .route("/")
  .post(createOrders)
  .get(authorizePermissions("admin"), getAllOrders);

router.route("/showAllMyOrders").get(getCurrentUserOrders);

router.route("/:id").get(getSingleOrder).patch(updateOrder);

module.exports = router;
