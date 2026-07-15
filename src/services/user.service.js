const pool = require("../db/index");

const getAllUsers = async (
    page = 1,
    limit = 10,
    search = "",
    role = "",
    is_active = "",
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
        ORDER BY created_at DESC
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
        [id],
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
