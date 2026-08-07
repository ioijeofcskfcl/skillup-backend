const Joi = require("joi");

const createPricingSchema = Joi.object({
    title: Joi.string().max(100).required(),

    price: Joi.number()
        .positive()
        .required(),

    description: Joi.string()
        .allow("", null)
        .optional(),

    features: Joi.array()
        .items(Joi.string())
        .optional()
        .default([]),
});

const updatePricingSchema = Joi.object({
    title: Joi.string().max(100).optional(),

    price: Joi.number()
        .positive()
        .optional(),

    description: Joi.string()
        .allow("", null)
        .optional(),

    features: Joi.array()
        .items(Joi.string())
        .optional(),
}).min(1);

module.exports = {
    createPricingSchema,
    updatePricingSchema,
};