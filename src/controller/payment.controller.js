const paymentService = require("../services/payment.service");

const createPayment = async (req, res, next) => {
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
        next(error);
    }
};
const getMyCourses = async (req, res, next) => {
    try {
        const courses = await paymentService.getMyCourses(req.user.id);

        return res.status(200).json({
            success: true,
            data: courses,
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createPayment,
    getMyCourses,
};
