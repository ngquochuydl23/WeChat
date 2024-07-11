const express = require('express');
const router = express.Router();
const roomController = require('../controllers/roomController');
const { authMiddleware } = require('../middlewares/authMiddleware');

router.get('/find-single-room', authMiddleware, roomController.findSingleRoom);
router.post('/', authMiddleware, roomController.initRoomChat);
router.get('/last', authMiddleware, roomController.getLastRooms);
router.get('/search', authMiddleware, roomController.getRoomsByMemberName);
router.get('/groups', authMiddleware, roomController.listGroups);


router.post('/:roomId/leave', authMiddleware, roomController.leaveRoom);
router.post('/:roomId/addMember', authMiddleware, roomController.addMember);
router.patch('/:roomId/uploadThumbnail', authMiddleware, roomController.uploadThumbnail);
module.exports = router;