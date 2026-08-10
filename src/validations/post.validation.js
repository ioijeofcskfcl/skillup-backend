const Joi = require("joi");

const createPostSchema = Joi.object({
    title: Joi.string().min(3).max(200).required(),
    content: Joi.string().min(1).required(),
    image_url: Joi.string().uri().allow("", null),
});

const updatePostSchema = Joi.object({
    title: Joi.string().min(3).max(200),
    content: Joi.string().min(1),
    image_url: Joi.string().uri().allow("", null),
}).min(1);

module.exports = {
    createPostSchema,
    updatePostSchema,
};