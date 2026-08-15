const express = require("express");
const passport = require("../config/passport");
const router = express.Router();
const {
    login,
    register,
    verify,
    resendOtp,
    forgotPassword,
    resetPassword,
    logout,
    refreshToken,
    googleLogin,
    googleCallback,
    googleVerify
} = require("../controller/auth.controller");
const validationMiddleware = require("../middleware/validation.middleware");

const {
    registerSchema,
    loginSchema,
    forgotPasswordSchema,
    resetPasswordSchema,
} = require("../validations/auth.validation");
/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Foydalanuvchini ro'yxatdan o'tkazish
 *     tags:
 *       - Autentifikatsiya
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
 *                 example: "Ogabek Jumanazarov"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "jumanazarovogabek773@gmail.com"
 *               password:
 *                 type: string
 *                 example: "Ogabek123$"
 *     responses:
 *       200:
 *         description: Tasdiqlash kodi emailga yuborildi
 *       400:
 *         description: Noto'g'ri ma'lumot
 *       409:
 *         description: Email allaqachon mavjud
 */

router.post("/register", validationMiddleware(registerSchema), register);
/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Tizimga kirish
 *     tags:
 *       - Autentifikatsiya
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: jumanazarovogabek773@gmail.com
 *               password:
 *                 type: string
 *                 example: "111111"
 *     responses:
 *       200:
 *         description: Kirish muvaffaqiyatli
 */
router.post("/login", validationMiddleware(loginSchema), login);

/**
 * @swagger
 * /api/auth/verify:
 *   post:
 *     summary: Tasdiqlash kodi orqali foydalanuvchini tasdiqlash
 *     tags:
 *       - Autentifikatsiya
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - code
 *             properties:
 *               email:
 *                 type: string
 *                 example: jumanazarovogabek773@gmail.com
 *               code:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       201:
 *         description: Foydalanuvchi muvaffaqiyatli yaratildi
 *       400:
 *         description: Kod noto'g'ri yoki muddati tugagan
 */
router.post("/verify", verify);
/**
 * @swagger
 * /api/auth/resend-otp:
 *   post:
 *     summary: Tasdiqlash kodini qayta yuborish
 *     tags:
 *       - Autentifikatsiya
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 example: jumanazarovogabek773@gmail.com
 *     responses:
 *       200:
 *         description: Yangi tasdiqlash kodi yuborildi
 */
router.post("/resend-otp", resendOtp);
/**
 * @swagger
 * /api/auth/forgot-password:
 *   post:
 *     summary: Parolni tiklash uchun kod yuborish
 *     tags:
 *       - Autentifikatsiya
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 example: jumanazarovogabek773@gmail.com
 *     responses:
 *       200:
 *         description: Parolni tiklash kodi yuborildi
 */
router.post(
    "/forgot-password",
    validationMiddleware(forgotPasswordSchema),
    forgotPassword,
);
/**
 * @swagger
 * /api/auth/reset-password:
 *   post:
 *     summary: Parolni yangilash
 *     tags:
 *       - Autentifikatsiya
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - code
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: jumanazarovogabek773@gmail.com
 *               code:
 *                 type: string
 *                 example: "123456"
 *               password:
 *                 type: string
 *                 example: "11111111"
 *     responses:
 *       200:
 *         description: Parol muvaffaqiyatli yangilandi
 */
router.post(
    "/reset-password",
    validationMiddleware(resetPasswordSchema),
    resetPassword,
);

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Tizimdan chiqish
 *     tags:
 *       - Autentifikatsiya
 *     responses:
 *       200:
 *         description: Tizimdan muvaffaqiyatli chiqildi
 */
router.post("/logout", logout);
/**
 * @swagger
 * /api/auth/refresh:
 *   post:
 *     summary: Yangi access token olish
 *     tags:
 *       - Auth
 *     responses:
 *       200:
 *         description: Yangi access token yaratildi
 *       401:
 *         description: Refresh token topilmadi yoki yaroqsiz
 */
router.post("/refresh", refreshToken);
/**
 * @swagger
 * /api/auth/google:
 *   get:
 *     summary: Google orqali login
 *     description: |
 *       Google orqali autentifikatsiya qilish uchun quyidagi havolani bosing:
 *
 *       [🔵 Google Login](https://skillup-backend-production-ce9b.up.railway.app/api/auth/google)
 *
 *       Google accountni tanlaganingizdan keyin emailga OTP yuboriladi.
 *     tags:
 *       - Autentifikatsiya
 *     responses:
 *       302:
 *         description: Google autentifikatsiya sahifasiga yo'naltiradi
 */
router.get("/google", googleLogin);
/**
 * @swagger
 * /api/auth/google/callback:
 *   get:
 *     summary: Google autentifikatsiya callback
 *     tags:
 *       - Autentifikatsiya
 *     responses:
 *       200:
 *         description: Google orqali login muvaffaqiyatli
 *       401:
 *         description: Google autentifikatsiyasi amalga oshmadi
 */
router.get(
    "/google/callback",
    googleCallback
);
/**
 * @swagger
 * /api/auth/google/verify:
 *   post:
 *     summary: Google orqali yuborilgan OTP kodni tasdiqlash
 *     tags:
 *       - Autentifikatsiya
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - code
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "jumanazarovogabek773@gmail.com"
 *               code:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: Google orqali login muvaffaqiyatli
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Google orqali login muvaffaqiyatli."
 *                 accessToken:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIs..."
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "550e8400-e29b-41d4-a716-446655440000"
 *                     email:
 *                       type: string
 *                       example: "jumanazarovogabek773@gmail.com"
 *                     role:
 *                       type: string
 *                       example: "USER"
 *       400:
 *         description: Tasdiqlash kodi noto'g'ri
 *       401:
 *         description: Kod topilmadi yoki muddati tugagan
 *       404:
 *         description: Foydalanuvchi topilmadi
 */
router.post("/google/verify", googleVerify);


module.exports = router;
