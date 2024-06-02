const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const { authMiddleware } = require('../middlewares/authMiddleware');

router.get("/:userId", authMiddleware, profileController.getProfile);
router.get("/", authMiddleware, profileController.getMyProfile);
router.put("/", authMiddleware, profileController.editProfile);
router.post("/change-password", authMiddleware, profileController.changePassword);
router.patch("/change-avatar", authMiddleware, profileController.changeAvatar);
router.patch("/change-cover", authMiddleware, profileController.changeCover);
router.patch("/change-bio", authMiddleware, profileController.changeBio);

module.exports = router;

