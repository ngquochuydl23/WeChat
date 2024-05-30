const express = require('express');
const router = express.Router();
const friendController = require('../controllers/friendController');
const { authMiddleware } = require('../middlewares/authMiddleware');


router.post("/send-request", authMiddleware, friendController.sendRequest)
router.get("/", authMiddleware, friendController.getFriends)

module.exports = router;