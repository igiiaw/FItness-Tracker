const express = require("express");
const router = express.Router();
const {
  createWorkout,
  getWorkouts,
  getWorkoutById,
  updateWorkout,
  deleteWorkout,
} = require("../controllers/workoutController");
const auth = require("../middleware/auth");
const validate = require("../middleware/validate");
const { workoutSchema } = require("../validators/schemas");

// All routes are private (require authentication)
router.use(auth);

// POST /api/workouts - create a new workout
router.post("/", validate(workoutSchema), createWorkout);

// GET /api/workouts - get all workouts for logged-in user
router.get("/", getWorkouts);

// GET /api/workouts/:id - get a specific workout
router.get("/:id", getWorkoutById);

// PUT /api/workouts/:id - update a workout
router.put("/:id", updateWorkout);

// DELETE /api/workouts/:id - delete a workout
router.delete("/:id", deleteWorkout);

module.exports = router;
