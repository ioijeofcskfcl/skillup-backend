const quizService = require("../services/quiz.service");

const createQuiz = async (req, res, next) => {
    try {
        const quiz = await quizService.createQuiz({
            course_id: req.body.course_id,
            title: req.body.title,
            description: req.body.description,
        });

        return res.status(201).json({
            success: true,
            message: "Quiz muvaffaqiyatli yaratildi.",
            data: quiz,
        });
    } catch (error) {
        next(error);
    }
};

const getAllQuizzes = async (req, res, next) => {
    try {
        const quizzes = await quizService.getAllQuizzes(
            req.query.course_id || "",
        );

        return res.status(200).json({
            success: true,
            data: quizzes,
        });
    } catch (error) {
        next(error);
    }
};

const getQuizById = async (req, res, next) => {
    try {
        const quiz = await quizService.getQuizById(
            req.params.id,
        );

        return res.status(200).json({
            success: true,
            data: quiz,
        });
    } catch (error) {
        next(error);
    }
};

const updateQuiz = async (req, res, next) => {
    try {
        const quiz = await quizService.updateQuiz(
            req.params.id,
            req.body,
        );

        return res.status(200).json({
            success: true,
            message: "Quiz muvaffaqiyatli yangilandi.",
            data: quiz,
        });
    } catch (error) {
        next(error);
    }
};

const deleteQuiz = async (req, res, next) => {
    try {
        await quizService.deleteQuiz(req.params.id);

        return res.status(200).json({
            success: true,
            message: "Quiz muvaffaqiyatli o'chirildi.",
        });
    } catch (error) {
        next(error);
    }
};

const createQuestion = async (req, res, next) => {
    try {
        const question = await quizService.createQuestion({
            quiz_id: req.body.quiz_id,
            question: req.body.question,
            option_a: req.body.option_a,
            option_b: req.body.option_b,
            option_c: req.body.option_c,
            option_d: req.body.option_d,
            correct_answer: req.body.correct_answer,
        });

        return res.status(201).json({
            success: true,
            message: "Savol muvaffaqiyatli yaratildi.",
            data: question,
        });
    } catch (error) {
        next(error);
    }
};

const getQuizQuestions = async (req, res, next) => {
    try {
        const questions = await quizService.getQuizQuestions(
            req.params.quizId,
        );

        return res.status(200).json({
            success: true,
            data: questions,
        });
    } catch (error) {
        next(error);
    }
};

const updateQuestion = async (req, res, next) => {
    try {
        const question = await quizService.updateQuestion(
            req.params.id,
            req.body,
        );

        return res.status(200).json({
            success: true,
            message: "Savol muvaffaqiyatli yangilandi.",
            data: question,
        });
    } catch (error) {
        next(error);
    }
};

const deleteQuestion = async (req, res, next) => {
    try {
        await quizService.deleteQuestion(req.params.id);

        return res.status(200).json({
            success: true,
            message: "Savol muvaffaqiyatli o'chirildi.",
        });
    } catch (error) {
        next(error);
    }
};

const submitQuiz = async (req, res, next) => {
    try {
        const result = await quizService.submitQuiz(
            req.user.id,
            req.params.quizId,
            req.body.answers,
        );

        return res.status(200).json({
            success: true,
            message: "Quiz muvaffaqiyatli topshirildi.",
            data: result,
        });
    } catch (error) {
        next(error);
    }
};

const getMyQuizResults = async (req, res, next) => {
    try {
        const results = await quizService.getMyQuizResults(
            req.user.id,
            req.params.quizId,
        );

        return res.status(200).json({
            success: true,
            data: results,
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createQuiz,
    getAllQuizzes,
    getQuizById,
    updateQuiz,
    deleteQuiz,
    createQuestion,
    getQuizQuestions,
    updateQuestion,
    deleteQuestion,
    submitQuiz,
    getMyQuizResults,
};