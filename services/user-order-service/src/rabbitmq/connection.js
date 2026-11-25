const amqp = require("amqplib");

let channel;

const QUEUE = "order_events";

const connectRabbitMQ = async () => {
  try {
    const connection =
      await amqp.connect(
        process.env.RABBITMQ_URL
      );

    channel =
      await connection.createChannel();

    await channel.assertQueue(
      QUEUE,
      {
        durable: true
      }
    );

    console.log(
      "User Order Service connected to RabbitMQ"
    );
  } catch (error) {
    console.error(
      "RabbitMQ connection failed:",
      error.message
    );

    process.exit(1);
  }
};

const getChannel = () => {
  return channel;
};

module.exports = {
  connectRabbitMQ,
  getChannel,
  QUEUE
};