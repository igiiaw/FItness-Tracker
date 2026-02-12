const express = require("express");
const router = express.Router();
const {
  createProgress,
  getProgress,
  getProgressById,
  updateProgress,
  deleteProgress,
} = require("../controllers/progressController");
const auth = require("../middleware/auth");
const validate = require("../middleware/validate");
const { progressSchema } = require("../validators/schemas");

router.use(auth);

router.post("/", validate(progressSchema), createProgress);
router.get("/", getProgress);
router.get("/:id", getProgressById);
router.put("/:id", updateProgress);
router.delete("/:id", deleteProgress);

module.exports = router;
