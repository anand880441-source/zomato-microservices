const {
  getChannel,
  QUEUE
} = require("./connection");

const publishOrderEvent = (event) => {
  const channel = getChannel();

  if (!channel) {
    throw new Error(
      "RabbitMQ channel is not ready"
    );
  }

  channel.sendToQueue(
    QUEUE,
    Buffer.from(
      JSON.stringify(event)
    ),
    {
      persistent: true
    }
  );

  console.log(
    "RabbitMQ event published:",
    event.type
  );
};

module.exports =
  publishOrderEvent;