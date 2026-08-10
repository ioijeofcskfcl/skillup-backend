const Joi = require("joi");

const updateProgressSchema = Joi.object({
    is_watched: Joi.boolean().required(),
});

module.exports = {
    updateProgressSchema,
};