const Joi = require("joi");

const getCertificateSchema = Joi.object({
    courseId: Joi.string().uuid().required(),
});

module.exports = {
    getCertificateSchema,
};