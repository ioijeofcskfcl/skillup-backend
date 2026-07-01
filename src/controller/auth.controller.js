const pool = require("../db/index");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const redisClient = require("../redis/redis");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "jumanazarovogabek773@gmail.com",
        pass: "cltb mcap ztwz lvzj",
    },
});

// 1. LOGIN FUNKSIYASI
const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const userCheck = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (userCheck.rows.length === 0) return res.status(401).json({ message: "Email yoki parol noto'g'ri!" });

        const user = userCheck.rows[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: "Email yoki parol noto'g'ri!" });

        const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET || "secret", { expiresIn: '24h' });
        res.status(200).json({message: "Muvaffaqiyatli tizimga kirildi.", token, user: { email: user.email, role: user.role } });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// 2. REGISTER FUNKSIYASI
const register = async (req, res) => {
    const { email, password } = req.body;
    const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

if (!passwordRegex.test(password)) {
    return res.status(400).json({
        success: false,
        message:
            "Parol kamida 8 ta belgidan iborat bo'lishi, 1 ta katta harf, 1 ta kichik harf va 1 ta raqam qatnashishi kerak."
    });
}
    try {
        const userCheck = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (userCheck.rows.length > 0) return res.status(400).json({ message: "Bu email allaqachon ro'yxatdan o'tgan!" });

        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
        await redisClient.setEx(`register:${email}`, 300, JSON.stringify({ password, code: verificationCode }));
        
        await transporter.sendMail({
            from: '"Skill Up" <jumanazarovogabek773@gmail.com>',
            to: email,
            subject: "Skill Up — Tasdiqlash kodi",
            html: `<h3>Sizning kodingiz: ${verificationCode}</h3>`,
        });

        res.status(200).json({ message: "Tasdiqlash kodi yuborildi!", email });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
const verify = async (req, res) => {
    const { email, code } = req.body;

    try {
        const data = await redisClient.get(`register:${email}`);

        if (!data) {
            return res.status(400).json({
                message: "Kodning amal qilish muddati tugagan."
            });
        }

        const parsedData = JSON.parse(data);

        if (parsedData.code !== code) {
            return res.status(400).json({
                message: "Tasdiqlash kodi noto'g'ri."
            });
        }

        const hashedPassword = await bcrypt.hash(parsedData.password, 10);

        const user = await pool.query(
            `INSERT INTO users (email, password, role, is_active)
             VALUES ($1, $2, $3, $4)
             RETURNING id, email, role`,
            [
                email,
                hashedPassword,
                "USER",
                true
            ]
        );

        await redisClient.del(`register:${email}`);

        const token = jwt.sign(
            {
                userId: user.rows[0].id,
                role: user.rows[0].role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "24h"
            }
        );

        res.status(201).json({
            message: "Ro'yxatdan o'tish muvaffaqiyatli.",
            token,
            user: user.rows[0]
        });

    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
};
const resendOtp = async (req, res) => {
    const { email } = req.body;

    try {
        const data = await redisClient.get(`register:${email}`);

        if (!data) {
            return res.status(400).json({
                message: "Avval ro'yxatdan o'ting."
            });
        }

        const parsedData = JSON.parse(data);

        const verificationCode = Math.floor(
            100000 + Math.random() * 900000
        ).toString();

        await redisClient.setEx(
            `register:${email}`,
            300,
            JSON.stringify({
                password: parsedData.password,
                code: verificationCode
            })
        );

        await transporter.sendMail({
            from: '"Skill Up" <jumanazarovogabek773@gmail.com>',
            to: email,
            subject: "Skill Up — Yangi tasdiqlash kodi",
            html: `<h3>Sizning yangi kodingiz: ${verificationCode}</h3>`
        });

        res.status(200).json({
            message: "Yangi tasdiqlash kodi yuborildi."
        });

    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
};
const forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await pool.query(
            "SELECT * FROM users WHERE email = $1",
            [email]
        );

        if (user.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Bunday email mavjud emas."
            });
        }

        const verificationCode = Math.floor(
            100000 + Math.random() * 900000
        ).toString();

        await redisClient.setEx(
            `forgot:${email}`,
            300,
            verificationCode
        );

        await transporter.sendMail({
            from: '"Skill Up" <jumanazarovogabek773@gmail.com>',
            to: email,
            subject: "Skill Up - Parolni tiklash",
            html: `<h2>Parolni tiklash kodingiz: ${verificationCode}</h2>`
        });

        res.status(200).json({
            success: true,
            message: "Parolni tiklash kodi yuborildi."
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};
const resetPassword = async (req, res) => {
    const { email, code, password } = req.body;
    const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

if (!passwordRegex.test(password)) {
    return res.status(400).json({
        success: false,
        message:
            "Parol kamida 8 ta belgidan iborat bo'lishi, 1 ta katta harf, 1 ta kichik harf va 1 ta raqam qatnashishi kerak."
    });
}

    try {
        const savedCode = await redisClient.get(`forgot:${email}`);

        if (!savedCode) {
            return res.status(400).json({
                success: false,
                message: "Kodning muddati tugagan."
            });
        }

        if (savedCode !== code) {
            return res.status(400).json({
                success: false,
                message: "Tasdiqlash kodi noto'g'ri."
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await pool.query(
            "UPDATE users SET password = $1 WHERE email = $2",
            [hashedPassword, email]
        );

        await redisClient.del(`forgot:${email}`);

        res.status(200).json({
            success: true,
            message: "Parol muvaffaqiyatli yangilandi."
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};
const logout = async (req, res) => {
    try {
        res.status(200).json({
            success: true,
            message: "Tizimdan muvaffaqiyatli chiqildi."
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};
module.exports = {
    login,
    register,
    verify,
    resendOtp,
    forgotPassword,
    resetPassword,
    logout
};