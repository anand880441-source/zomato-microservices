const {
  getChannel,
  QUEUE
} = require("./connection");


const startConsumer =
  () => {

    const channel =
      getChannel();

    if (!channel) {
      throw new Error(
        "RabbitMQ channel is not ready"
      );
    }


    channel.consume(
      QUEUE,

      (message) => {

        if (!message) {
          return;
        }


        try {

          const event =
            JSON.parse(
              message.content.toString()
            );


          console.log(
            "\n========== RabbitMQ Event =========="
          );

          console.log(
            "Event:",
            event.type
          );

          console.log(
            "Order ID:",
            event.orderId
          );

          console.log(
            "Restaurant ID:",
            event.restaurantId
          );

          console.log(
            "====================================\n"
          );


          channel.ack(
            message
          );

        } catch (error) {

          console.error(
            "Event processing failed:",
            error.message
          );

          channel.nack(
            message,
            false,
            false
          );
        }
      }
    );


    console.log(
      "Restaurant Service listening for order events"
    );
  };


module.exports =
  startConsumer;