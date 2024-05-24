const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middlewares/authMiddleware');
const multer = require('multer');
const storageController = require('../controllers/storageController')


var upload = multer({
    limits: {
        fileSize: 15000000
    }
})

router.post("/upload", [upload.any(), authMiddleware], storageController.upload);
router.get("/:fileName", storageController.getFileByName);

module.exports = router;