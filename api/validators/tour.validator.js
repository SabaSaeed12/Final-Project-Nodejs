const Joi = require("joi");
const addTourSchema = Joi.object({
    name: Joi.string().required(),
    description: Joi.string().required(),
    images: Joi.array().items(Joi.string()), // Assumes images is an array of strings
    price: Joi.number(),
    destinations: Joi.array().items(Joi.string()).max(3),
    itinerary: Joi.array().items(Joi.string()).max(3),
    duration: Joi.number().required(),
    numberOfPeople: Joi.number().required(),
    startingDate: Joi.date().required(),
    endingDate: Joi.date().required(),
    status: Joi.string().valid('ACTIVE', 'INACTIVE').default('ACTIVE'),
    isDeleted: Joi.boolean().default(false),
  });
  const tourIdSchema = Joi.object({
    tourId:Joi.string().hex().length(24)
  });
  const bookingIdSchema = Joi.object({
    bookingId:Joi.string().hex().length(24)
  })

  module.exports = {
    addTourSchema,
    tourIdSchema,
    bookingIdSchema
    
  };