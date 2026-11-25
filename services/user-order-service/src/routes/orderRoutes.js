const express = require("express");

const auth =
  require("../middleware/auth");

const {
  createOrder,
  getOrders,
  getOrderById,
  cancelOrder
} = require("../controllers/orderController");

const router =
  express.Router();

router.use(auth);

router.post(
  "/",
  createOrder
);

router.get(
  "/",
  getOrders
);

router.get(
  "/:id",
  getOrderById
);

router.patch(
  "/:id/cancel",
  cancelOrder
);

module.exports = router;