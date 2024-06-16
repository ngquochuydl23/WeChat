const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const { authMiddleware } = require('../middlewares/authMiddleware');


router.post('/:msgId/redeem', authMiddleware, messageController.redeemMsg);


router.get('/by-room/:roomId', authMiddleware, messageController.getMsgByRoomId);
router.delete('/by-room/:roomId', authMiddleware, messageController.deleteMsgByRoomId);
router.post('/by-room/:roomId/seen', authMiddleware, messageController.seenMsgs);
router.post('/by-room/:roomId/sendMsg', authMiddleware, messageController.sendMsg);
module.exports = router;