const express = require("express");
const router = express.Router();

const { createAdmin, getAllAdmins,getAdminById,updateAdmin , deleteAdmin} = require("../controller/admin.controller");
const authMiddleware = require("../middleware/auth.middleware");
const roleMiddleware = require("../middleware/role.middleware");

/**
 * @swagger
 * /api/admins:
 *   post:
 *     summary: Yangi admin yaratish
 *     tags:
 *       - Admin
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
 *               - password
 *             properties:
 *               fullname:
 *                 type: string
 *                 example: Ali Valiyev
 *               email:
 *                 type: string
 *                 example: admin@gmail.com
 *               password:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       201:
 *         description: Admin muvaffaqiyatli yaratildi
 */
router.post("/", authMiddleware, roleMiddleware("SUPER_ADMIN"), createAdmin);
/**
 * @swagger
 * /api/admins:
 *   get:
 *     summary: Barcha adminlarni olish
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Adminlar ro'yxati
 */
router.get("/", authMiddleware, roleMiddleware("SUPER_ADMIN"), getAllAdmins,
);
/**
 * @swagger
 * /api/admins/{id}:
 *   get:
 *     summary: ID bo'yicha adminni olish
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Admin ma'lumotlari
 *       404:
 *         description: Admin topilmadi
 */
router.get("/:id", authMiddleware, roleMiddleware("SUPER_ADMIN"), getAdminById);
/**
 * @swagger
 * /api/admins/{id}:
 *   put:
 *     summary: Admin ma'lumotlarini yangilash
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullname:
 *                 type: string
 *                 example: Ali Valiyev
 *               email:
 *                 type: string
 *                 example: admin@gmail.com
 *               password:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: Admin muvaffaqiyatli yangilandi
 */
router.put(
    "/:id",
    authMiddleware,
    roleMiddleware("SUPER_ADMIN"),
    updateAdmin
);
/**
 * @swagger
 * /api/admins/{id}:
 *   delete:
 *     summary: Adminni o'chirish
 *     tags:
 *       - Admin
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
 *         description: Admin muvaffaqiyatli o'chirildi
 *       404:
 *         description: Admin topilmadi
 */
router.delete(
    "/:id",
    authMiddleware,
    roleMiddleware("SUPER_ADMIN"),
    deleteAdmin
);

module.exports = router;
