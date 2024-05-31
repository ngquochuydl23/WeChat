const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authMiddleware } = require('../middlewares/authMiddleware');

router.get("/find-by-phone", authMiddleware, userController.findByPhoneNumber)

module.exports = router;





