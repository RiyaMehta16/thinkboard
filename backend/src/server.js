import express from "express";
import notesRoutes from "../src/routes/notesRoutes.js";
import { connectDB } from "./config/db.js";
import dotenv from "dotenv";
import rateLimiter from "./middleware/rateLimiter.js";
dotenv.config();
const PORT = process.env.PORT || 5001;
const app = express();

//middleware
app.use(express.json());
app.use(rateLimiter);

app.use("/api/notes", notesRoutes);
connectDB().then(() => {
  app.listen(PORT, () => console.log("Server started on PORT :", PORT));
});
