const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');
const { authMiddleware } = require('../middlewares/authMiddleware');


router.post("/", authMiddleware, contactController.sendRequest);
router.get("/", authMiddleware, contactController.getContacts);
router.get("/received-requests", authMiddleware, contactController.getReceivedRequests);
router.get("/check", authMiddleware, contactController.checkContact);


router.post("/:contactId/redeem", authMiddleware, contactController.redeemRequest);
router.post("/:contactId/accept", authMiddleware, contactController.acceptRequest)
router.delete("/:contactId", authMiddleware, contactController.unfriend);

module.exports = router;