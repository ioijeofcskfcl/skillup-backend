const pool = require("../db/index");
const AppError = require("../utils/utilsAppError");

const updateProgress = async (user_id, video_id, is_watched) => {
    const video = await pool.query(
        `
        SELECT id
        FROM videos
        WHERE id = $1
        `,
        [video_id],
    );

    if (!video.rows.length) {
        throw new AppError("Video topilmadi.", 404);
    }

    const progress = await pool.query(
        `
        SELECT id
        FROM progress
        WHERE user_id = $1
          AND video_id = $2
        `,
        [user_id, video_id],
    );

    let result;

    if (progress.rows.length) {
        result = await pool.query(
            `
            UPDATE progress
            SET
                is_watched = $1,
                watched_at = CASE
                    WHEN $1 = true THEN CURRENT_TIMESTAMP
                    ELSE NULL
                END
            WHERE user_id = $2
              AND video_id = $3
            RETURNING *
            `,
            [is_watched, user_id, video_id],
        );
    } else {
        result = await pool.query(
            `
            INSERT INTO progress
            (
                user_id,
                video_id,
                is_watched,
                watched_at
            )
            VALUES
            (
                $1,
                $2,
                $3,
                CASE
                    WHEN $3 = true THEN CURRENT_TIMESTAMP
                    ELSE NULL
                END
            )
            RETURNING *
            `,
            [user_id, video_id, is_watched],
        );
    }

    return result.rows[0];
};

const getCourseProgress = async (user_id, course_id) => {
    const totalVideos = await pool.query(
        `
        SELECT COUNT(*) AS total
        FROM videos
        WHERE course_id = $1
        `,
        [course_id],
    );

    const watchedVideos = await pool.query(
        `
        SELECT COUNT(*) AS watched
        FROM progress p
        INNER JOIN videos v
            ON p.video_id = v.id
        WHERE
            p.user_id = $1
            AND v.course_id = $2
            AND p.is_watched = true
        `,
        [user_id, course_id],
    );

    const total = Number(totalVideos.rows[0].total);
    const watched = Number(watchedVideos.rows[0].watched);

    return {
        total,
        watched,
        progress: total === 0 ? 0 : Math.round((watched / total) * 100),
    };
};

module.exports = {
    updateProgress,
    getCourseProgress,
};