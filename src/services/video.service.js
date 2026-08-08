const pool = require("../db/index");
const {
    PutObjectCommand,
} = require("@aws-sdk/client-s3");

const s3 = require("../config/s3");
const crypto = require("crypto");

const AppError = require("../utils/utilsAppError");

const uploadVideoToS3 = async (file) => {
    if (!file) {
        throw new AppError(
            "Video fayl yuborilmadi.",
            400
        );
    }

    if (!process.env.AWS_BUCKET_NAME) {
        throw new AppError(
            "AWS_BUCKET_NAME sozlanmagan.",
            500
        );
    }

    if (!process.env.AWS_REGION) {
        throw new AppError(
            "AWS_REGION sozlanmagan.",
            500
        );
    }

    if (!process.env.AWS_ACCESS_KEY_ID) {
        throw new AppError(
            "AWS_ACCESS_KEY_ID sozlanmagan.",
            500
        );
    }

    if (!process.env.AWS_SECRET_ACCESS_KEY) {
        throw new AppError(
            "AWS_SECRET_ACCESS_KEY sozlanmagan.",
            500
        );
    }

    const extension = (() => {
        switch (file.mimetype) {
            case "video/mp4":
                return "mp4";

            case "video/mpeg":
                return "mpeg";

            case "video/quicktime":
                return "mov";

            case "video/x-msvideo":
                return "avi";

            case "video/x-matroska":
                return "mkv";

            default:
                return "mp4";
        }
    })();

    const fileName =
        crypto.randomBytes(16).toString("hex") +
        "-" +
        Date.now() +
        "." +
        extension;

    const key = `videos/${fileName}`;

    const command = new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
    });

    try {
        await s3.send(command);
    } catch (error) {
        console.error("S3 VIDEO UPLOAD ERROR:", error);

        throw new AppError(
            `Video S3 ga yuklanmadi: ${
                error.message || "Noma'lum AWS xatosi"
            }`,
            500
        );
    }

    return `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
};

const createVideo = async ({
    course_id,
    title,
    file,
    duration,
    order_number,
}) => {
    // Kurs mavjudligini tekshirish
    const course = await pool.query(
        "SELECT id FROM courses WHERE id = $1",
        [course_id]
    );

    if (course.rows.length === 0) {
        throw new AppError(
            "Bunday kurs mavjud emas.",
            404
        );
    }

    // Video S3 ga yuklanadi
    const video_url = await uploadVideoToS3(file);

    // Video DB ga yoziladi
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
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
        `,
        [
            course_id,
            title,
            video_url,
            duration,
            order_number,
        ]
    );

    return result.rows[0];
};

const getAllVideos = async (
    page = 1,
    limit = 10,
    course_id = "",
    search = "",
    sort = "order_asc"
) => {
    const offset = (page - 1) * limit;

    let where = [];
    let values = [];

    if (course_id) {
        values.push(course_id);
        where.push(
            `v.course_id = $${values.length}`
        );
    }

    if (search) {
        values.push(`%${search}%`);
        where.push(
            `v.title ILIKE $${values.length}`
        );
    }

    const whereQuery = where.length
        ? "WHERE " + where.join(" AND ")
        : "";

    const totalResult = await pool.query(
        `
        SELECT COUNT(*)
        FROM videos v
        ${whereQuery}
        `,
        values
    );

    const total = Number(
        totalResult.rows[0].count
    );

    let orderBy = "v.order_number ASC";

    switch (sort) {
        case "order_desc":
            orderBy = "v.order_number DESC";
            break;

        case "title_asc":
            orderBy = "v.title ASC";
            break;

        case "title_desc":
            orderBy = "v.title DESC";
            break;

        case "newest":
            orderBy = "v.created_at DESC";
            break;

        case "oldest":
            orderBy = "v.created_at ASC";
            break;

        default:
            orderBy = "v.order_number ASC";
    }

    const result = await pool.query(
        `
        SELECT
            v.*,
            c.title AS course_title
        FROM videos v
        LEFT JOIN courses c
            ON v.course_id = c.id
        ${whereQuery}
        ORDER BY ${orderBy}
        LIMIT $${values.length + 1}
        OFFSET $${values.length + 2}
        `,
        [...values, limit, offset]
    );

    return {
        total,
        page,
        limit,
        totalPages: Math.ceil(
            total / limit
        ),
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
        [id]
    );

    if (result.rows.length === 0) {
        throw new AppError(
            "Video topilmadi.",
            404
        );
    }

    return result.rows[0];
};

const updateVideo = async (id, data) => {
    const oldVideo = await pool.query(
        "SELECT * FROM videos WHERE id = $1",
        [id]
    );

    if (oldVideo.rows.length === 0) {
        throw new AppError(
            "Video topilmadi.",
            404
        );
    }

    const video = oldVideo.rows[0];

    const course_id =
        data.course_id ?? video.course_id;

    const title =
        data.title ?? video.title;

    const video_url =
        data.video_url ?? video.video_url;

    const duration =
        data.duration ?? video.duration;

    const order_number =
        data.order_number ??
        video.order_number;

    const course = await pool.query(
        "SELECT id FROM courses WHERE id = $1",
        [course_id]
    );

    if (course.rows.length === 0) {
        throw new AppError(
            "Bunday kurs mavjud emas.",
            404
        );
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
        [
            course_id,
            title,
            video_url,
            duration,
            order_number,
            id,
        ]
    );

    return result.rows[0];
};

const deleteVideo = async (id) => {
    const video = await pool.query(
        "SELECT id FROM videos WHERE id = $1",
        [id]
    );

    if (video.rows.length === 0) {
        throw new AppError(
            "Video topilmadi.",
            400
        );
    }

    await pool.query(
        "DELETE FROM videos WHERE id = $1",
        [id]
    );
};

const getVideosByCourse = async (courseId) => {
    const course = await pool.query(
        "SELECT id FROM courses WHERE id = $1",
        [courseId]
    );

    if (course.rows.length === 0) {
        throw new AppError(
            "Kurs topilmadi.",
            400
        );
    }

    const result = await pool.query(
        `
        SELECT *
        FROM videos
        WHERE course_id = $1
        ORDER BY order_number ASC
        `,
        [courseId]
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