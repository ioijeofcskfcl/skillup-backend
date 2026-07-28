require("dotenv").config();

const swaggerOptions = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "SkillUp API",
            version: "1.0.0",
            description: "SkillUp API",
        },

        servers: [
            {
                url:
                    process.env.NODE_ENV === "production"
                        ? process.env.BASE_URL
                        : "http://localhost:5001",
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
