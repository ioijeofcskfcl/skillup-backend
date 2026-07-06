const pool = require("../db/index");

const createPayment = async ({
    user_id,
    course_id,
    payment_method,
}) => {

    const allowedMethods = ["CLICK", "PAYME", "VISA"];

    if (!allowedMethods.includes(payment_method)) {
        throw new Error(
            "To'lov usuli noto'g'ri. Faqat CLICK, PAYME yoki VISA ishlatish mumkin."
        );
    }

    const course = await pool.query(
        "SELECT * FROM courses WHERE id = $1",
        [course_id]
    );

    if (course.rows.length === 0) {
        throw new Error("Kurs topilmadi.");
    }

    const existingPayment = await pool.query(
        `
        SELECT *
        FROM payments
        WHERE user_id = $1
          AND course_id = $2
          AND status IN ('PENDING','SUCCESS')
        `,
        [user_id, course_id]
    );

    if (existingPayment.rows.length > 0) {
        throw new Error(
            "Siz bu kursni allaqachon sotib olgansiz."
        );
    }

    const amount = course.rows[0].price;
    console.log({
    user_id,
    course_id,
    payment_method,
}); 

    const result = await pool.query(
        `
        INSERT INTO payments
        (
            user_id,
            course_id,
            amount,
            payment_method,
            status
        )
        VALUES ($1,$2,$3,$4,'SUCCESS')
        RETURNING *
        `,
        [
            user_id,
            course_id,
            amount,
            payment_method,
        ]
    );

    return result.rows[0];
};
const getMyCourses = async (user_id) => {
    const result = await pool.query(
        `
        SELECT
            c.id,
            c.title,
            c.description,
            c.price,
            c.image_url,
            cat.name AS category_name,
            p.payment_method,
            p.created_at AS purchased_at
        FROM payments p
        INNER JOIN courses c
            ON p.course_id = c.id
        LEFT JOIN categories cat
            ON c.category_id = cat.id
        WHERE
            p.user_id = $1
            AND p.status = 'SUCCESS'
        ORDER BY p.created_at DESC
        `,
        [user_id]
    );

    return result.rows;
};

module.exports = {
    createPayment,
    getMyCourses,

};