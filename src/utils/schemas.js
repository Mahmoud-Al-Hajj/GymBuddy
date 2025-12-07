import Joi from "joi";

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});
const registerSchema = Joi.object({
  username: Joi.string().min(3).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

const updateUserSchema = Joi.object({
  username: Joi.string().min(3).optional(),
  gender: Joi.string().valid("male", "female").optional(),
  age: Joi.number().integer().min(10).max(100).optional(),
  weight: Joi.number().positive().max(180).optional(),
  height: Joi.number().positive().max(250).optional(),
  weight_unit: Joi.string().valid("kg", "lbs").optional(),
  default_sets: Joi.number().integer().positive().optional(),
  default_reps: Joi.number().integer().positive().optional(),
  rest_timer: Joi.number().integer().positive().optional(),
}).min(1); // At least one field must be provided

const createWorkoutSchema = Joi.object({
  name: Joi.string().required(),
  date: Joi.date().optional(),
  exercises: Joi.array()
    .items(
      Joi.object({
        name: Joi.string().required(),
        sets: Joi.number().required(),
        reps: Joi.number().required(),
        weight: Joi.number().optional(),
      })
    )
    .required(),
});

const addExerciseSchema = Joi.object({
  name: Joi.string().required(),
  sets: Joi.number().positive().required(),
  reps: Joi.number().positive().required(),
  weight: Joi.number().positive().optional(),
});

const completeExerciseSchema = Joi.object({
  completed: Joi.boolean().required(),
});

export default {
  loginSchema,
  registerSchema,
  updateUserSchema,
  createWorkoutSchema,
  addExerciseSchema,
  completeExerciseSchema,
};
