const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/auth.middleware");
const validationMiddleware = require("../middleware/validation.middleware");

const {
    createPostSchema,
    updatePostSchema,
} = require("../validations/post.validation");

const {
    createPost,
    getAllPosts,
    getPostById,
    updatePost,
    deletePost,
} = require("../controller/post.controller");

/**
 * @swagger
 * /api/posts:
 *   post:
 *     summary: Yangi post yaratish
 *     tags:
 *       - Community
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - content
 *             properties:
 *               title:
 *                 type: string
 *                 example: Node.js haqida
 *               content:
 *                 type: string
 *                 example: Node.js backend juda qiziq.
 *               image_url:
 *                 type: string
 *                 example: https://example.com/image.jpg
 *     responses:
 *       201:
 *         description: Post muvaffaqiyatli yaratildi
 *       400:
 *         description: Noto'g'ri ma'lumot
 *       401:
 *         description: Token mavjud emas yoki noto'g'ri
 */
router.post(
    "/",
    authMiddleware,
    validationMiddleware(createPostSchema),
    createPost,
);

/**
 * @swagger
 * /api/posts:
 *   get:
 *     summary: Barcha postlarni olish
 *     tags:
 *       - Community
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: Postlar ro'yxati
 *       401:
 *         description: Token mavjud emas yoki noto'g'ri
 */
router.get(
    "/",
    authMiddleware,
    getAllPosts,
);

/**
 * @swagger
 * /api/posts/{id}:
 *   get:
 *     summary: Bitta postni olish
 *     tags:
 *       - Community
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Post topildi
 *       401:
 *         description: Token mavjud emas yoki noto'g'ri
 *       404:
 *         description: Post topilmadi
 */
router.get(
    "/:id",
    authMiddleware,
    getPostById,
);

/**
 * @swagger
 * /api/posts/{id}:
 *   put:
 *     summary: Postni yangilash
 *     tags:
 *       - Community
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               image_url:
 *                 type: string
 *     responses:
 *       200:
 *         description: Post muvaffaqiyatli yangilandi
 *       401:
 *         description: Token mavjud emas yoki noto'g'ri
 *       403:
 *         description: Bu postni o'zgartirishga ruxsat yo'q
 *       404:
 *         description: Post topilmadi
 */
router.put(
    "/:id",
    authMiddleware,
    validationMiddleware(updatePostSchema),
    updatePost,
);

/**
 * @swagger
 * /api/posts/{id}:
 *   delete:
 *     summary: Postni o'chirish
 *     tags:
 *       - Community
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Post muvaffaqiyatli o'chirildi
 *       401:
 *         description: Token mavjud emas yoki noto'g'ri
 *       403:
 *         description: Bu postni o'chirishga ruxsat yo'q
 *       404:
 *         description: Post topilmadi
 */
router.delete(
    "/:id",
    authMiddleware,
    deletePost,
);

module.exports = router;