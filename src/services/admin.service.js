const pool = require("../db/index");
const bcrypt = require("bcryptjs");
const AppError = require("../utils/utilsAppError");

const createAdmin = async ({ fullname, email, password }) => {
    const admin = await pool.query("SELECT id FROM users WHERE email = $1", [
        email,
    ]);

    if (admin.rows.length > 0) {
        throw new AppError("Bu email allaqachon mavjud.", 409);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
        `
        INSERT INTO users (
            fullname,
            email,
            password,
            role,
            is_active,
            is_verified
        )
        VALUES ($1,$2,$3,'ADMIN',true,true)
        RETURNING id, fullname, email, role, is_active, created_at
        `,
        [fullname, email, hashedPassword],
    );

    return result.rows[0];
};
const getAllAdmins = async () => {
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
        WHERE role = 'ADMIN'
        ORDER BY created_at DESC
        `,
    );

    return result.rows;
};
const getAdminById = async (id) => {
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
        AND role = 'ADMIN'
        `,
        [id],
    );

    if (result.rows.length === 0) {
        throw new AppError("Admin topilmadi.", 404);
    }

    return result.rows[0];
};
const updateAdmin = async (id, { fullname, email, password }) => {
    const admin = await pool.query(
        "SELECT * FROM users WHERE id = $1 AND role = 'ADMIN'",
        [id],
    );

    if (admin.rows.length === 0) {
        throw new AppError("Admin topilmadi.", 404);
    }

    const currentAdmin = admin.rows[0];

    const hashedPassword = password
        ? await bcrypt.hash(password, 10)
        : currentAdmin.password;

    const result = await pool.query(
        `
        UPDATE users
        SET
            fullname = $1,
            email = $2,
            password = $3,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $4
        RETURNING
            id,
            fullname,
            email,
            role,
            is_active,
            updated_at
        `,
        [
            fullname || currentAdmin.fullname,
            email || currentAdmin.email,
            hashedPassword,
            id,
        ],
    );

    return result.rows[0];
};
const deleteAdmin = async (id) => {
    const admin = await pool.query(
        "SELECT id FROM users WHERE id = $1 AND role = 'ADMIN'",
        [id],
    );

    if (admin.rows.length === 0) {
        throw new AppError("Admin topilmadi.", 404);
    }

    await pool.query("DELETE FROM users WHERE id = $1", [id]);

    return;
};
module.exports = {
    createAdmin,
    getAllAdmins,
    getAdminById,
    updateAdmin,
    deleteAdmin,
};
