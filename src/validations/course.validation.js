const Joi = require("joi");

const createCourseSchema = Joi.object({
    category_id: Joi.string()
        .guid({
            version: ["uuidv4", "uuidv5"],
        })
        .required()
        .messages({
            "string.empty": "Kategoriya tanlanishi shart.",
            "string.guid": "Kategoriya ID noto'g'ri.",
            "any.required": "Kategoriya tanlanishi shart.",
        }),

    title: Joi.string()
        .trim()
        .min(3)
        .max(255)
        .required()
        .messages({
            "string.empty": "Kurs nomi kiritilishi shart.",
            "string.min":
                "Kurs nomi kamida 3 ta belgidan iborat bo'lishi kerak.",
            "string.max":
                "Kurs nomi 255 ta belgidan oshmasligi kerak.",
            "any.required": "Kurs nomi kiritilishi shart.",
        }),

    description: Joi.string()
        .trim()
        .min(10)
        .required()
        .messages({
            "string.empty": "Kurs tavsifi kiritilishi shart.",
            "string.min":
                "Kurs tavsifi kamida 10 ta belgidan iborat bo'lishi kerak.",
            "any.required": "Kurs tavsifi kiritilishi shart.",
        }),

    price: Joi.number()
        .min(0)
        .required()
        .messages({
            "number.base": "Narx raqam bo'lishi kerak.",
            "number.min": "Narx 0 dan kichik bo'lishi mumkin emas.",
            "any.required": "Narx kiritilishi shart.",
        }),
});

const updateCourseSchema = Joi.object({
    category_id: Joi.string()
        .guid({
            version: ["uuidv4", "uuidv5"],
        })
        .optional()
        .messages({
            "string.guid": "Kategoriya ID noto'g'ri.",
        }),

    title: Joi.string()
        .trim()
        .min(3)
        .max(255)
        .optional()
        .messages({
            "string.empty": "Kurs nomi bo'sh bo'lishi mumkin emas.",
            "string.min":
                "Kurs nomi kamida 3 ta belgidan iborat bo'lishi kerak.",
            "string.max":
                "Kurs nomi 255 ta belgidan oshmasligi kerak.",
        }),

    description: Joi.string()
        .trim()
        .min(10)
        .optional()
        .messages({
            "string.empty": "Kurs tavsifi bo'sh bo'lishi mumkin emas.",
            "string.min":
                "Kurs tavsifi kamida 10 ta belgidan iborat bo'lishi kerak.",
        }),

    price: Joi.number()
        .min(0)
        .optional()
        .messages({
            "number.base": "Narx raqam bo'lishi kerak.",
           "number.min": "Narx 0 dan kichik bo'lishi mumkin emas.",
        }),
});

module.exports = {
    createCourseSchema,
    updateCourseSchema,
};