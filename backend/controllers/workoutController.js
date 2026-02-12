const Workout = require("../models/Workout");

// POST /api/workouts
const createWorkout = async (req, res, next) => {
  try {
    const workout = await Workout.create({
      ...req.body,
      user: req.user.id,
    });

    res.status(201).json({ message: "Workout created successfully.", workout });
  } catch (error) {
    next(error);
  }
};

// GET /api/workouts
const getWorkouts = async (req, res, next) => {
  try {
    const workouts = await Workout.find({ user: req.user.id }).sort({
      date: -1,
    });
    res.status(200).json(workouts);
  } catch (error) {
    next(error);
  }
};

// GET /api/workouts/:id
const getWorkoutById = async (req, res, next) => {
  try {
    const workout = await Workout.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!workout) {
      return res.status(404).json({ message: "Workout not found." });
    }

    res.status(200).json(workout);
  } catch (error) {
    next(error);
  }
};

// PUT /api/workouts/:id
const updateWorkout = async (req, res, next) => {
  try {
    const workout = await Workout.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!workout) {
      return res.status(404).json({ message: "Workout not found." });
    }

    const updated = await Workout.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res
      .status(200)
      .json({ message: "Workout updated successfully.", workout: updated });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/workouts/:id
const deleteWorkout = async (req, res, next) => {
  try {
    let query = { _id: req.params.id };

    // Regular users can only delete their own workouts
    if (req.user.role !== "admin") {
      query.user = req.user.id;
    }

    const workout = await Workout.findOneAndDelete(query);

    if (!workout) {
      return res.status(404).json({ message: "Workout not found." });
    }

    res.status(200).json({ message: "Workout deleted successfully." });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createWorkout,
  getWorkouts,
  getWorkoutById,
  updateWorkout,
  deleteWorkout,
};
