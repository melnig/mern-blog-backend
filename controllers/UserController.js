// Імпортуємо JWT — бібліотеку для створення та перевірки токенів (автентифікація)
import jwt from "jsonwebtoken";
// Імпортуємо bcrypt — для хешування паролів
import bcrypt from "bcrypt";
// Функція для перевірки помилок валідації після express-validator

// Імпортуємо модель користувача (MongoDB schema)
import UserModel from "../models/User.js";

export const register = async (req, res) => {
  try {
    // Перевіряємо, чи є помилки валідації

    // Отримуємо пароль з тіла запиту
    const password = req.body.password;

    // Генеруємо "сіль" (salt) для хешування
    const salt = await bcrypt.genSalt(10);

    // Створюємо хеш пароля з цією сіллю
    const hash = await bcrypt.hash(password, salt);

    // Створюємо новий документ користувача (екземпляр моделі UserModel)
    const doc = new UserModel({
      email: req.body.email, // Email користувача
      fullName: req.body.fullName, // Повне ім’я
      avatarUrl: req.body.avatarUrl, // Аватар (не обов’язково)
      passwordHash: hash, // Хеш пароля, а не сам пароль!
    });

    // Зберігаємо користувача в базу даних
    const user = await doc.save();

    // Генеруємо JWT-токен на основі ID користувача
    const token = jwt.sign(
      {
        _id: user._id, // payload: унікальний ідентифікатор користувача
      },
      "secret123", // Секретний ключ для підпису токена (❗ у продакшені — з .env)
      { expiresIn: "30d" } // Термін дії токена — 30 днів
    );

    // Вилучаємо passwordHash зі збереженого користувача перед відповіддю
    const { passwordHash, ...userData } = user._doc;

    // Повертаємо користувача без пароля + токен
    res.json({
      ...userData,
      token,
    });
  } catch (err) {
    // Якщо сталася помилка — лог і відповідь з кодом 500
    console.log(err);
    res.status(500).json({
      message: "Can't register", // Повідомлення для клієнта
    });
  }
};

export const login = async (req, res) => {
  try {
    // Шукаємо користувача в базі даних за email
    const user = await UserModel.findOne({ email: req.body.email });

    // Якщо користувача не знайдено — повертаємо 404
    if (!user) {
      return res.status(404).json({
        message: "User not found", // Повідомлення для клієнта
      });
    }

    // Порівнюємо пароль, який ввів користувач, з хешованим паролем у базі
    const isValidPass = await bcrypt.compare(
      req.body.password, // Пароль, введений користувачем
      user._doc.passwordHash // Хеш пароля з бази
    );

    // Якщо паролі не збігаються — також повертаємо 404
    if (!isValidPass) {
      return res.status(404).json({
        message: "Invalid login or password", // Повідомлення про помилковий логін/пароль
      });
    }

    // Створюємо JWT-токен, якщо авторизація успішна
    const token = jwt.sign(
      {
        _id: user._id, // В payload додаємо ID користувача
      },
      "secret123", // Секретний ключ для підпису токена (❗ винести в .env)
      { expiresIn: "30d" } // Токен дійсний 30 днів
    );

    // Витягуємо passwordHash і все інше перед відправкою відповіді
    const { passwordHash, ...userData } = user._doc;

    // Повертаємо клієнту дані користувача + токен
    res.json({
      ...userData,
      token,
    });
  } catch (err) {
    // Якщо сталася помилка в try — лог і відповідь з 500
    console.log(err);
    res.status(500).json({
      message: "Can't login", // Повідомлення про невдалу реєстрацію
    });
  }
};

export const getMe = async (req, res) => {
  try {
    // Шукаємо користувача в базі даних по ID, який записаний у токені
    const user = await UserModel.findById(req.userId);

    // Якщо користувача не знайдено — повертаємо 404
    if (!user) {
      return res.status(404).json({
        message: "User not found", // Повідомлення для клієнта
      });
    }

    // Вилучаємо хеш пароля з документа користувача, щоб не передавати його у відповідь
    const { passwordHash, ...userData } = user._doc;

    // Повертаємо клієнту дані користувача без пароля
    res.json(userData);
  } catch (err) {
    // Якщо сталася помилка (наприклад, проблеми з базою) — лог і відповідь з кодом 500
    console.log(err);
    res.status(500).json({
      message: "Failed to get user info", // Обробка помилки
    });
  }
};
