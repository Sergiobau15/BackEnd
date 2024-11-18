const express = require('express');
const router = express.Router();
const { createUser, updateUser, updatePassword, getUsers, validationUser, desactivateUser } = require('../controllers/user');

router.post('/create', createUser);
router.post('/update', updateUser);
router.post('/password', updatePassword);
router.post('/validation', validationUser);
router.get('/desactivate/:id', desactivateUser);
router.get('/', getUsers);

module.exports = router;