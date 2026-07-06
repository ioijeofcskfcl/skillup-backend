const express = require("express");
const router = express.Router();

const {
    getDashboard,
} = require("../controller/dashboard.controller");

const authMiddleware = require("../middleware/auth.middleware");
const roleMiddleware = require("../middleware/role.middleware");

/**
 * @swagger
 * /api/dashboard:
 *   get:
 *     summary: Dashboard statistikasi
 *     tags:
 *       - Dashboard
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard statistikasi muvaffaqiyatli olindi
 *       401:
 *         description: Token mavjud emas yoki noto'g'ri
 *       403:
 *         description: Ruxsat yo'q
 */
router.get(
    "/",
    authMiddleware,
    roleMiddleware("ADMIN", "SUPER_ADMIN"),
    getDashboard
);

module.exports = router;