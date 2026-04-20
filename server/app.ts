import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import gameRoutes from "./gameRoutes.js";
import highscoreRoutes from "./highscoreRoutes.js";
import cors from "cors";

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(cors({ origin: "http://localhost:5173" }));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../views"));

app.use("/api/game", gameRoutes);
app.use("/api/highscore", highscoreRoutes);
app.use("/highscore", highscoreRoutes);
app.use("/about", (_req, res) => res.render("about"));

app.use(express.static(path.join(__dirname, "../client/dist")));

app.get("/{*path}", (_req, res) => {
  res.sendFile(path.join(__dirname, "../client/dist/index.html"));
});

export default app;
