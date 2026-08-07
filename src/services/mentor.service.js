const pool = require("../db/index");
const AppError = require("../utils/utilsAppError");

const createMentor = async ({
    fullname,
    profession,
    bio,
    image_url,
}) => {
    const result = await pool.query(
        `
        INSERT INTO mentors
        (
            fullname,
            profession,
            bio,
            image_url
        )
        VALUES ($1, $2, $3, $4)
        RETURNING *
        `,
        [
            fullname,
            profession || null,
            bio || null,
            image_url || null,
        ],
    );

    return result.rows[0];
};

const getAllMentors = async () => {
    const result = await pool.query(
        `
        SELECT *
        FROM mentors
        ORDER BY created_at DESC
        `,
    );

    return result.rows;
};

const getMentorById = async (id) => {
    const result = await pool.query(
        `
        SELECT *
        FROM mentors
        WHERE id = $1
        `,
        [id],
    );

    if (result.rows.length === 0) {
        throw new AppError("Mentor topilmadi.", 404);
    }

    return result.rows[0];
};

const updateMentor = async (id, data) => {
    const oldMentor = await pool.query(
        `
        SELECT *
        FROM mentors
        WHERE id = $1
        `,
        [id],
    );

    if (oldMentor.rows.length === 0) {
        throw new AppError("Mentor topilmadi.", 404);
    }

    const old = oldMentor.rows[0];

    const fullname = data.fullname ?? old.fullname;
    const profession = data.profession ?? old.profession;
    const bio = data.bio ?? old.bio;
    const image_url = data.image_url ?? old.image_url;

    const result = await pool.query(
        `
        UPDATE mentors
        SET
            fullname = $1,
            profession = $2,
            bio = $3,
            image_url = $4,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $5
        RETURNING *
        `,
        [
            fullname,
            profession,
            bio,
            image_url,
            id,
        ],
    );

    return result.rows[0];
};

const deleteMentor = async (id) => {
    const mentor = await pool.query(
        `
        SELECT id
        FROM mentors
        WHERE id = $1
        `,
        [id],
    );

    if (mentor.rows.length === 0) {
        throw new AppError("Mentor topilmadi.", 404);
    }

    await pool.query(
        `
        DELETE FROM mentors
        WHERE id = $1
        `,
        [id],
    );
};

module.exports = {
    createMentor,
    getAllMentors,
    getMentorById,
    updateMentor,
    deleteMentor,
};