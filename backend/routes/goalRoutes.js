const express = require("express");
const router = express.Router();
const {
  createGoal,
  getGoals,
  getGoalById,
  updateGoal,
  deleteGoal,
} = require("../controllers/goalController");
const auth = require("../middleware/auth");
const validate = require("../middleware/validate");
const { goalSchema } = require("../validators/schemas");

router.use(auth);

router.post("/", validate(goalSchema), createGoal);
router.get("/", getGoals);
router.get("/:id", getGoalById);
router.put("/:id", updateGoal);
router.delete("/:id", deleteGoal);

module.exports = router;
