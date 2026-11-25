require("dotenv").config();

const express =
  require("express");

const cors =
  require("cors");

const {
  connectDB
} = require("./config/db");

const {
  connectRabbitMQ
} = require("./rabbitmq/connection");

const authRoutes =
  require("./routes/authRoutes");

const orderRoutes =
  require("./routes/orderRoutes");

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
        "user-order-service",

      status: "OK"
    });
  }
);


app.use(
  "/api/auth",
  authRoutes
);

app.use(
  "/api/orders",
  orderRoutes
);


const PORT =
  process.env.PORT ||
  5001;


const startServer =
  async () => {
    try {
      await connectDB();

      await connectRabbitMQ();

      app.listen(
        PORT,
        () => {
          console.log(
            `User Order Service running on port ${PORT}`
          );
        }
      );

    } catch (error) {
      console.error(
        "Failed to start service:",
        error.message
      );

      process.exit(1);
    }
  };


startServer();