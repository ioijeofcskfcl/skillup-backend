const Joi = require("joi");

const createVideoSchema = Joi.object({
    course_id: Joi.string()
        .guid({
            version: ["uuidv4", "uuidv5"],
        })
        .required()
        .messages({
            "string.empty": "Kurs tanlanishi shart.",
            "string.guid": "Kurs ID noto'g'ri.",
            "any.required": "Kurs tanlanishi shart.",
        }),

    title: Joi.string()
        .trim()
        .min(3)
        .max(255)
        .required()
        .messages({
            "string.empty": "Video nomi kiritilishi shart.",
            "string.min":
                "Video nomi kamida 3 ta belgidan iborat bo'lishi kerak.",
            "string.max":
                "Video nomi 255 ta belgidan oshmasligi kerak.",
            "any.required": "Video nomi kiritilishi shart.",
        }),

    duration: Joi.number()
        .integer()
        .positive()
        .required()
        .messages({
            "number.base": "Video davomiyligi raqam bo'lishi kerak.",
            "number.integer": "Davomiylik butun son bo'lishi kerak.",
            "number.positive":
                "Davomiylik 0 dan katta bo'lishi kerak.",
            "any.required":
                "Video davomiyligi kiritilishi shart.",
        }),

    order_number: Joi.number()
        .integer()
        .min(1)
        .required()
        .messages({
            "number.base":
                "Tartib raqami raqam bo'lishi kerak.",
            "number.integer":
                "Tartib raqami butun son bo'lishi kerak.",
            "number.min":
                "Tartib raqami 1 dan kichik bo'lishi mumkin emas.",
            "any.required":
                "Tartib raqami kiritilishi shart.",
        }),
});

const updateVideoSchema = Joi.object({
    course_id: Joi.string()
        .guid({
            version: ["uuidv4", "uuidv5"],
        })
        .optional()
        .messages({
            "string.guid": "Kurs ID noto'g'ri.",
        }),

    title: Joi.string()
        .trim()
        .min(3)
        .max(255)
        .optional()
        .messages({
            "string.empty":
                "Video nomi bo'sh bo'lishi mumkin emas.",
            "string.min":
                "Video nomi kamida 3 ta belgidan iborat bo'lishi kerak.",
            "string.max":
                "Video nomi 255 ta belgidan oshmasligi kerak.",
        }),

    video_url: Joi.string()
        .uri()
        .optional()
        .messages({
            "string.uri": "Video URL noto'g'ri.",
        }),

    duration: Joi.number()
        .integer()
        .positive()
        .optional()
        .messages({
            "number.base":
                "Video davomiyligi raqam bo'lishi kerak.",
            "number.integer":
                "Davomiylik butun son bo'lishi kerak.",
            "number.positive":
                "Davomiylik 0 dan katta bo'lishi kerak.",
        }),

    order_number: Joi.number()
        .integer()
        .min(1)
        .optional()
        .messages({
            "number.base":
                "Tartib raqami raqam bo'lishi kerak.",
            "number.integer":
                "Tartib raqami butun son bo'lishi kerak.",
            "number.min":
                "Tartib raqami 1 dan kichik bo'lishi mumkin emas.",
        }),
});

module.exports = {
    createVideoSchema,
    updateVideoSchema,
};