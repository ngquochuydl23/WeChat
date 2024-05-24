const express = require('express');
const router = express.Router();
const deviceController = require('../controllers/deviceControllers');
const { authMiddleware } = require('../middlewares/authMiddleware');

router.get("/", authMiddleware, deviceController.findDevices);
router.post("/:deviceId/terminate", authMiddleware, deviceController.terminateDeviceById)

module.exports = router;