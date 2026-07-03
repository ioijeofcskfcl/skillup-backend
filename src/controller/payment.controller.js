const paymentService = require("../services/payment.service");

const createPayment = async (req, res) => {
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

module.exports = {
    createPayment,
};