require("dotenv").config();
const app = require("./app");
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server: http://localhost:${PORT}`);
    console.log(`Swagger: http://localhost:${PORT}/api-docs`);
});
