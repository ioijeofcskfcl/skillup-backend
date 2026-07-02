const pool = require("../db/index");

const createCourse = async ({
    title,
    description,
    price,
    image_url,
    created_by,
}) => {
    const result = await pool.query(
        `
        INSERT INTO courses
        (
            title,
            description,
            price,
            image_url,
            created_by
        )
        VALUES ($1,$2,$3,$4,$5)
        RETURNING *
        `,
        [
            title,
            description,
            price,
            image_url,
            created_by,
        ]
    );

    return result.rows[0];
};
const getAllCourses = async () => {
    const result = await pool.query(`
        SELECT 
            c.*,
            u.fullname AS admin_name,
            u.email AS admin_email
        FROM courses c
        LEFT JOIN users u
            ON c.created_by = u.id
        ORDER BY c.created_at DESC
    `);

    return result.rows;
};
const getCourseById = async (id) => {
    const result = await pool.query(
        `
        SELECT
            c.*,
            u.fullname AS admin_name,
            u.email AS admin_email
        FROM courses c
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

    const title = data.title ?? course.title;
    const description = data.description ?? course.description;
    const price = data.price ?? course.price;
    const image_url = data.image_url ?? course.image_url;

    const result = await pool.query(
        `
        UPDATE courses
        SET
            title = $1,
            description = $2,
            price = $3,
            image_url = $4,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $5
        RETURNING *
        `,
        [
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