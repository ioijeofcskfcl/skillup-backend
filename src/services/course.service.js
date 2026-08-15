const pool = require("../db/index");
const AppError = require("../utils/utilsAppError");

const {
    S3Client,
    PutObjectCommand,
} = require("@aws-sdk/client-s3");

const crypto = require("crypto");

const s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});

// ===============================
// CREATE COURSE
// ===============================
const createCourse = async ({
    category_id,
    title,
    description,
    price,
    image,
    created_by,
}) => {
    const category = await pool.query(
        "SELECT * FROM categories WHERE id = $1",
        [category_id],
    );

    if (category.rows.length === 0) {
        throw new AppError("Kategoriya topilmadi.", 404);
    }

    if (!image) {
        throw new AppError("Kurs rasmi yuklanishi kerak.", 400);
    }

    const fileName = `courses/${crypto.randomUUID()}-${image.originalname}`;

    const uploadCommand = new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: fileName,
        Body: image.buffer,
        ContentType: image.mimetype,
    });

    await s3.send(uploadCommand);

    const image_url =
        `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;

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
        ],
    );

    return result.rows[0];
};

// ===============================
// GET ALL COURSES
// ===============================
const getAllCourses = async (
    page = 1,
    limit = 10,
    category_id = "",
    search = "",
    sort = "newest",
) => {
    const offset = (page - 1) * limit;

    let where = [];
    let values = [];

    if (category_id) {
        values.push(category_id);
        where.push(`c.category_id = $${values.length}`);
    }

    if (search) {
        values.push(`%${search}%`);
        where.push(
            `(c.title ILIKE $${values.length} OR c.description ILIKE $${values.length})`,
        );
    }

    const whereQuery =
        where.length
            ? "WHERE " + where.join(" AND ")
            : "";

    const totalResult = await pool.query(
        `
        SELECT COUNT(*)
        FROM courses c
        ${whereQuery}
        `,
        values,
    );

    const total = Number(totalResult.rows[0].count);

    let orderBy = "c.created_at DESC";

    switch (sort) {
        case "oldest":
            orderBy = "c.created_at ASC";
            break;

        case "price_asc":
            orderBy = "c.price ASC";
            break;

        case "price_desc":
            orderBy = "c.price DESC";
            break;

        case "title_asc":
            orderBy = "c.title ASC";
            break;

        case "title_desc":
            orderBy = "c.title DESC";
            break;

        default:
            orderBy = "c.created_at DESC";
    }

    const result = await pool.query(
        `
        SELECT
            c.*,
            u.fullname AS admin_name,
            u.email AS admin_email
        FROM courses c
        LEFT JOIN users u
            ON c.created_by = u.id
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

// ===============================
// GET COURSE BY ID
// ===============================
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
        [id],
    );

    if (result.rows.length === 0) {
        throw new AppError("Kurs topilmadi.", 404);
    }

    return result.rows[0];
};

// ===============================
// UPDATE COURSE
// ===============================
const updateCourse = async (id, data) => {
    const oldCourse = await pool.query(
        "SELECT * FROM courses WHERE id = $1",
        [id],
    );

    if (oldCourse.rows.length === 0) {
        throw new AppError("Kurs topilmadi.", 404);
    }

    const course = oldCourse.rows[0];

    // Category tekshirish
    if (data.category_id) {
        const category = await pool.query(
            "SELECT * FROM categories WHERE id = $1",
            [data.category_id],
        );

        if (category.rows.length === 0) {
            throw new AppError("Kategoriya topilmadi.", 404);
        }
    }

    const category_id =
        data.category_id ?? course.category_id;

    const title =
        data.title ?? course.title;

    const description =
        data.description ?? course.description;

    const price =
        data.price ?? course.price;

    let image_url = course.image_url;

    // Agar yangi rasm yuborilgan bo'lsa
    if (data.image) {
        const fileName =
            `courses/${crypto.randomUUID()}-${data.image.originalname}`;

        const uploadCommand = new PutObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: fileName,
            Body: data.image.buffer,
            ContentType: data.image.mimetype,
        });

        await s3.send(uploadCommand);

        image_url =
            `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;
    }

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
        ],
    );

    return result.rows[0];
};

// ===============================
// DELETE COURSE
// ===============================
const deleteCourse = async (id) => {
    const course = await pool.query(
        "SELECT id FROM courses WHERE id = $1",
        [id],
    );

    if (course.rows.length === 0) {
        throw new AppError("Kurs topilmadi.", 404);
    }

    await pool.query(
        "DELETE FROM courses WHERE id = $1",
        [id],
    );
};

// ===============================
// GET COURSE VIDEOS
// ===============================
const getCourseVideos = async (courseId, userId) => {
    const course = await pool.query(
        `
        SELECT id
        FROM courses
        WHERE id = $1
        `,
        [courseId],
    );

    if (!course.rows.length) {
        throw new AppError("Kurs topilmadi.", 404);
    }

    const result = await pool.query(
        `
        SELECT
            v.id,
            v.title,
            v.video_url,
            v.duration,
            COALESCE(p.is_watched, FALSE) AS is_watched
        FROM videos v
        LEFT JOIN progress p
            ON p.video_id = v.id
            AND p.user_id = $2
        WHERE v.course_id = $1
        ORDER BY v.created_at ASC
        `,
        [courseId, userId],
    );

    return result.rows;
};

module.exports = {
    createCourse,
    getAllCourses,
    getCourseById,
    updateCourse,
    deleteCourse,
    getCourseVideos,
};