const Joi = require("joi");

const passwordRule =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

const registerSchema = Joi.object({
    fullname: Joi.string()
        .trim()
        .min(3)
        .max(100)
        .required()
        .messages({
            "string.empty": "Ism-familiya kiritilishi shart.",
            "string.min": "Ism-familiya kamida 3 ta belgidan iborat bo'lishi kerak.",
            "string.max": "Ism-familiya 100 ta belgidan oshmasligi kerak.",
            "any.required": "Ism-familiya kiritilishi shart.",
        }),

    email: Joi.string()
        .trim()
        .email()
        .required()
        .messages({
            "string.empty": "Email kiritilishi shart.",
            "string.email": "Email formati noto'g'ri.",
            "any.required": "Email kiritilishi shart.",
        }),

    password: Joi.string()
        .pattern(passwordRule)
        .required()
        .messages({
            "string.empty": "Parol kiritilishi shart.",
            "string.pattern.base":
                "Parol kamida 8 ta belgidan iborat bo'lishi, kamida 1 ta katta harf, 1 ta kichik harf, 1 ta raqam va 1 ta maxsus belgi (@$!%*?&) qatnashishi kerak.",
            "any.required": "Parol kiritilishi shart.",
        }),
});

const loginSchema = Joi.object({
    email: Joi.string()
        .trim()
        .email()
        .required()
        .messages({
            "string.empty": "Email kiritilishi shart.",
            "string.email": "Email formati noto'g'ri.",
            "any.required": "Email kiritilishi shart.",
        }),

    password: Joi.string()
        .required()
        .messages({
            "string.empty": "Parol kiritilishi shart.",
            "any.required": "Parol kiritilishi shart.",
        }),
});

const forgotPasswordSchema = Joi.object({
    email: Joi.string()
        .trim()
        .email()
        .required()
        .messages({
            "string.empty": "Email kiritilishi shart.",
            "string.email": "Email formati noto'g'ri.",
            "any.required": "Email kiritilishi shart.",
        }),
});

const resetPasswordSchema = Joi.object({
    token: Joi.string()
        .required()
        .messages({
            "string.empty": "Token kiritilishi shart.",
            "any.required": "Token kiritilishi shart.",
        }),

    password: Joi.string()
        .pattern(passwordRule)
        .required()
        .messages({
            "string.empty": "Yangi parol kiritilishi shart.",
            "string.pattern.base":
                "Parol kamida 8 ta belgidan iborat bo'lishi, kamida 1 ta katta harf, 1 ta kichik harf, 1 ta raqam va 1 ta maxsus belgi (@$!%*?&) qatnashishi kerak.",
            "any.required": "Yangi parol kiritilishi shart.",
        }),
});

module.exports = {
    registerSchema,
    loginSchema,
    forgotPasswordSchema,
    resetPasswordSchema,
};