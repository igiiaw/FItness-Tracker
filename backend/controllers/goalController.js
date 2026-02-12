const Goal = require("../models/Goal");

// POST /api/goals
const createGoal = async (req, res, next) => {
  try {
    const goal = await Goal.create({
      ...req.body,
      user: req.user.id,
    });

    res.status(201).json({ message: "Goal created successfully.", goal });
  } catch (error) {
    next(error);
  }
};

// GET /api/goals
const getGoals = async (req, res, next) => {
  try {
    const goals = await Goal.find({ user: req.user.id }).sort({
      deadline: 1,
    });
    res.status(200).json(goals);
  } catch (error) {
    next(error);
  }
};

// GET /api/goals/:id
const getGoalById = async (req, res, next) => {
  try {
    const goal = await Goal.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!goal) {
      return res.status(404).json({ message: "Goal not found." });
    }

    res.status(200).json(goal);
  } catch (error) {
    next(error);
  }
};

// PUT /api/goals/:id
const updateGoal = async (req, res, next) => {
  try {
    const goal = await Goal.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!goal) {
      return res.status(404).json({ message: "Goal not found." });
    }

    const updated = await Goal.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res
      .status(200)
      .json({ message: "Goal updated successfully.", goal: updated });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/goals/:id
const deleteGoal = async (req, res, next) => {
  try {
    let query = { _id: req.params.id };

    if (req.user.role !== "admin") {
      query.user = req.user.id;
    }

    const goal = await Goal.findOneAndDelete(query);

    if (!goal) {
      return res.status(404).json({ message: "Goal not found." });
    }

    res.status(200).json({ message: "Goal deleted successfully." });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createGoal,
  getGoals,
  getGoalById,
  updateGoal,
  deleteGoal,
};
