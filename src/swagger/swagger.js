require("dotenv").config();
const port = process.env.PORT || 5001;

const swaggerOptions = {
    definition: {
    openapi: "3.0.0",
    info: {
        title: "SkillUp API",
        version: "1.0.0",
        description: "SkillUp API hujjatlari",
    },
    servers: [
        {
            url: `http://localhost:${port}`,
        },
    ],
    components: {
        securitySchemes: {
            bearerAuth: {
                type: "http",
                scheme: "bearer",
                bearerFormat: "JWT",
            },
        },
    },
    security: [
        {
            bearerAuth: [],
        },
    ],
},
   apis: ["./src/routes/*.js"],
};


module.exports = swaggerOptions;