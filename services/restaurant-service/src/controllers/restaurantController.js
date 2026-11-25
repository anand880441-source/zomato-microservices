const Restaurant =
  require("../models/Restaurant");


// CREATE RESTAURANT
const createRestaurant =
  async (
    req,
    res
  ) => {

    try {

      const {
        name,
        address
      } = req.body;


      if (
        !name ||
        !address
      ) {
        return res.status(400).json({
          message:
            "Name and address are required"
        });
      }


      const restaurant =
        await Restaurant.create({
          name,
          address
        });


      res.status(201).json({
        message:
          "Restaurant created",

        restaurant
      });

    } catch (error) {

      console.error(error);

      res.status(500).json({
        message:
          "Server error"
      });
    }
  };


// GET RESTAURANTS
const getRestaurants =
  async (
    req,
    res
  ) => {

    try {

      const restaurants =
        await Restaurant.find()
          .sort({
            createdAt: -1
          });


      res.json({
        restaurants
      });

    } catch (error) {

      console.error(error);

      res.status(500).json({
        message:
          "Server error"
      });
    }
  };


// GET ONE RESTAURANT
const getRestaurantById =
  async (
    req,
    res
  ) => {

    try {

      const restaurant =
        await Restaurant.findById(
          req.params.id
        );


      if (!restaurant) {

        return res.status(404).json({
          message:
            "Restaurant not found"
        });
      }


      res.json({
        restaurant
      });

    } catch (error) {

      return res.status(400).json({
        message:
          "Invalid restaurant ID"
      });
    }
  };


module.exports = {
  createRestaurant,
  getRestaurants,
  getRestaurantById
};