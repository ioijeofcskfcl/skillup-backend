const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/auth.middleware");
const validationMiddleware = require("../middleware/validation.middleware");

const {
    updateProgressSchema,
} = require("../validations/progress.validation");

const {
    updateProgress,
    getCourseProgress,
} = require("../controller/progress.controller");
/**
 * @swagger
 * /api/progress/course/{courseId}:
 *   get:
 *     summary: Kurs progressini olish
 *     tags:
 *       - Progress
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Kurs progressi
 */
router.get(
    "/course/:courseId",
    authMiddleware,
    getCourseProgress,
);
/**
 * @swagger
 * /api/progress/{videoId}:
 *   patch:
 *     summary: Video progressini yangilash
 *     tags:
 *       - Progress
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: videoId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - is_watched
 *             properties:
 *               is_watched:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Progress yangilandi
 */
router.patch(
    "/:videoId",
    authMiddleware,
    validationMiddleware(updateProgressSchema),
    updateProgress,
);



module.exports = router;