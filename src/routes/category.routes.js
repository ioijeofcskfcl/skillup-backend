const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/auth.middleware");
const roleMiddleware = require("../middleware/role.middleware");

const {
    createCategory,
    getAllCategories,
    getCategoryById,
    updateCategory,
    deleteCategory,
} = require("../controller/category.controller");
const validationMiddleware = require("../middleware/validation.middleware");

const {
    createCategorySchema,
    updateCategorySchema,
} = require("../validations/category.validation");
/**
 * @swagger
 * /api/categories:
 *   post:
 *     summary: Yangi kategoriya yaratish
 *     tags:
 *       - Category
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: Dasturlash
 *               icon:
 *                 type: string
 *                 example: code
 *                 description: Kategoriya ikonkasining nomi
 *     responses:
 *       201:
 *         description: Kategoriya yaratildi
 */
router.post(
    "/",
    authMiddleware,
    roleMiddleware("ADMIN"),
    validationMiddleware(createCategorySchema),
    createCategory
);

/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: Barcha kategoriyalarni olish
 *     tags:
 *       - Category
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Sahifa raqami
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Har bir sahifadagi kategoriyalar soni
 *     responses:
 *       200:
 *         description: Kategoriyalar ro'yxati muvaffaqiyatli olindi
 *       401:
 *         description: Token mavjud emas yoki noto'g'ri
 */
router.get(
    "/",
    authMiddleware,
    getAllCategories
);
/**
 * @swagger
 * /api/categories/{id}:
 *   get:
 *     summary: ID bo'yicha kategoriyani olish
 *     tags:
 *       - Category
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Category topildi
 *       404:
 *         description: Category topilmadi
 */
router.get(
    "/:id",
    authMiddleware,
    getCategoryById,
    
);
/**
 * @swagger
 * /api/categories/{id}:
 *   put:
 *     summary: Kategoriyani yangilash
 *     tags:
 *       - Category
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
 *               name:
 *                 type: string
 *                 example: Backend Development
 *               icon:
 *                 type: string
 *                 example: code
 *                 description: Kategoriya ikonkasining nomi
 *     responses:
 *       200:
 *         description: Kategoriya muvaffaqiyatli yangilandi
 */
router.put(
    "/:id",
    authMiddleware,
    roleMiddleware("ADMIN"),
    validationMiddleware(updateCategorySchema),
    updateCategory
);
/**
 * @swagger
 * /api/categories/{id}:
 *   delete:
 *     summary: Kategoriyani o'chirish
 *     tags:
 *       - Category
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Kategoriya muvaffaqiyatli o'chirildi
 *       404:
 *         description: Kategoriya topilmadi
 */
router.delete(
    "/:id",
    authMiddleware,
    roleMiddleware("ADMIN"),
    deleteCategory,

);
module.exports = router;