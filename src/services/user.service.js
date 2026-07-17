const pool = require("../db/index");
const AppError = require("../utils/utilsAppError");

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
module.exports = {
    getAllUsers,
    getUserById,
    getProfile,
};
