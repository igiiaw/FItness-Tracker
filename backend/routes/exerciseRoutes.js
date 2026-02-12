const express = require("express");
const router = express.Router();
const {
  createExercise,
  getExercises,
  getExerciseById,
  updateExercise,
  deleteExercise,
} = require("../controllers/exerciseController");
const auth = require("../middleware/auth");
const validate = require("../middleware/validate");
const { exerciseSchema } = require("../validators/schemas");

router.use(auth);

router.post("/", validate(exerciseSchema), createExercise);
router.get("/", getExercises);
router.get("/:id", getExerciseById);
router.put("/:id", updateExercise);
router.delete("/:id", deleteExercise);

module.exports = router;
