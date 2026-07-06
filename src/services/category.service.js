const { get } = require("../app");
const pool = require("../db/index");

// CREATE
const createCategory = async ({ name }) => {
    const check = await pool.query(
        "SELECT * FROM categories WHERE name = $1",
        [name]
    );

    if (check.rows.length > 0) {
        throw new Error("Bu kategoriya allaqachon mavjud.");
    }

    const result = await pool.query(
        `
        INSERT INTO categories(name)
        VALUES($1)
        RETURNING *
        `,
        [name]
    );

    return result.rows[0];
};
// GET ALL
const getAllCategories = async (page = 1, limit = 10) => {
    const offset = (page - 1) * limit;

    const totalResult = await pool.query(`
        SELECT COUNT(*) FROM categories
    `);

    const total = Number(totalResult.rows[0].count);

    const result = await pool.query(
        `
        SELECT
            c.*,
            COUNT(co.id) AS courses_count
        FROM categories c
        LEFT JOIN courses co
            ON c.id = co.category_id
        GROUP BY c.id
        ORDER BY c.created_at DESC
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
const getCategoryById = async (id) => {
    const result = await pool.query(
        `
        SELECT
            c.*,
            COUNT(co.id) AS courses_count
        FROM categories c
        LEFT JOIN courses co
            ON c.id = co.category_id
        WHERE c.id = $1
        GROUP BY c.id
        `,
        [id]
    );

    if (result.rows.length === 0) {
        throw new Error("Kategoriya topilmadi.");
    }

    return result.rows[0];
};
const updateCategory = async (id, { name }) => {
    const check = await pool.query(
        "SELECT * FROM categories WHERE id = $1",
        [id]
    );

    if (check.rows.length === 0) {
        throw new Error("Kategoriya topilmadi.");
    }

    const duplicate = await pool.query(
        "SELECT * FROM categories WHERE name = $1 AND id <> $2",
        [name, id]
    );

    if (duplicate.rows.length > 0) {
        throw new Error("Bu nomdagi kategoriya allaqachon mavjud.");
    }

    const result = await pool.query(
        `
        UPDATE categories
        SET name = $1
        WHERE id = $2
        RETURNING *
        `,
        [name, id]
    );

    return result.rows[0];
};
const deleteCategory = async (id) => {
    const check = await pool.query(
        "SELECT * FROM categories WHERE id = $1",
        [id]
    );

    if (check.rows.length === 0) {
        throw new Error("Kategoriya topilmadi.");
    }

    const result = await pool.query(
        `
        DELETE FROM categories
        WHERE id = $1
        RETURNING *
        `,
        [id]
    );

    return result.rows[0];
};

module.exports = {
    createCategory,
    getAllCategories,
    getCategoryById,
    updateCategory,
    deleteCategory,
};
