// Імпортуємо функцію `body` з express-validator для валідації вхідних даних у тілі запиту
import { body } from "express-validator";

// Експортуємо масив правил валідації як loginValidator
export const loginValidator = [
  // Перевірка поля email: чи має правильний формат електронної пошти
  body("email", "Invalid format email").isEmail(),

  // Перевірка поля пароля: довжина має бути щонайменше 5 символів
  body("password", "Password must be is more a 5 symbols").isLength({ min: 5 }),
];

// Експортуємо масив правил валідації як registerValidator
export const registerValidator = [
  // Перевірка поля email: чи має правильний формат електронної пошти
  body("email", "Invalid format email").isEmail(),

  // Перевірка поля пароля: довжина має бути щонайменше 5 символів
  body("password", "Password must be is more a 5 symbols").isLength({ min: 5 }),

  // Перевірка повного імені: довжина має бути щонайменше 3 символи
  body("fullName", "Fullname must be is more a 3 symbols").isLength({ min: 3 }),

  // Перевірка URL-адреси аватарки: якщо вона вказана, має бути коректною URL-адресою
  body("avatarUrl", "Invalid link to avatar").optional().isURL(),
];

export const postCreateValidator = [
  // Перевірка поля title: довжина має бути не менше 3 символів і строка
  body("title", "Enter post title").isLength({ min: 3 }).isString(),

  // Перевірка поля text: довжина має бути щонайменше 10 символів і строка
  body("text", "Enter post text").isLength({ min: 10 }).isString(),

  // Перевірка тегів поста: опціонально і має бути строка
  body("tags", "Invalid tags format(must be an array)").optional().isArray(),

  // Перевірка URL-адреси зображення: опціонально і якщо вона вказана, має бути коректною URL-адресою
  body("imageUrl", "Invalid link to image").optional().isString(),
];
