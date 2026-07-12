import express from "express"
import connectDB from "./db.js";
import cors from "cors";
import { configDotenv } from 'dotenv';
import logger from "./middleware/logger.js";
import NotFound from "./middleware/notfound.js";
import errorhandler from "./middleware/error.js";
import AuthRouter from "./routes/authrotes.js";
import BlogRouter from "./routes/blogrotes.js";
import FavriteRouter from "./routes/favriteroutes.js";
import likeRoutes from "./routes/likeroutes.js";
import activityRouter from "./routes/activityRoutes.js";
configDotenv()
connectDB();
const PORT = process.env.PORT || 5000



const app  = express()
app.use(express.json());


app.use(cors({
    origin: process.env.FRONTEND_URL || "https://blogify-eight-xi.vercel.app",
    methods: ["GET", "POST", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
}))

app.use(logger);
app.use(express.urlencoded({extended: true}))
app.use("/api/v1", AuthRouter);
app.use("/api/v1", BlogRouter);
app.use("/api/v1", FavriteRouter);
app.use("/api/v1/",likeRoutes)
app.use("/api/v1",activityRouter)
app.use(NotFound);
app.use(errorhandler);

if (process.env.NODE_ENV !== "production") {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}

export default app;