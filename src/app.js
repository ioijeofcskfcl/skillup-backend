const express = require("express");
const app = express();
const swaggerUi = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerOptions = require('./swagger/swagger'); 
const authRoutes = require("./routes/auth.routes");

app.use(express.json());
const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.use("/api/auth", authRoutes);

module.exports = app;