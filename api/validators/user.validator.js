const Joi = require("joi");

const addUserSchema = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  age: Joi.string().min(1).max(3).required(),
  email: Joi.string().email().required(),
  password: Joi.string().required().min(8),
  phoneNumber: Joi.string().length(11).required(),
  address: Joi.string(),
  gender: Joi.string().valid("MALE", "FEMALE", "OTHER").required(),
  status: Joi.string().valid("ACTIVE", "INACTIVE").required(),
  isDeleted: Joi.boolean().default(false),
  userProfile: Joi.string(),
});
const loginUserSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});
const updateUserSchema = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  phoneNumber: Joi.string().length(11).required(),
});

const userIdSchema = Joi.object({
  userId: Joi.string().hex().length(24),
});

module.exports = {
  addUserSchema,
  loginUserSchema,
  userIdSchema,
  updateUserSchema
};
