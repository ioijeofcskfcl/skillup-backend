const { get } = require("../app");
const pool = require("../db/index");

// CREATE
const createCategory = async ({ name }) => {
    const check = await pool.query("SELECT * FROM categories WHERE name = $1", [
        name,
    ]);

    if (check.rows.length > 0) {
        throw new Error("Bu kategoriya allaqachon mavjud.");
    }

    const result = await pool.query(
        `
        INSERT INTO categories(name)
        VALUES($1)
        RETURNING *
        `,
        [name],
    );

    return result.rows[0];
};
// GET ALL
const getAllCategories = async (
    page = 1,
    limit = 10,
    search = "",
    sort = "newest",
) => {
    const offset = (page - 1) * limit;

    let where = [];
    let values = [];

    // SEARCH
    if (search) {
        values.push(`%${search}%`);
        where.push(`c.name ILIKE $${values.length}`);
    }

    const whereQuery = where.length ? "WHERE " + where.join(" AND ") : "";

    // SORT
    let orderBy = "c.created_at DESC";

    switch (sort) {
        case "oldest":
            orderBy = "c.created_at ASC";
            break;

        case "name_asc":
            orderBy = "c.name ASC";
            break;

        case "name_desc":
            orderBy = "c.name DESC";
            break;

        default:
            orderBy = "c.created_at DESC";
    }

    // TOTAL
    const totalResult = await pool.query(
        `
        SELECT COUNT(*)
        FROM categories c
        ${whereQuery}
        `,
        values,
    );

    const total = Number(totalResult.rows[0].count);

    // DATA
    const result = await pool.query(
        `
        SELECT
            c.*,
            COUNT(co.id) AS courses_count
        FROM categories c
        LEFT JOIN courses co
            ON c.id = co.category_id
        ${whereQuery}
        GROUP BY c.id
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
        [id],
    );

    if (result.rows.length === 0) {
        throw new Error("Kategoriya topilmadi.");
    }

    return result.rows[0];
};
const updateCategory = async (id, { name }) => {
    const check = await pool.query("SELECT * FROM categories WHERE id = $1", [
        id,
    ]);

    if (check.rows.length === 0) {
        throw new Error("Kategoriya topilmadi.");
    }

    const duplicate = await pool.query(
        "SELECT * FROM categories WHERE name = $1 AND id <> $2",
        [name, id],
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
        [name, id],
    );

    return result.rows[0];
};
const deleteCategory = async (id) => {
    const check = await pool.query("SELECT * FROM categories WHERE id = $1", [
        id,
    ]);

    if (check.rows.length === 0) {
        throw new Error("Kategoriya topilmadi.");
    }

    const result = await pool.query(
        `
        DELETE FROM categories
        WHERE id = $1
        RETURNING *
        `,
        [id],
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
