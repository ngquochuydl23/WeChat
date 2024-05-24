const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authMiddleware } = require('../middlewares/authMiddleware');



router.get("/", authMiddleware, userController.getUsers)

router.get("/me", authMiddleware, userController.getMyProfile);
router.put("/me", authMiddleware, userController.editProfile);
router.post("/me/change-password", authMiddleware, userController.changePassword);


router.get("/:userId", authMiddleware, userController.getUser)






module.exports = router;

