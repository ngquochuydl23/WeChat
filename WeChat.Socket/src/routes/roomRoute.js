const express = require('express');
const router = express.Router();
const roomController = require('../controllers/roomController');
const { authMiddleware } = require('../middlewares/authMiddleware');

router.get('/last', authMiddleware, roomController.getLastRooms);
router.get('/search', authMiddleware, roomController.getRoomsByMemberName);
router.post('/', authMiddleware, roomController.initRoomChat);
router.get('/:roomId', authMiddleware, roomController.findRoom);
router.post('/:roomId/dispersion', authMiddleware, roomController.dispersionRoomById);
router.post('/:roomId/members', authMiddleware, roomController.addMemberToRoom);




module.exports = router;