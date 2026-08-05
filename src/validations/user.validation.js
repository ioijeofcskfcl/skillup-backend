const Joi = require("joi");

const updateProfileSchema = Joi.object({
    fullname: Joi.string().min(3).max(100).required().messages({
        "string.empty": "Ism familiya kiritilishi shart.",
        "string.min":
            "Ism familiya kamida 3 ta belgidan iborat bo'lishi kerak.",
        "string.max": "Ism familiya 100 ta belgidan oshmasligi kerak.",
        "any.required": "Ism familiya majburiy.",
    }),

    email: Joi.string().email().required().messages({
        "string.empty": "Email kiritilishi shart.",
        "string.email": "Email noto'g'ri formatda.",
        "any.required": "Email majburiy.",
    }),
});

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

const changePasswordSchema = Joi.object({
    oldPassword: Joi.string().required().messages({
        "string.empty": "Eski parolni kiriting.",
        "any.required": "Eski parol majburiy.",
    }),

    newPassword: Joi.string().pattern(passwordRegex).required().messages({
        "string.empty": "Yangi parolni kiriting.",
        "string.pattern.base":
            "Parol kamida 8 ta belgidan iborat bo'lishi, 1 ta katta harf, 1 ta kichik harf va 1 ta raqam qatnashishi kerak.",
        "any.required": "Yangi parol majburiy.",
    }),

    confirmPassword: Joi.any()
        .valid(Joi.ref("newPassword"))
        .required()
        .messages({
            "any.only": "Parollar mos emas.",
            "any.required": "Parolni tasdiqlang.",
        }),
});

module.exports = {
    updateProfileSchema,
    changePasswordSchema,
};
