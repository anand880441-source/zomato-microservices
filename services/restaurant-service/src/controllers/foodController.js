const Restaurant =
  require("../models/Restaurant");

const Food =
  require("../models/Food");


// CREATE FOOD
const createFood =
  async (
    req,
    res
  ) => {

    try {

      const {
        restaurantId
      } = req.params;

      const {
        name,
        price
      } = req.body;


      const restaurant =
        await Restaurant.findById(
          restaurantId
        );


      if (!restaurant) {

        return res.status(404).json({
          message:
            "Restaurant not found"
        });
      }


      if (
        !name ||
        price === undefined
      ) {

        return res.status(400).json({
          message:
            "Name and price are required"
        });
      }


      const food =
        await Food.create({
          restaurantId,
          name,
          price
        });


      res.status(201).json({
        message:
          "Food created",

        food
      });

    } catch (error) {

      console.error(error);

      res.status(400).json({
        message:
          "Invalid request"
      });
    }
  };


// GET FOOD
const getFoods =
  async (
    req,
    res
  ) => {

    try {

      const foods =
        await Food.find({
          restaurantId:
            req.params.restaurantId
        })
        .sort({
          createdAt: -1
        });


      res.json({
        foods
      });

    } catch (error) {

      console.error(error);

      res.status(400).json({
        message:
          "Invalid restaurant ID"
      });
    }
  };


module.exports = {
  createFood,
  getFoods
};