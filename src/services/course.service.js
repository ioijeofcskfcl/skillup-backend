const pool = require("../db/index");

const createCourse = async ({
    category_id,
    title,
    description,
    price,
    image_url,
    created_by,
}) => {

    // Category mavjudligini tekshirish
    const category = await pool.query(
        "SELECT * FROM categories WHERE id = $1",
        [category_id]
    );

    if (category.rows.length === 0) {
        throw new Error("Kategoriya topilmadi.");
    }

    const result = await pool.query(
        `
        INSERT INTO courses
        (
            category_id,
            title,
            description,
            price,
            image_url,
            created_by
        )
        VALUES ($1,$2,$3,$4,$5,$6)
        RETURNING *
        `,
        [
            category_id,
            title,
            description,
            price,
            image_url,
            created_by,
        ]
    );

    return result.rows[0];
};
const getAllCourses = async (page = 1, limit = 10) => {
    const offset = (page - 1) * limit;

    const totalResult = await pool.query(`
        SELECT COUNT(*) FROM courses
    `);

    const total = Number(totalResult.rows[0].count);

    const result = await pool.query(
        `
        SELECT
            c.*,
            u.fullname AS admin_name,
            u.email AS admin_email
        FROM courses c
        LEFT JOIN users u
            ON c.created_by = u.id
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
const getCourseById = async (id) => {
    const result = await pool.query(
        `
        SELECT
            c.*,
            cat.name AS category_name,
            u.fullname AS admin_name,
            u.email AS admin_email
        FROM courses c
        LEFT JOIN categories cat
            ON c.category_id = cat.id
        LEFT JOIN users u
            ON c.created_by = u.id
        WHERE c.id = $1
        `,
        [id]
    );

    if (result.rows.length === 0) {
        throw new Error("Kurs topilmadi.");
    }

    return result.rows[0];
};
const updateCourse = async (id, data) => {
    const oldCourse = await pool.query(
        "SELECT * FROM courses WHERE id = $1",
        [id]
    );

    if (oldCourse.rows.length === 0) {
        throw new Error("Kurs topilmadi.");
    }

    const course = oldCourse.rows[0];

    // category_id yuborilgan bo'lsa, mavjudligini tekshiramiz
    if (data.category_id) {
        const category = await pool.query(
            "SELECT * FROM categories WHERE id = $1",
            [data.category_id]
        );

        if (category.rows.length === 0) {
            throw new Error("Kategoriya topilmadi.");
        }
    }

    const category_id = data.category_id ?? course.category_id;
    const title = data.title ?? course.title;
    const description = data.description ?? course.description;
    const price = data.price ?? course.price;
    const image_url = data.image_url ?? course.image_url;

    const result = await pool.query(
        `
        UPDATE courses
        SET
            category_id = $1,
            title = $2,
            description = $3,
            price = $4,
            image_url = $5,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $6
        RETURNING *
        `,
        [
            category_id,
            title,
            description,
            price,
            image_url,
            id,
        ]
    );

    return result.rows[0];
}; 
const deleteCourse = async (id) => {
    const course = await pool.query(
        "SELECT id FROM courses WHERE id = $1",
        [id]
    );

    if (course.rows.length === 0) {
        throw new Error("Kurs topilmadi.");
    }

    await pool.query(
        "DELETE FROM courses WHERE id = $1",
        [id]
    );

    return;
};
module.exports = {
    createCourse,
    getAllCourses,
    getCourseById,
    updateCourse,
    deleteCourse,
};