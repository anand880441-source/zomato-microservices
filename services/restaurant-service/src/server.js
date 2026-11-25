require("dotenv").config();

const express =
  require("express");

const cors =
  require("cors");

const connectDB =
  require("./config/db");

const {
  connectRabbitMQ
} =
  require("./rabbitmq/connection");

const startConsumer =
  require("./rabbitmq/consumer");


const restaurantRoutes =
  require("./routes/restaurantRoutes");

const foodRoutes =
  require("./routes/foodRoutes");


const app =
  express();


app.use(cors());

app.use(
  express.json()
);


app.get(
  "/health",
  (req, res) => {

    res.json({
      service:
        "restaurant-service",

      status:
        "OK"
    });

  }
);


app.use(
  "/api/restaurants",
  restaurantRoutes
);


app.use(
  "/api/restaurants",
  foodRoutes
);


const PORT =
  process.env.PORT ||
  5002;


const startServer =
  async () => {

    try {

      await connectDB();

      await connectRabbitMQ();

      startConsumer();


      app.listen(
        PORT,
        () => {

          console.log(
            `Restaurant Service running on port ${PORT}`
          );

        }
      );

    } catch (error) {

      console.error(
        "Failed to start Restaurant Service:",
        error.message
      );

      process.exit(1);
    }
  };


startServer();