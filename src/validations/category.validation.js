const Joi = require("joi");

const createCategorySchema = Joi.object({
    name: Joi.string()
        .trim()
        .min(2)
        .max(100)
        .required()
        .messages({
            "string.empty": "Kategoriya nomi kiritilishi shart.",
            "string.min":
                "Kategoriya nomi kamida 2 ta belgidan iborat bo'lishi kerak.",
            "string.max":
                "Kategoriya nomi 100 ta belgidan oshmasligi kerak.",
            "any.required": "Kategoriya nomi kiritilishi shart.",
        }),
        icon: Joi.string().max(50).optional()
});

const updateCategorySchema = Joi.object({
    name: Joi.string()
        .trim()
        .min(2)
        .max(100)
        .required()
        .messages({
            "string.empty": "Kategoriya nomi kiritilishi shart.",
            "string.min":
                "Kategoriya nomi kamida 2 ta belgidan iborat bo'lishi kerak.",
            "string.max":
                "Kategoriya nomi 100 ta belgidan oshmasligi kerak.",
            "any.required": "Kategoriya nomi kiritilishi shart.",
        }),
        icon: Joi.string().max(50).optional()
});

module.exports = {
    createCategorySchema,
    updateCategorySchema,
};