require("dotenv").config();
const port = process.env.PORT || 5001;

const swaggerOptions = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "skillUp Klub API",
            version: "1.0.0",
            description: "skillUp klub loyihasi uchun API hujjatlari",
        },
        servers: [{ url: `http://localhost:${port}` }],
    },
   apis: ["./src/routes/auth.routes.js"],
};

module.exports = swaggerOptions;