const pool = require("../db/index");
const AppError = require("../utils/utilsAppError");

const createPost = async ({ user_id, title, content, image_url }) => {
    const result = await pool.query(
        `
        INSERT INTO posts
        (
            user_id,
            title,
            content,
            image_url
        )
        VALUES ($1, $2, $3, $4)
        RETURNING *
        `,
        [user_id, title, content, image_url || null],
    );

    return result.rows[0];
};

const getAllPosts = async (page = 1, limit = 10) => {
    const offset = (page - 1) * limit;

    const totalResult = await pool.query(
        `SELECT COUNT(*) FROM posts`,
    );

    const total = Number(totalResult.rows[0].count);

    const result = await pool.query(
        `
        SELECT
            p.id,
            p.title,
            p.content,
            p.image_url,
            p.created_at,
            p.updated_at,
            u.id AS user_id,
            u.fullname AS user_name
        FROM posts p
        INNER JOIN users u
            ON p.user_id = u.id
        ORDER BY p.created_at DESC
        LIMIT $1
        OFFSET $2
        `,
        [limit, offset],
    );

    return {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        data: result.rows,
    };
};

const getPostById = async (id) => {
    const result = await pool.query(
        `
        SELECT
            p.id,
            p.title,
            p.content,
            p.image_url,
            p.created_at,
            p.updated_at,
            u.id AS user_id,
            u.fullname AS user_name
        FROM posts p
        INNER JOIN users u
            ON p.user_id = u.id
        WHERE p.id = $1
        `,
        [id],
    );

    if (result.rows.length === 0) {
        throw new AppError("Post topilmadi.", 404);
    }

    return result.rows[0];
};

const updatePost = async (id, user_id, data) => {
    const oldPost = await pool.query(
        `SELECT * FROM posts WHERE id = $1`,
        [id],
    );

    if (oldPost.rows.length === 0) {
        throw new AppError("Post topilmadi.", 404);
    }

    if (oldPost.rows[0].user_id !== user_id) {
        throw new AppError(
            "Siz bu postni o'zgartira olmaysiz.",
            403,
        );
    }

    const post = oldPost.rows[0];

    const title = data.title ?? post.title;
    const content = data.content ?? post.content;
    const image_url = data.image_url ?? post.image_url;

    const result = await pool.query(
        `
        UPDATE posts
        SET
            title = $1,
            content = $2,
            image_url = $3,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $4
        RETURNING *
        `,
        [title, content, image_url, id],
    );

    return result.rows[0];
};

const deletePost = async (id, user_id) => {
    const post = await pool.query(
        `SELECT * FROM posts WHERE id = $1`,
        [id],
    );

    if (post.rows.length === 0) {
        throw new AppError("Post topilmadi.", 404);
    }

    if (post.rows[0].user_id !== user_id) {
        throw new AppError(
            "Siz bu postni o'chira olmaysiz.",
            403,
        );
    }

    await pool.query(
        `DELETE FROM posts WHERE id = $1`,
        [id],
    );
};

module.exports = {
    createPost,
    getAllPosts,
    getPostById,
    updatePost,
    deletePost,
};