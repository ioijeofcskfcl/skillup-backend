const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/auth.middleware");

const {
    getCertificate,
} = require("../controller/certificate.controller");
console.log("authMiddleware:", typeof authMiddleware);
console.log("getCertificate:", typeof getCertificate);/**
 * @swagger
 * /api/certificates/{courseId}:
 *   get:
 *     summary: Kurs sertifikatini olish
 *     tags:
 *       - Certificate
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Sertifikat olish mumkin
 *       400:
 *         description: Kurs to'liq tugatilmagan
 *       401:
 *         description: Token mavjud emas yoki noto'g'ri
 *       403:
 *         description: Kurs sotib olinmagan
 *       404:
 *         description: Kurs topilmadi
 */
router.get(
    "/:courseId",
    authMiddleware,
    getCertificate,
);

module.exports = router;