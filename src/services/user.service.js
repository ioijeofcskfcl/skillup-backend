const pool = require("../db/index");

const getAllUsers = async (page = 1, limit = 10) => {
    const offset = (page - 1) * limit;

    const totalResult = await pool.query(`
        SELECT COUNT(*) FROM users
    `);

    const total = Number(totalResult.rows[0].count);

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
        ORDER BY created_at DESC
        LIMIT $1 OFFSET $2
        `,
        [limit, offset]
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
        [id]
    );

    if (result.rows.length === 0) {
        throw new Error("Foydalanuvchi topilmadi.");
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
        [id]
    );

    if (result.rows.length === 0) {
        throw new Error("Foydalanuvchi topilmadi.");
    }

    return result.rows[0];
};
module.exports = {
    getAllUsers,
    getUserById,
    getProfile,
};