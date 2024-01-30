import express from "express";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import path from "path";

const app = express();
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use("/mp3", express.static(path.join(__dirname, "/data/mp3")));
app.use("/images", express.static(path.join(__dirname, "/data/images")));

app.get("/", (req, res) => {
  res.send("Hello, world!");
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`BackEnd run with port ${PORT}`);
});
