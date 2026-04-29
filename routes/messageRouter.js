const express = require("express");
const router = express.Router();

const messageController = require("../controllers/messageController");
const {
  ensureAuthenticated,
  ensureAdmin,
} = require("../middleware/authMiddleware");

router.get("/new", ensureAuthenticated, messageController.newMessageGet);

router.post("/new", ensureAuthenticated, messageController.newMessagePost);

router.delete("/:id", ensureAdmin, messageController.deleteMessage);

module.exports = router;