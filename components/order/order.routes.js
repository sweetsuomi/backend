"use strict";

const router = require("express").Router();

const auth = require("../../middlewares/auth");
const checkRole = require("../../middlewares/checkRole");
const Order = require("./order.controller");
const Validations = require("./order.validations");

/* Get all the orders on a day */
router.get('/all', auth, checkRole,	Validations.getAllOrders,	Order.getAllOrders);

/* Mark an order as delivered */
//router.put("/deliver", auth, checkRole, Validations.deliverOrder, Order.deliverOrder);
router.put("/deliver", auth, checkRole, Order.deliverOrder);

/* Delete an order for a given day */
//router.delete("/force", auth, checkRole, Validations.deleteOrderForce, Order.deleteOrderForce);
router.delete("/force", auth, checkRole, Order.deleteOrderForce);

/* Get all the orders of an user */
router.get('/list',	auth,	Order.getUserOrderList);

/* Post an user order */ // Check if there's enough quantity in the menu
//router.post("/", auth, Validations.postOrder,	Order.postOrder);
router.post("/", auth,	Order.postOrder);

/* Delete an user order */
//router.delete("/", auth, Validations.deleteOrder,	Order.deleteOrder);
router.delete("/", auth,	Order.deleteOrder);

module.exports = router;
