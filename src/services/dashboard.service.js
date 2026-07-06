const pool = require("../db");

const getDashboard = async () => {

    const users = await pool.query(
        "SELECT COUNT(*) FROM users"
    );

    const categories = await pool.query(
        "SELECT COUNT(*) FROM categories"
    );

    const courses = await pool.query(
        "SELECT COUNT(*) FROM courses"
    );

    const videos = await pool.query(
        "SELECT COUNT(*) FROM videos"
    );

    const payments = await pool.query(
        `
        SELECT COUNT(*)
        FROM payments
        WHERE status = 'SUCCESS'
        `
    );

    const revenue = await pool.query(
        `
        SELECT COALESCE(SUM(amount),0) AS total
        FROM payments
        WHERE status = 'SUCCESS'
        `
    );

    return {
        users: Number(users.rows[0].count),
        categories: Number(categories.rows[0].count),
        courses: Number(courses.rows[0].count),
        videos: Number(videos.rows[0].count),
        payments: Number(payments.rows[0].count),
        revenue: Number(revenue.rows[0].total),
    };
};

module.exports = {
    getDashboard,
};