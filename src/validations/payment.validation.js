const Joi = require("joi");

const createPaymentSchema = Joi.object({
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

    payment_method: Joi.string()
        .valid("CLICK", "PAYME", "VISA")
        .required()
        .messages({
            "string.empty": "To'lov usuli tanlanishi shart.",
            "any.only":
                "To'lov usuli faqat CLICK, PAYME yoki VISA bo'lishi mumkin.",
            "any.required": "To'lov usuli tanlanishi shart.",
        }),
});

module.exports = {
    createPaymentSchema,
};