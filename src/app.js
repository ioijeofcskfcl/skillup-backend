const express = require("express");
const app = express();
const swaggerUi = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerOptions = require("./swagger/swagger");
const authRoutes = require("./routes/auth.routes");
const adminRoutes = require("./routes/admin.routes");
const courseRoutes = require("./routes/course.routes");
const videoRoutes = require("./routes/video.routes");
const paymentRoutes = require("./routes/payment.routes");
const categoryRoutes = require("./routes/category.routes");
const userRoutes = require("./routes/user.routes");
const dashboardRoutes = require("./routes/dashboard.routes");
const progressRoutes = require("./routes/progress.routes");
const certificateRoutes = require("./routes/certificate.routes");
const postRoutes = require("./routes/post.routes");
const quizRoutes = require("./routes/quiz.routes");
const pricingRoutes = require("./routes/pricing.routes");
const mentorRoutes = require("./routes/mentor.routes");

const errorMiddleware = require("./middleware/error.middleware");
const cors = require("cors");
const loggerMiddleware = require("./middleware/logger.middleware");
const cookieParser = require("cookie-parser");

console.log("authRoutes:", typeof authRoutes);
console.log("userRoutes:", typeof userRoutes);
console.log("adminRoutes:", typeof adminRoutes);
console.log("courseRoutes:", typeof courseRoutes);
console.log("videoRoutes:", typeof videoRoutes);
console.log("paymentRoutes:", typeof paymentRoutes);
console.log("categoryRoutes:", typeof categoryRoutes);
console.log("dashboardRoutes:", typeof dashboardRoutes);
console.log("progressRoutes:", typeof progressRoutes);
console.log("certificateRoutes:", typeof certificateRoutes);
console.log("postRoutes:", typeof postRoutes);
console.log("quizRoutes:", typeof quizRoutes);
console.log("pricingRoutes:", typeof pricingRoutes);
console.log("mentorRoutes:", typeof mentorRoutes);
app.use(express.json());
app.use(cookieParser());

app.use((req, res, next) => {
    console.log("REQUEST:", req.method, req.originalUrl);
    next();
});
app.use(
    cors({
        origin: true,
        credentials: true,
    }),
);
app.use(loggerMiddleware);
const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admins", adminRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/videos", videoRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/certificates", certificateRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/quizzes", quizRoutes);
app.use("/api/pricing", pricingRoutes);
app.use("/api/mentors", mentorRoutes);

console.log("authRoutes:", typeof authRoutes);
console.log("userRoutes:", typeof userRoutes);
console.log("adminRoutes:", typeof adminRoutes);
console.log("courseRoutes:", typeof courseRoutes);
console.log("videoRoutes:", typeof videoRoutes);
console.log("paymentRoutes:", typeof paymentRoutes);
console.log("categoryRoutes:", typeof categoryRoutes);
console.log("dashboardRoutes:", typeof dashboardRoutes);
console.log("progressRoutes:", typeof progressRoutes);
console.log("certificateRoutes:", typeof certificateRoutes);
console.log("postRoutes:", typeof postRoutes);
console.log("quizRoutes:", typeof quizRoutes);
console.log("pricingRoutes:", typeof pricingRoutes);
console.log("mentorRoutes:", typeof mentorRoutes);

app.use(errorMiddleware);

module.exports = app;
