const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');


router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.post("logout", authController.logout)
router.post("/verify", authController.verifyOtp);
router.post("/resendOtp", authController.resendOtp);
router.post("/requestResetPassword", authController.requestRequestPassword)
router.post("/resetPassword", authController.resetPassword)


module.exports = router;