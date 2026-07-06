const paymentService = require("../services/payment.service");

const createPayment = async (req, res) => {
    console.log("REQ.USER:", req.user);
    console.log("REQ.BODY:", req.body);

    try {
        const payment = await paymentService.createPayment({
            user_id: req.user.id,
            course_id: req.body.course_id,
            payment_method: req.body.payment_method,
        });

        return res.status(201).json({
            success: true,
            message: "To'lov muvaffaqiyatli yaratildi.",
            data: payment,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};
const getMyCourses = async (req, res) => {
    try {
        const courses = await paymentService.getMyCourses(req.user.id);

        return res.status(200).json({
            success: true,
            data: courses,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

module.exports = {
    createPayment,
    getMyCourses,
};