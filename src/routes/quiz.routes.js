const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/auth.middleware");
const roleMiddleware = require("../middleware/role.middleware");
const validationMiddleware = require("../middleware/validation.middleware");

const {
    createQuizSchema,
    updateQuizSchema,
    createQuestionSchema,
    updateQuestionSchema,
    submitQuizSchema,
} = require("../validations/quiz.validation");

const {
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
} = require("../controller/quiz.controller");

/**
 * @swagger
 * /api/quizzes:
 *   post:
 *     summary: Quiz yaratish (Admin)
 *     tags:
 *       - Quiz
 *     security:
 *       - bearerAuth: []
 */
router.post(
    "/",
    authMiddleware,
    roleMiddleware("SUPER_ADMIN", "ADMIN"),
    validationMiddleware(createQuizSchema),
    createQuiz,
);

/**
 * @swagger
 * /api/quizzes:
 *   get:
 *     summary: Barcha quizlarni olish
 *     tags:
 *       - Quiz
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: course_id
 *         required: false
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Quizlar ro'yxati
 */
router.get(
    "/",
    authMiddleware,
    getAllQuizzes,
);

/**
 * @swagger
 * /api/quizzes/{id}:
 *   get:
 *     summary: Bitta quizni olish
 *     tags:
 *       - Quiz
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 */
router.get(
    "/:id",
    authMiddleware,
    getQuizById,
);

/**
 * @swagger
 * /api/quizzes/{id}:
 *   put:
 *     summary: Quizni yangilash (Admin)
 *     tags:
 *       - Quiz
 *     security:
 *       - bearerAuth: []
 */
router.put(
    "/:id",
    authMiddleware,
    roleMiddleware("SUPER_ADMIN", "ADMIN"),
    validationMiddleware(updateQuizSchema),
    updateQuiz,
);

/**
 * @swagger
 * /api/quizzes/{id}:
 *   delete:
 *     summary: Quizni o'chirish (Admin)
 *     tags:
 *       - Quiz
 *     security:
 *       - bearerAuth: []
 */
router.delete(
    "/:id",
    authMiddleware,
    roleMiddleware("SUPER_ADMIN", "ADMIN"),
    deleteQuiz,
);

/**
 * @swagger
 * /api/quizzes/questions:
 *   post:
 *     summary: Quizga savol qo'shish (Admin)
 *     tags:
 *       - Quiz Questions
 *     security:
 *       - bearerAuth: []
 */
router.post(
    "/questions",
    authMiddleware,
    roleMiddleware("SUPER_ADMIN", "ADMIN"),
    validationMiddleware(createQuestionSchema),
    createQuestion,
);

/**
 * @swagger
 * /api/quizzes/{quizId}/questions:
 *   get:
 *     summary: Quiz savollarini olish
 *     tags:
 *       - Quiz Questions
 *     security:
 *       - bearerAuth: []
 */
router.get(
    "/:quizId/questions",
    authMiddleware,
    getQuizQuestions,
);

/**
 * @swagger
 * /api/quizzes/questions/{id}:
 *   put:
 *     summary: Quiz savolini yangilash (Admin)
 *     tags:
 *       - Quiz Questions
 *     security:
 *       - bearerAuth: []
 */
router.put(
    "/questions/:id",
    authMiddleware,
    roleMiddleware("SUPER_ADMIN", "ADMIN"),
    validationMiddleware(updateQuestionSchema),
    updateQuestion,
);

/**
 * @swagger
 * /api/quizzes/questions/{id}:
 *   delete:
 *     summary: Quiz savolini o'chirish (Admin)
 *     tags:
 *       - Quiz Questions
 *     security:
 *       - bearerAuth: []
 */
router.delete(
    "/questions/:id",
    authMiddleware,
    roleMiddleware("SUPER_ADMIN", "ADMIN"),
    deleteQuestion,
);

/**
 * @swagger
 * /api/quizzes/{quizId}/submit:
 *   post:
 *     summary: Quizni topshirish
 *     tags:
 *       - Quiz
 *     security:
 *       - bearerAuth: []
 */
router.post(
    "/:quizId/submit",
    authMiddleware,
    validationMiddleware(submitQuizSchema),
    submitQuiz,
);

/**
 * @swagger
 * /api/quizzes/{quizId}/results:
 *   get:
 *     summary: O'z quiz natijalarimni olish
 *     tags:
 *       - Quiz
 *     security:
 *       - bearerAuth: []
 */
router.get(
    "/:quizId/results",
    authMiddleware,
    getMyQuizResults,
);

module.exports = router;