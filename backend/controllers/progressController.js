const Progress = require("../models/Progress");

// POST /api/progress
const createProgress = async (req, res, next) => {
  try {
    const progress = await Progress.create({
      ...req.body,
      user: req.user.id,
    });

    res
      .status(201)
      .json({ message: "Progress entry created successfully.", progress });
  } catch (error) {
    next(error);
  }
};

// GET /api/progress
const getProgress = async (req, res, next) => {
  try {
    const progress = await Progress.find({ user: req.user.id }).sort({
      date: -1,
    });
    res.status(200).json(progress);
  } catch (error) {
    next(error);
  }
};

// GET /api/progress/:id
const getProgressById = async (req, res, next) => {
  try {
    const progress = await Progress.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!progress) {
      return res.status(404).json({ message: "Progress entry not found." });
    }

    res.status(200).json(progress);
  } catch (error) {
    next(error);
  }
};

// PUT /api/progress/:id
const updateProgress = async (req, res, next) => {
  try {
    const progress = await Progress.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!progress) {
      return res.status(404).json({ message: "Progress entry not found." });
    }

    const updated = await Progress.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      message: "Progress entry updated successfully.",
      progress: updated,
    });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/progress/:id
const deleteProgress = async (req, res, next) => {
  try {
    let query = { _id: req.params.id };

    if (req.user.role !== "admin") {
      query.user = req.user.id;
    }

    const progress = await Progress.findOneAndDelete(query);

    if (!progress) {
      return res.status(404).json({ message: "Progress entry not found." });
    }

    res.status(200).json({ message: "Progress entry deleted successfully." });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createProgress,
  getProgress,
  getProgressById,
  updateProgress,
  deleteProgress,
};
