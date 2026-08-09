const pool = require("../db/index");
const crypto = require("crypto");

const { Upload } = require("@aws-sdk/lib-storage");

const s3 = require("../config/s3");

const AppError = require("../utils/utilsAppError");

const uploadVideoToS3 = async (file) => {
    if (!file) {
        throw new AppError(
            "Video fayl yuborilmadi.",
            400,
        );
    }

    if (!process.env.AWS_BUCKET_NAME) {
        throw new AppError(
            "AWS_BUCKET_NAME sozlanmagan.",
            500,
        );
    }

    if (!process.env.AWS_REGION) {
        throw new AppError(
            "AWS_REGION sozlanmagan.",
            500,
        );
    }

    if (!process.env.AWS_ACCESS_KEY_ID) {
        throw new AppError(
            "AWS_ACCESS_KEY_ID sozlanmagan.",
            500,
        );
    }

    if (!process.env.AWS_SECRET_ACCESS_KEY) {
        throw new AppError(
            "AWS_SECRET_ACCESS_KEY sozlanmagan.",
            500,
        );
    }

    const extensionMap = {
        "video/mp4": "mp4",
        "video/mpeg": "mpeg",
        "video/quicktime": "mov",
        "video/x-msvideo": "avi",
        "video/x-matroska": "mkv",
    };

    const extension =
        extensionMap[file.mimetype] || "mp4";

    const fileName =
        crypto.randomBytes(16).toString("hex") +
        "-" +
        Date.now() +
        "." +
        extension;

    const key = `videos/${fileName}`;

    const upload = new Upload({
        client: s3,

        params: {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: key,
            Body: file.buffer,
            ContentType: file.mimetype,
        },

        partSize: 10 * 1024 * 1024,
        queueSize: 1,

        leavePartsOnError: false,
    });

    try {
        await upload.done();
    } catch (error) {
        console.error("S3 UPLOAD ERROR:", error);

        throw new AppError(
            `Video S3 ga yuklanmadi: ${
                error.message || "Noma'lum AWS xatosi"
            }`,
            500,
        );
    }

    return `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
};

const createVideo = async ({
    course_id,
    title,
    duration,
    order_number,
    file,
}) => {
    const course = await pool.query(
        "SELECT id FROM courses WHERE id = $1",
        [course_id],
    );

    if (course.rows.length === 0) {
        throw new AppError(
            "Bunday kurs mavjud emas.",
            404,
        );
    }

    const video_url = await uploadVideoToS3(file);

    try {
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
                Number(duration),
                Number(order_number),
            ],
        );

        return result.rows[0];
    } catch (error) {
        throw new AppError(
            `Video databasega yozilmadi: ${error.message}`,
            500,
        );
    }
};

const getAllVideos = async (
    page = 1,
    limit = 10,
    course_id = "",
    search = "",
    sort = "order_asc",
) => {
    page = Math.max(Number(page) || 1, 1);
    limit = Math.max(Number(limit) || 10, 1);

    const offset = (page - 1) * limit;

    const where = [];
    const values = [];

    if (course_id) {
        values.push(course_id);

        where.push(
            `v.course_id = $${values.length}`,
        );
    }

    if (search) {
        values.push(`%${search}%`);

        where.push(
            `v.title ILIKE $${values.length}`,
        );
    }

    const whereQuery = where.length
        ? `WHERE ${where.join(" AND ")}`
        : "";

    const totalResult = await pool.query(
        `
        SELECT COUNT(*)
        FROM videos v
        ${whereQuery}
        `,
        values,
    );

    const total = Number(
        totalResult.rows[0].count,
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
        throw new AppError(
            "Video topilmadi.",
            404,
        );
    }

    return result.rows[0];
};

const updateVideo = async (id, data) => {
    const oldVideo = await pool.query(
        "SELECT * FROM videos WHERE id = $1",
        [id],
    );

    if (oldVideo.rows.length === 0) {
        throw new AppError(
            "Video topilmadi.",
            404,
        );
    }

    const old = oldVideo.rows[0];

    const course_id =
        data.course_id ?? old.course_id;

    const title =
        data.title ?? old.title;

    const duration =
        data.duration ?? old.duration;

    const order_number =
        data.order_number ?? old.order_number;

    const course = await pool.query(
        "SELECT id FROM courses WHERE id = $1",
        [course_id],
    );

    if (course.rows.length === 0) {
        throw new AppError(
            "Bunday kurs mavjud emas.",
            404,
        );
    }

    const result = await pool.query(
        `
        UPDATE videos
        SET
            course_id = $1,
            title = $2,
            duration = $3,
            order_number = $4,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $5
        RETURNING *
        `,
        [
            course_id,
            title,
            Number(duration),
            Number(order_number),
            id,
        ],
    );

    return result.rows[0];
};

const deleteVideo = async (id) => {
    const video = await pool.query(
        "SELECT id FROM videos WHERE id = $1",
        [id],
    );

    if (video.rows.length === 0) {
        throw new AppError(
            "Video topilmadi.",
            404,
        );
    }

    await pool.query(
        "DELETE FROM videos WHERE id = $1",
        [id],
    );
};

const getVideosByCourse = async (courseId) => {
    const course = await pool.query(
        "SELECT id FROM courses WHERE id = $1",
        [courseId],
    );

    if (course.rows.length === 0) {
        throw new AppError(
            "Kurs topilmadi.",
            404,
        );
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