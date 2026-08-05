const pool = require("../db/index");
const AppError = require("../utils/utilsAppError");
const bcrypt = require("bcryptjs");

const getAllUsers = async (
    page = 1,
    limit = 10,
    search = "",
    role = "",
    is_active = "",
    sort = "newest",
) => {
    const offset = (page - 1) * limit;

    let where = [];
    let values = [];

    // Search
    if (search) {
        values.push(`%${search}%`);
        where.push(
            `(fullname ILIKE $${values.length} OR email ILIKE $${values.length})`,
        );
    }

    // Role filter
    if (role) {
        values.push(role);
        where.push(`role = $${values.length}`);
    }

    // Active filter
    if (is_active !== "") {
        values.push(is_active === "true");
        where.push(`is_active = $${values.length}`);
    }

    const whereQuery = where.length ? "WHERE " + where.join(" AND ") : "";

    // Total
    const totalResult = await pool.query(
        `
        SELECT COUNT(*)
        FROM users
        ${whereQuery}
        `,
        values,
    );

    const total = Number(totalResult.rows[0].count);

    let orderBy = "created_at DESC";

    switch (sort) {
        case "oldest":
            orderBy = "created_at ASC";
            break;

        case "name_asc":
            orderBy = "fullname ASC";
            break;

        case "name_desc":
            orderBy = "fullname DESC";
            break;

        case "email_asc":
            orderBy = "email ASC";
            break;

        case "email_desc":
            orderBy = "email DESC";
            break;

        default:
            orderBy = "created_at DESC";
    }
    // Data
    const result = await pool.query(
        `
        SELECT
            id,
            fullname,
            email,
            role,
            is_active,
            created_at
        FROM users
        ${whereQuery}
        ORDER BY ${orderBy}
        LIMIT $${values.length + 1}
        OFFSET $${values.length + 2}
        `,
        [...values, limit, offset],
    );

    return {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        data: result.rows,
    };
};
const getUserById = async (id) => {
    const result = await pool.query(
        `
        SELECT
            id,
            fullname,
            email,
            role,
            is_active,
            created_at
        FROM users
        WHERE id = $1
        `,
        [id],
    );

    if (result.rows.length === 0) {
        throw new AppError("Bunday kurs mavjud emas.", 404);
    }

    return result.rows[0];
};
const getProfile = async (id) => {
    const result = await pool.query(
        `
        SELECT
            id,
            fullname,
            email,
            role,
            is_active,
            created_at
        FROM users
        WHERE id = $1
        `,
        [id],
    );

    if (result.rows.length === 0) {
        throw new AppError("Foydalanuvchi topilmadi.", 400);
    }

    return result.rows[0];
};
const updateProfile = async (id, data) => {
    const { fullname, email } = data;

    const checkUser = await pool.query(
        `
        SELECT id
        FROM users
        WHERE email = $1
        AND id <> $2
        `,
        [email, id],
    );

    if (checkUser.rows.length) {
        throw new AppError("Bu email allaqachon mavjud.", 409);
    }

    const result = await pool.query(
        `
        UPDATE users
        SET
            fullname = $1,
            email = $2
        WHERE id = $3
        RETURNING
            id,
            fullname,
            email,
            role,
            is_active,
            created_at
        `,
        [fullname, email, id],
    );

    if (!result.rows.length) {
        throw new AppError("Foydalanuvchi topilmadi.", 404);
    }

    return result.rows[0];
};
const changePassword = async (id, data) => {
    const { oldPassword, newPassword } = data;

    const result = await pool.query(
        `
        SELECT password
        FROM users
        WHERE id = $1
        `,
        [id],
    );

    if (!result.rows.length) {
        throw new AppError("Foydalanuvchi topilmadi.", 404);
    }

    const user = result.rows[0];

    const isMatch = await bcrypt.compare(oldPassword, user.password);

    if (!isMatch) {
        throw new AppError("Eski parol noto'g'ri.", 400);
    }

    const isSame = await bcrypt.compare(newPassword, user.password);

    if (isSame) {
        throw new AppError(
            "Yangi parol eski parol bilan bir xil bo'lishi mumkin emas.",
            400,
        );
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await pool.query(
        `
        UPDATE users
        SET password = $1,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $2
        `,
        [hashedPassword, id],
    );

    return;
};
const getMyCourses = async (userId) => {
    const result = await pool.query(
        `
        SELECT
            c.id AS course_id,
            c.title,
            c.description,
            c.price,
            c.image_url,
            cat.name AS category
        FROM enrollments e
        JOIN courses c
            ON c.id = e.course_id
        JOIN categories cat
            ON cat.id = c.category_id
        WHERE e.user_id = $1
        ORDER BY e.created_at DESC
        `,
        [userId],
    );

    return result.rows;
};
module.exports = {
    getAllUsers,
    getUserById,
    getProfile,
    updateProfile,
    changePassword,
    getMyCourses,
};
