const pool = require("../db/index");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const redisClient = require("../redis/redis");
const nodemailer = require("nodemailer");
const axios = require("axios");
const AppError = require("../utils/utilsAppError");


const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
    },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 10000,
});

// 1. LOGIN FUNKSIYASI
const login = async (req, res, next) => {
    const { email, password } = req.body;
    try {
        const userCheck = await pool.query(
            "SELECT * FROM users WHERE email = $1",
            [email],
        );
        if (userCheck.rows.length === 0)
            throw new AppError("Email yoki parol noto'g'ri.", 401);

        const user = userCheck.rows[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) throw new AppError("Email yoki parol noto'g'ri.", 401);

        const accestoken = jwt.sign(
            {
                id: user.id,
                role: user.role,
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "15m",
            },
        );
        const refreshToken = jwt.sign(
            {
                id: user.id,
                email: user.email,
                role: user.role,
            },
            process.env.JWT_SECRET,
            {
                expiresIn: process.env.JWT_EXPIRES_IN,
            },
        );
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        res.status(200).json({
            message: "Muvaffaqiyatli tizimga kirildi.",
            accestoken,
            user: { email: user.email, role: user.role },
        });
    } catch (error) {
        next(error);
    }
};

// 2. REGISTER FUNKSIYASI
const register = async (req, res, next) => {
    const { fullname, email, password } = req.body;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

    if (!passwordRegex.test(password)) {
        throw new AppError(
            "Parol kamida 8 ta belgidan iborat bo'lishi, 1 ta katta harf, 1 ta kichik harf va 1 ta raqam qatnashishi kerak.",
            400,
        );
    }

    try {
        const userCheck = await pool.query(
            "SELECT * FROM users WHERE email = $1",
            [email],
        );

        if (userCheck.rows.length > 0) {
            throw new AppError("Email allaqachon mavjud.", 409);
        }

        const verificationCode = Math.floor(
            100000 + Math.random() * 900000,
        ).toString();

        // 🛠 ioredis mosligi uchun: setEx o'rniga setex qilindi
        await redisClient.setex(
            `register:${email}`,
            300,
            JSON.stringify({
                fullname,
                password,
                code: verificationCode,
            }),
        );
        
        
        
           try {
    console.log("1. Brevo API email yuborishni boshladi");

    const response = await axios.post(
        "https://api.brevo.com/v3/smtp/email",
        {
            sender: {
                name: "Skill Up",
                email: process.env.EMAIL_USER,
            },
            to: [
                {
                    email: email,
                },
            ],
            subject: "Skill Up — Tasdiqlash kodi",
            htmlContent: `
                <h3>Sizning tasdiqlash kodingiz: ${verificationCode}</h3>
            `,
        },
        {
            headers: {
                accept: "application/json",
                "api-key": process.env.BREVO_API_KEY,
                "content-type": "application/json",
            },
        }
    );

    console.log("2. Brevo email yuborildi");
    console.log("messageId:", response.data.messageId);

} catch (error) {
    console.error(
        "❌ BREVO ERROR:",
        error.response?.data || error.message
    );

    throw error;
}

             
          
          

        res.status(200).json({
            message: "Tasdiqlash kodi yuborildi!",
            email,
        });
    } catch (error) {
        next(error);
    }
};

// 3. VERIFY FUNKSIYASI
const verify = async (req, res, next) => {
    const { email, code } = req.body;

    console.log("VERIFY KELDI");
    console.log(req.body);

    try {
        const data = await redisClient.get(`register:${email}`);
        console.log("3. REDIS:", data);

        if (!data) {
            throw new AppError("Amal qilish muddati tugagan.", 401);
        }

        const parsedData = JSON.parse(data);
        console.log("4. PARSED");

        if (parsedData.code !== code) {
            throw new AppError("Tasdiqlash kodi noto'g'ri.", 400);
        }

        const hashedPassword = await bcrypt.hash(parsedData.password, 10);
        console.log("5. HASH");

        const user = await pool.query(
            `INSERT INTO users(fullname,email,password,role,is_active)
             VALUES($1,$2,$3,$4,$5)
             RETURNING *`,
            [parsedData.fullname, email, hashedPassword, "USER", true],
        );

        console.log("6. USER CREATED");

        await redisClient.del(`register:${email}`);
        console.log("7. REDIS DELETE");

        const token = jwt.sign(
            {
                id: user.rows[0].id,
                role: user.rows[0].role,
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "24h",
            },
        );

        console.log("8. RESPONSE");

        return res.status(201).json({
            message: "OK",
            token,
        });
    } catch (err) {
        console.log("VERIFY ERROR:", err);
        next(err);
    }
};
// 4. RESEND OTP FUNKSIYASI
const resendOtp = async (req, res, next) => {
    const { email } = req.body;

    try {
        const data = await redisClient.get(`register:${email}`);

        if (!data) {
            throw new AppError("Avval ro'yxatdan o'ting.", 400);
        }

        const parsedData = JSON.parse(data);

        const verificationCode = Math.floor(
            100000 + Math.random() * 900000,
        ).toString();

        // 🛠 ioredis mosligi uchun: setEx o'rniga setex qilindi
        await redisClient.setex(
            `register:${email}`,
            300,
            JSON.stringify({
                fullname: parsedData.fullname,
                password: parsedData.password,
                code: verificationCode,
            }),
        );

        await transporter.sendMail({
            from: '"Skill Up" <jumanazarovogabek773@gmail.com>',
            to: email,
            subject: "Skill Up — Yangi tasdiqlash kodi",
            html: `<h3>Sizning yangi kodingiz: ${verificationCode}</h3>`,
        });

        res.status(200).json({
            message: "Yangi tasdiqlash kodi yuborildi.",
        });
    } catch (error) {
        next(error);
    }
};

// 5. FORGOT PASSWORD FUNKSIYASI
const forgotPassword = async (req, res, next) => {
    const { email } = req.body;

    try {
        const user = await pool.query("SELECT * FROM users WHERE email = $1", [
            email,
        ]);

        if (user.rows.length === 0) {
            throw new AppError("Bunday email mavjud emas.", 404);
        }

        const verificationCode = Math.floor(
            100000 + Math.random() * 900000,
        ).toString();

        // 🛠 ioredis mosligi uchun: setEx o'rniga setex qilindi
        await redisClient.setex(`forgot:${email}`, 300, verificationCode);

        await transporter.sendMail({
            from: '"Skill Up" <jumanazarovogabek773@gmail.com>',
            to: email,
            subject: "Skill Up - Parolni tiklash",
            html: `<h2>Parolni tiklash kodingiz: ${verificationCode}</h2>`,
        });

        res.status(200).json({
            success: true,
            message: "Parolni tiklash kodi yuborildi.",
        });
    } catch (error) {
        next(error);
    }
};

// 6. RESET PASSWORD FUNKSIYASI
const resetPassword = async (req, res, next) => {
    const { email, code, password } = req.body;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

    if (!passwordRegex.test(password)) {
        throw new AppError(
            "Parol kamida 8 ta belgidan iborat bo'lishi, 1 ta katta harf, 1 ta kichik harf va 1 ta raqam qatnashishi kerak.",
            400,
        );
    }

    try {
        const savedCode = await redisClient.get(`forgot:${email}`);

        if (!savedCode) {
            return res.status(400).json({
                success: false,
                message: "Kodning muddati tugagan.",
            });
        }

        if (savedCode !== code) {
            throw new AppError("Tasdiqlash kodi noto'g'ri.", 400);
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await pool.query("UPDATE users SET password = $1 WHERE email = $2", [
            hashedPassword,
            email,
        ]);

        await redisClient.del(`forgot:${email}`);

        res.status(200).json({
            success: true,
            message: "Parol muvaffaqiyatli yangilandi.",
        });
    } catch (error) {
        next(error);
    }
};

// 7. LOGOUT FUNKSIYASI
const logout = async (req, res, next) => {
    try {
        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: false,
            sameSite: "strict",
        });

        res.status(200).json({
            success: true,
            message: "Tizimdan muvaffaqiyatli chiqildi.",
        });
    } catch (error) {
        next(error);
    }
};

// 8. REFRESH TOKEN FUNKSIYASI
const refreshToken = async (req, res, next) => {
    try {
        const token = req.cookies.refreshToken;

        if (!token) {
            throw new AppError("Refresh token topilmadi.", 401);
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await pool.query(
            "SELECT id, email, role FROM users WHERE id = $1",
            [decoded.id],
        );

        if (user.rows.length === 0) {
            throw new AppError("Foydalanuvchi topilmadi.", 404);
        }

        const accessToken = jwt.sign(
            {
                id: user.rows[0].id,
                role: user.rows[0].role,
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "15m",
            },
        );

        res.status(200).json({
            success: true,
            accessToken,
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    login,
    register,
    verify,
    resendOtp,
    forgotPassword,
    resetPassword,
    logout,
    refreshToken,
};
