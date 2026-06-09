import express from "express"
import connectDB from "./db.js";
import cors from "cors";
import { configDotenv } from 'dotenv';
import logger from "./middleware/logger.js";
import NotFound from "./middleware/notfound.js";
import errorhandler from "./middleware/error.js";
import AuthRouter from "./routes/authrotes.js";
import BlogRouter from "./routes/blogrotes.js";
configDotenv()
connectDB();
const PORT = process.env.PORT || 5000



const app  = express()
app.use(express.json());


app.use(cors({
    origin:
        "http://localhost:5173",
        methods: ["GET", "POST", "PATCH", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"],
        credentials: true
}))

app.use(logger);
app.use(express.urlencoded({extended: true}))
app.use("/api/v1", AuthRouter);
app.use("/api/v1", BlogRouter);
app.use(NotFound);
app.use(errorhandler);
app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`)
})