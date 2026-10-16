const express = require("express");
const app = express();
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const cors = require("cors");
dotenv.config();
const PORT = process.env.PORT || 5000;
app.use(express.json());
app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true
}));
app.use(cookieParser());
const router = require("./Routes/course.route");
const ConnectDB = require("./Config/Connect.DB");
const router2 = require("./Routes/enrollment.routes");
app.use("/api",router)
app.use("/api/enroll",router2)
const startServer = async () => {
    await ConnectDB();
    app.listen(PORT,()=>{
        console.log(`Server is running on port ${PORT}`);
    })
}

startServer();
