const {
  pool
} = require("../config/db");

const publishOrderEvent =
  require("../rabbitmq/publisher");


// CREATE ORDER
const createOrder = async (
  req,
  res
) => {
  try {
    const {
      restaurantId,
      items,
      totalAmount,
      deliveryAddress
    } = req.body;

    if (
      !restaurantId ||
      !items ||
      !Array.isArray(items) ||
      items.length === 0 ||
      totalAmount === undefined ||
      !deliveryAddress
    ) {
      return res.status(400).json({
        message:
          "restaurantId, items, totalAmount and deliveryAddress are required"
      });
    }

    const result =
      await pool.query(
        `
        INSERT INTO orders
        (
          user_id,
          restaurant_id,
          items,
          total_amount,
          delivery_address
        )

        VALUES
        ($1, $2, $3, $4, $5)

        RETURNING *
        `,
        [
          req.user.id,
          restaurantId,
          JSON.stringify(items),
          totalAmount,
          deliveryAddress
        ]
      );

    const order =
      result.rows[0];

    publishOrderEvent({
      type: "order.created",

      orderId:
        order.id,

      userId:
        order.user_id,

      restaurantId:
        order.restaurant_id,

      items:
        order.items,

      totalAmount:
        order.total_amount,

      deliveryAddress:
        order.delivery_address
    });

    res.status(201).json({
      message:
        "Order created successfully",

      order
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error"
    });
  }
};


// GET MY ORDERS
const getOrders = async (
  req,
  res
) => {
  try {
    const result =
      await pool.query(
        `
        SELECT
          id,
          restaurant_id,
          items,
          total_amount,
          delivery_address,
          status,
          created_at

        FROM orders

        WHERE user_id = $1

        ORDER BY
          created_at DESC
        `,
        [req.user.id]
      );

    res.json({
      orders:
        result.rows
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error"
    });
  }
};


// GET ONE ORDER
const getOrderById =
  async (
    req,
    res
  ) => {
    try {
      const result =
        await pool.query(
          `
          SELECT
            id,
            restaurant_id,
            items,
            total_amount,
            delivery_address,
            status,
            created_at

          FROM orders

          WHERE
            id = $1
            AND user_id = $2
          `,
          [
            req.params.id,
            req.user.id
          ]
        );

      if (
        result.rows.length === 0
      ) {
        return res.status(404).json({
          message:
            "Order not found"
        });
      }

      res.json({
        order:
          result.rows[0]
      });

    } catch (error) {
      console.error(error);

      res.status(500).json({
        message: "Server error"
      });
    }
  };


// CANCEL ORDER
const cancelOrder =
  async (
    req,
    res
  ) => {
    try {
      const existing =
        await pool.query(
          `
          SELECT *
          FROM orders

          WHERE
            id = $1
            AND user_id = $2
          `,
          [
            req.params.id,
            req.user.id
          ]
        );

      if (
        existing.rows.length === 0
      ) {
        return res.status(404).json({
          message:
            "Order not found"
        });
      }

      const order =
        existing.rows[0];

      if (
        order.status !==
        "PLACED"
      ) {
        return res.status(400).json({
          message:
            "Only PLACED orders can be cancelled"
        });
      }

      const result =
        await pool.query(
          `
          UPDATE orders

          SET status =
            'CANCELLED'

          WHERE
            id = $1
            AND user_id = $2

          RETURNING *
          `,
          [
            req.params.id,
            req.user.id
          ]
        );

      const updatedOrder =
        result.rows[0];

      publishOrderEvent({
        type:
          "order.cancelled",

        orderId:
          updatedOrder.id,

        userId:
          updatedOrder.user_id,

        restaurantId:
          updatedOrder.restaurant_id
      });

      res.json({
        message:
          "Order cancelled",

        order:
          updatedOrder
      });

    } catch (error) {
      console.error(error);

      res.status(500).json({
        message: "Server error"
      });
    }
  };

module.exports = {
  createOrder,
  getOrders,
  getOrderById,
  cancelOrder
};