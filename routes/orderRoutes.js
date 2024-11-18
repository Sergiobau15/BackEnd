const express = require('express');
const router = express.Router();
const { createOrder, orders, getOrderById, deleteOrder, editOrder  } = require('../controllers/order');

router.post("/create", createOrder);
router.get("/", orders);
router.get("/:id", getOrderById );
router.put("/edit/:id", editOrder);
router.get('/desactivate/:id', deleteOrder );




module.exports = router;