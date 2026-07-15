const pool = require("../db/index");

const createVideo = async ({
    course_id,
    title,
    video_url,
    duration,
    order_number,
}) => {
    // Course mavjudligini tekshiramiz
    const course = await pool.query("SELECT id FROM courses WHERE id = $1", [
        course_id,
    ]);

    if (course.rows.length === 0) {
        throw new Error("Bunday kurs mavjud emas.");
    }

    const result = await pool.query(
        `
        INSERT INTO videos
        (
            course_id,
            title,
            video_url,
            duration,
            order_number
        )
        VALUES ($1,$2,$3,$4,$5)
        RETURNING *
        `,
        [course_id, title, video_url, duration, order_number],
    );

    return result.rows[0];
};
const getAllVideos = async (
    page = 1,
    limit = 10,
    course_id = "",
    search = "",
) => {
    const offset = (page - 1) * limit;

    let where = [];
    let values = [];

    // Course filter
    if (course_id) {
        values.push(course_id);
        where.push(`v.course_id = $${values.length}`);
    }

    // Search
    if (search) {
        values.push(`%${search}%`);
        where.push(`v.title ILIKE $${values.length}`);
    }

    const whereQuery = where.length ? "WHERE " + where.join(" AND ") : "";

    // Jami videolar soni
    const totalResult = await pool.query(
        `
        SELECT COUNT(*)
        FROM videos v
        ${whereQuery}
        `,
        values,
    );

    const total = Number(totalResult.rows[0].count);

    // Asosiy so'rov
    const result = await pool.query(
        `
        SELECT
            v.*,
            c.title AS course_title
        FROM videos v
        LEFT JOIN courses c
            ON v.course_id = c.id
        ${whereQuery}
        ORDER BY v.order_number ASC
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
const getVideoById = async (id) => {
    const result = await pool.query(
        `
        SELECT
            v.*,
            c.title AS course_title
        FROM videos v
        LEFT JOIN courses c
            ON v.course_id = c.id
        WHERE v.id = $1
        `,
        [id],
    );

    if (result.rows.length === 0) {
        throw new Error("Video topilmadi.");
    }

    return result.rows[0];
};
const updateVideo = async (id, data) => {
    const oldVideo = await pool.query("SELECT * FROM videos WHERE id = $1", [
        id,
    ]);

    if (oldVideo.rows.length === 0) {
        throw new Error("Video topilmadi.");
    }

    const video = oldVideo.rows[0];

    const course_id = data.course_id ?? video.course_id;
    const title = data.title ?? video.title;
    const video_url = data.video_url ?? video.video_url;
    const duration = data.duration ?? video.duration;
    const order_number = data.order_number ?? video.order_number;

    // Agar course_id o'zgargan bo'lsa, kurs mavjudligini tekshiramiz
    const course = await pool.query("SELECT id FROM courses WHERE id = $1", [
        course_id,
    ]);

    if (course.rows.length === 0) {
        throw new Error("Bunday kurs mavjud emas.");
    }

    const result = await pool.query(
        `
        UPDATE videos
        SET
            course_id = $1,
            title = $2,
            video_url = $3,
            duration = $4,
            order_number = $5,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $6
        RETURNING *
        `,
        [course_id, title, video_url, duration, order_number, id],
    );

    return result.rows[0];
};
const deleteVideo = async (id) => {
    const video = await pool.query("SELECT id FROM videos WHERE id = $1", [id]);

    if (video.rows.length === 0) {
        throw new Error("Video topilmadi.");
    }

    await pool.query("DELETE FROM videos WHERE id = $1", [id]);

    return;
};
const getVideosByCourse = async (courseId) => {
    const course = await pool.query("SELECT id FROM courses WHERE id = $1", [
        courseId,
    ]);

    if (course.rows.length === 0) {
        throw new Error("Kurs topilmadi.");
    }

    const result = await pool.query(
        `
        SELECT *
        FROM videos
        WHERE course_id = $1
        ORDER BY order_number ASC
        `,
        [courseId],
    );

    return result.rows;
};
module.exports = {
    createVideo,
    getAllVideos,
    getVideoById,
    updateVideo,
    deleteVideo,
    getVideosByCourse,
};
