const pool = require("../db/index");
const AppError = require("../utils/utilsAppError");

const getCertificate = async (user_id, course_id) => {
    // Kurs mavjudligini tekshirish
    const course = await pool.query(
        `
        SELECT
            id,
            title
        FROM courses
        WHERE id = $1
        `,
        [course_id],
    );

    if (course.rows.length === 0) {
        throw new AppError("Kurs topilmadi.", 404);
    }

    // User kursni sotib olganmi?
    const payment = await pool.query(
        `
        SELECT id
        FROM payments
        WHERE user_id = $1
          AND course_id = $2
          AND status = 'SUCCESS'
        `,
        [user_id, course_id],
    );

    if (payment.rows.length === 0) {
        throw new AppError(
            "Siz bu kursni sotib olmagansiz.",
            403,
        );
    }

    // Kursdagi videolar soni
    const totalVideosResult = await pool.query(
        `
        SELECT COUNT(*) AS total
        FROM videos
        WHERE course_id = $1
        `,
        [course_id],
    );

    const totalVideos = Number(totalVideosResult.rows[0].total);

    // Ko'rilgan videolar soni
    const watchedVideosResult = await pool.query(
        `
        SELECT COUNT(*) AS watched
        FROM progress p
        INNER JOIN videos v
            ON p.video_id = v.id
        WHERE p.user_id = $1
          AND v.course_id = $2
          AND p.is_watched = true
        `,
        [user_id, course_id],
    );

    const watchedVideos = Number(watchedVideosResult.rows[0].watched);

    if (totalVideos === 0 || watchedVideos < totalVideos) {
        throw new AppError(
            "Sertifikat olish uchun kursni to'liq tugatishingiz kerak.",
            400,
        );
    }

    return {
        course_id: course.rows[0].id,
        course_title: course.rows[0].title,
        user_id,
        total_videos: totalVideos,
        watched_videos: watchedVideos,
        completed: true,
    };
};

module.exports = {
    getCertificate,
};