const express =
  require("express");

const {
  createFood,
  getFoods
} =
  require("../controllers/foodController");

const router =
  express.Router();


router.post(
  "/:restaurantId/foods",
  createFood
);

router.get(
  "/:restaurantId/foods",
  getFoods
);


module.exports =
  router;