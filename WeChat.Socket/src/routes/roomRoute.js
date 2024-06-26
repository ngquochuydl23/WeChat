const express = require('express');
const router = express.Router();
const roomController = require('../controllers/roomController');
const { authMiddleware } = require('../middlewares/authMiddleware');

// router.get('/last', authMiddleware, roomController.getLastRooms);
// router.get('/search', authMiddleware, roomController.getRoomsByMemberName);
// router.post('/', authMiddleware, roomController.initRoomChat);
// router.get('/:roomId', authMiddleware, roomController.findRoom);
// router.post('/:roomId/dispersion', authMiddleware, roomController.dispersionRoomById);
// router.post('/:roomId/members', authMiddleware, roomController.addMemberToRoom);


router.get('/find-single-room', authMiddleware, roomController.findSingleRoom);
router.post('/', authMiddleware, roomController.initRoomChat);
router.get('/last', authMiddleware, roomController.getLastRooms);
router.get('/search', authMiddleware, roomController.getRoomsByMemberName);

router.post('/:roomId/leave', authMiddleware, roomController.leaveRoom);
router.post('/:roomId/addMember', authMiddleware, roomController.addMember);
module.exports = router;