const Joi = require("joi");

const createQuizSchema = Joi.object({
    course_id: Joi.string().uuid().required(),
    title: Joi.string().min(3).max(200).required(),
    description: Joi.string().allow("", null),
});

const updateQuizSchema = Joi.object({
    title: Joi.string().min(3).max(200),
    description: Joi.string().allow("", null),
}).min(1);

const createQuestionSchema = Joi.object({
    quiz_id: Joi.string().uuid().required(),
    question: Joi.string().min(1).required(),
    option_a: Joi.string().required(),
    option_b: Joi.string().required(),
    option_c: Joi.string().required(),
    option_d: Joi.string().required(),
    correct_answer: Joi.string().valid("A", "B", "C", "D").required(),
});

const updateQuestionSchema = Joi.object({
    question: Joi.string().min(1),
    option_a: Joi.string(),
    option_b: Joi.string(),
    option_c: Joi.string(),
    option_d: Joi.string(),
    correct_answer: Joi.string().valid("A", "B", "C", "D"),
}).min(1);

const submitQuizSchema = Joi.object({
    answers: Joi.array()
        .items(
            Joi.object({
                question_id: Joi.string().uuid().required(),
                answer: Joi.string()
                    .valid("A", "B", "C", "D")
                    .required(),
            }),
        )
        .min(1)
        .required(),
});

module.exports = {
    createQuizSchema,
    updateQuizSchema,
    createQuestionSchema,
    updateQuestionSchema,
    submitQuizSchema,
};