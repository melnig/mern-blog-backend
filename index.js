import express from "express"; // Імпортуємо Express — фреймворк для створення серверів на Node.js
import mongoose from "mongoose"; // Підключаємо mongoose — ORM для MongoDB (робота з базою як з об’єктами)
import multer from "multer";
import cors from "cors";
// Імпортуємо набір правил для валідації полів реєстрації
import {
  registerValidator,
  loginValidator,
  postCreateValidator,
} from "./validations.js";

import { handleValidationErrors, checkAuth } from "./utils/index.js";
import { UserController, PostController } from "./controllers/index.js";

// Підключення до MongoDB через mongoose
mongoose
  .connect("mongodb+srv://admin:Melya0206@cluster0.2irhueo.mongodb.net/blog") // 🔐 URI до MongoDB Atlas
  .then(() => console.log("DB ok!")) // Якщо з'єднання успішне — лог
  .catch((err) => console.log("DB error", err)); // Якщо помилка — лог помилки

const app = express(); // Створюємо екземпляр Express-додатку

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    cb(null, "uploads");
  },
  filename: (_, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

app.use(express.json()); // Додаємо middleware, щоб Express міг читати JSON з тіла запитів
app.use("/uploads", express.static("uploads"));
app.use(
  cors({
    origin: "http://localhost:3000", // ← дозволити тільки React-додатку
  })
);

app.post(
  "/auth/login",
  loginValidator,
  handleValidationErrors,
  UserController.login
); // Обробник маршруту для входу користувача
app.post(
  "/auth/register",
  registerValidator,
  handleValidationErrors,
  UserController.register
); // Реєстрація нового користувача (POST-запит)
app.get("/auth/me", checkAuth, UserController.getMe); // Обробник GET-запиту за маршрутом /auth/me || checkAuth — middleware, який перевіряє JWT і додає req.userId

app.post("/upload", checkAuth, upload.single("image"), (req, res) => {
  res.json({
    url: `/uploads/${req.file.originalname}`,
  });
});

app.get("/tags", PostController.getLastTags); //Отримуємо всі теги

app.get("/posts", PostController.getAll); //Отримуємо всі пости
app.get("/posts/tags", PostController.getLastTags); //Отримуємо всі пости
app.get("/posts/:id", PostController.getOne); // Отримуємо пост по ID
app.post(
  "/posts",
  checkAuth,
  postCreateValidator,
  handleValidationErrors,
  PostController.create
); // Створення нового поста
app.delete("/posts/:id", checkAuth, PostController.remove); // Видалення поста за ID
app.patch(
  "/posts/:id",
  checkAuth,
  handleValidationErrors,
  PostController.update
); // Оновлення інформації в пості за ID

// Запускаємо сервер на порту 4444
app.listen(4444, (err) => {
  if (err) {
    return console.log(err); // Якщо помилка запуску — вивести її
  }
  console.log("Server OK!"); // Інакше — повідомлення про успішний запуск
});
