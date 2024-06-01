const express = require('express');
const router = express.Router();
const friendController = require('../controllers/friendController');
const { authMiddleware } = require('../middlewares/authMiddleware');


router.post("/", authMiddleware, friendController.sendRequest);
router.get("/", authMiddleware, friendController.getFriends);
router.get("/received-requests", authMiddleware, friendController.getReceivedRequests);
router.get("/check-friend", authMiddleware, friendController.checkFriend);


router.post("/:friendId/redeem", authMiddleware, friendController.redeemRequest);
router.post("/:friendId/accept", authMiddleware, friendController.acceptRequest)
router.delete("/:friendId", authMiddleware, friendController.unfriend);

module.exports = router;