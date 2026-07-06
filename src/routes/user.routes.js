const express = require("express");
const router = express.Router();

const { getAllUsers,getUserById,getProfile } = require("../controller/user.controller");

const authMiddleware = require("../middleware/auth.middleware");
const roleMiddleware = require("../middleware/role.middleware");
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
router.get(
    "/profile",
    authMiddleware,
    getProfile
);
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
    getAllUsers
);
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
    getUserById
);

module.exports = router;