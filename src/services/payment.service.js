const pool = require("../db/index");

const createPayment = async ({
    user_id,
    course_id,
    payment_method,
}) => {

    const course = await pool.query(
        "SELECT * FROM courses WHERE id = $1",
        [course_id]
    );

    if (course.rows.length === 0) {
        throw new Error("Kurs topilmadi.");
    }

    const amount = course.rows[0].price;

    const result = await pool.query(
        `
        INSERT INTO payments
        (
            user_id,
            course_id,
            amount,
            payment_method
        )
        VALUES ($1,$2,$3,$4)
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

module.exports = {
    createPayment,
};