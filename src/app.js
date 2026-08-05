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
const errorMiddleware = require("./middleware/error.middleware");
const cors = require("cors");
const loggerMiddleware = require("./middleware/logger.middleware");
const cookieParser = require("cookie-parser");


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


app.use(errorMiddleware);

module.exports = app;
