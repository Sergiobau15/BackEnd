const express = require('express');
const router = express.Router();
const { createProduct, specificProduct, products, updateProduct, inactivateProduct } = require('../controllers/product');

router.post("/create", createProduct);
router.get("/",products);
router.get("/:id", specificProduct);
router.put("/updateProduct/:id", updateProduct);
router.patch("/inactivateProduct/:id", inactivateProduct);

module.exports = router;