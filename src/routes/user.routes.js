const express = require("express");
const router = express.Router();

const {
    getAllUsers,
    getUserById,
    getProfile,
    updateProfile,
    changePassword,
    getMyCourses,
} = require("../controller/user.controller");

const authMiddleware = require("../middleware/auth.middleware");
const roleMiddleware = require("../middleware/role.middleware");
const validationMiddleware = require("../middleware/validation.middleware");
const {
    updateProfileSchema,
    changePasswordSchema,
} = require("../validations/user.validation");
/**
 * @swagger
 * /api/users/profile:
 *   get:
 *     summary: O'z profilini olish
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profil ma'lumotlari
 *       401:
 *         description: Token mavjud emas yoki noto'g'ri
 */
router.get("/profile", authMiddleware, getProfile);
/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Barcha foydalanuvchilarni olish
 *     tags:
 *       - User
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
 *         description: Har bir sahifadagi foydalanuvchilar soni
 *       - in: query
 *         name: search
 *         required: false
 *         schema:
 *           type: string
 *         description: Fullname yoki email bo'yicha qidirish
 *       - in: query
 *         name: role
 *         required: false
 *         schema:
 *           type: string
 *           enum: [USER, ADMIN, SUPER_ADMIN]
 *         description: Role bo'yicha filter
 *       - in: query
 *         name: is_active
 *         required: false
 *         schema:
 *           type: boolean
 *         description: Faol yoki faol bo'lmagan foydalanuvchilarni filterlash
 *     responses:
 *       200:
 *         description: Foydalanuvchilar ro'yxati muvaffaqiyatli olindi
 *       401:
 *         description: Token mavjud emas yoki noto'g'ri
 */
router.get(
    "/",
    authMiddleware,
    roleMiddleware("ADMIN", "SUPER_ADMIN"),
    getAllUsers,
);
/**
 * @swagger
 * /api/users/my-courses:
 *   get:
 *     summary: Foydalanuvchining sotib olgan kurslari
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Kurslar muvaffaqiyatli olindi
 *       401:
 *         description: Token noto'g'ri
 */
router.get("/my-courses", authMiddleware, getMyCourses);
/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: ID bo'yicha foydalanuvchini olish
 *     tags:
 *       - User
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
 *         description: Foydalanuvchi topildi
 *       404:
 *         description: Foydalanuvchi topilmadi
 */
router.get(
    "/:id",
    authMiddleware,
    roleMiddleware("ADMIN", "SUPER_ADMIN"),
    getUserById,
);
/**
 * @swagger
 * /api/users/profile:
 *   put:
 *     summary: O'z profilini yangilash
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - fullname
 *               - email
 *             properties:
 *               fullname:
 *                 type: string
 *                 example: Ogabek Jumanazarov
 *               email:
 *                 type: string
 *                 example: ogabek@gmail.com
 *     responses:
 *       200:
 *         description: Profil muvaffaqiyatli yangilandi
 *       401:
 *         description: Token noto'g'ri
 *       409:
 *         description: Email band
 */
router.put(
    "/profile",
    authMiddleware,
    validationMiddleware(updateProfileSchema),
    updateProfile,
);
/**
 * @swagger
 * /api/users/change-password:
 *   put:
 *     summary: Parolni o'zgartirish
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - oldPassword
 *               - newPassword
 *               - confirmPassword
 *             properties:
 *               oldPassword:
 *                 type: string
 *                 example: Ogabek123$
 *               newPassword:
 *                 type: string
 *                 example: Ogabek456$
 *               confirmPassword:
 *                 type: string
 *                 example: Ogabek456$
 *     responses:
 *       200:
 *         description: Parol muvaffaqiyatli yangilandi
 *       400:
 *         description: Eski parol noto'g'ri yoki yangi parollar mos emas
 *       401:
 *         description: Token noto'g'ri
 */
router.put(
    "/change-password",
    authMiddleware,
    validationMiddleware(changePasswordSchema),
    changePassword,
);

module.exports = router;
