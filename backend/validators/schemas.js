const Joi = require("joi");

const registerSchema = Joi.object({
  username: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid("user", "admin").optional(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const updateProfileSchema = Joi.object({
  username: Joi.string().min(3).max(30).optional(),
  email: Joi.string().email().optional(),
  age: Joi.number().integer().min(1).max(150).optional().allow(null),
  weight: Joi.number().min(1).max(500).optional().allow(null),
  height: Joi.number().min(1).max(300).optional().allow(null),
});

const workoutSchema = Joi.object({
  title: Joi.string().min(1).max(100).required(),
  description: Joi.string().max(500).optional().allow(""),
  type: Joi.string()
    .valid("cardio", "strength", "flexibility", "balance", "other")
    .optional(),
  duration: Joi.number().min(1).required(),
  caloriesBurned: Joi.number().min(0).optional(),
  date: Joi.date().optional(),
  status: Joi.string().valid("planned", "completed", "skipped").optional(),
});

const exerciseSchema = Joi.object({
  name: Joi.string().min(1).max(100).required(),
  category: Joi.string()
    .valid("cardio", "strength", "flexibility", "balance", "other")
    .optional(),
  sets: Joi.number().integer().min(0).optional(),
  reps: Joi.number().integer().min(0).optional(),
  weight: Joi.number().min(0).optional(),
  duration: Joi.number().min(0).optional(),
  notes: Joi.string().max(500).optional().allow(""),
  date: Joi.date().optional(),
});

const goalSchema = Joi.object({
  title: Joi.string().min(1).max(100).required(),
  description: Joi.string().max(500).optional().allow(""),
  targetValue: Joi.number().min(0).required(),
  currentValue: Joi.number().min(0).optional(),
  unit: Joi.string().min(1).max(50).required(),
  deadline: Joi.date().required(),
  status: Joi.string().valid("active", "completed", "failed").optional(),
});

const progressSchema = Joi.object({
  date: Joi.date().optional(),
  weight: Joi.number().min(1).max(500).optional().allow(null),
  bodyFat: Joi.number().min(0).max(100).optional().allow(null),
  notes: Joi.string().max(500).optional().allow(""),
  mood: Joi.string()
    .valid("great", "good", "okay", "bad", "terrible")
    .optional(),
});

module.exports = {
  registerSchema,
  loginSchema,
  updateProfileSchema,
  workoutSchema,
  exerciseSchema,
  goalSchema,
  progressSchema,
};
