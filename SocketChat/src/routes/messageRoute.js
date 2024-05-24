const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const { authMiddleware } = require('../middlewares/authMiddleware');


router.post('/:msgId/', authMiddleware, messageController.redeemMsg);

router.post('/room/:roomId', authMiddleware, messageController.sendMsg);
router.get('/room/:roomId', authMiddleware, messageController.getMsgByRoomId);
router.delete('/room/:roomId', authMiddleware, messageController.deleteMsgByRoomId);


module.exports = router;