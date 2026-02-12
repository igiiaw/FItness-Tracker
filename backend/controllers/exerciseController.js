const Exercise = require("../models/Exercise");

// POST /api/exercises
const createExercise = async (req, res, next) => {
  try {
    const exercise = await Exercise.create({
      ...req.body,
      user: req.user.id,
    });

    res
      .status(201)
      .json({ message: "Exercise created successfully.", exercise });
  } catch (error) {
    next(error);
  }
};

// GET /api/exercises
const getExercises = async (req, res, next) => {
  try {
    const exercises = await Exercise.find({ user: req.user.id }).sort({
      date: -1,
    });
    res.status(200).json(exercises);
  } catch (error) {
    next(error);
  }
};

// GET /api/exercises/:id
const getExerciseById = async (req, res, next) => {
  try {
    const exercise = await Exercise.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!exercise) {
      return res.status(404).json({ message: "Exercise not found." });
    }

    res.status(200).json(exercise);
  } catch (error) {
    next(error);
  }
};

// PUT /api/exercises/:id
const updateExercise = async (req, res, next) => {
  try {
    const exercise = await Exercise.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!exercise) {
      return res.status(404).json({ message: "Exercise not found." });
    }

    const updated = await Exercise.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res
      .status(200)
      .json({ message: "Exercise updated successfully.", exercise: updated });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/exercises/:id
const deleteExercise = async (req, res, next) => {
  try {
    let query = { _id: req.params.id };

    if (req.user.role !== "admin") {
      query.user = req.user.id;
    }

    const exercise = await Exercise.findOneAndDelete(query);

    if (!exercise) {
      return res.status(404).json({ message: "Exercise not found." });
    }

    res.status(200).json({ message: "Exercise deleted successfully." });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createExercise,
  getExercises,
  getExerciseById,
  updateExercise,
  deleteExercise,
};
