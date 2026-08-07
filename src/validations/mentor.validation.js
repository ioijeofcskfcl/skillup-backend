const Joi = require("joi");

const createMentorSchema = Joi.object({
    fullname: Joi.string()
        .max(100)
        .required(),

    profession: Joi.string()
        .max(150)
        .allow("", null)
        .optional(),

    bio: Joi.string()
        .allow("", null)
        .optional(),

    image_url: Joi.string()
        .allow("", null)
        .optional(),
});

const updateMentorSchema = Joi.object({
    fullname: Joi.string()
        .max(100)
        .optional(),

    profession: Joi.string()
        .max(150)
        .allow("", null)
        .optional(),

    bio: Joi.string()
        .allow("", null)
        .optional(),

    image_url: Joi.string()
        .allow("", null)
        .optional(),
}).min(1);

module.exports = {
    createMentorSchema,
    updateMentorSchema,
};