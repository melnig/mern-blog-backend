// Імпортуємо mongoose — бібліотеку для роботи з MongoDB у Node.js
import mongoose from "mongoose";

// Створюємо нову схему для моделі User (Користувач)
const UserSchema = new mongoose.Schema(
  {
    // Повне ім'я користувача — обов’язкове текстове поле
    fullName: {
      type: String, // Тип: текст
      required: true, // Поле є обов’язковим (валидація на рівні схеми)
    },

    // Email користувача — обов’язковий, унікальний
    email: {
      type: String, // Тип: текст
      required: true, // Має бути заповнено
      unique: true, // Унікальне (не може повторюватися в базі)
    },

    // Хеш пароля (не сам пароль) — обов’язковий
    passwordHash: {
      type: String,
      required: true,
    },

    // Посилання на аватарку — необов’язкове поле
    avatarUrl: String,
  },
  {
    // Друга частина — налаштування схеми
    timestamps: true, // Автоматично додає поля createdAt та updatedAt
  }
);

// Експортуємо модель User, щоб її можна було імпортувати у файлах, наприклад, index.js
// mongoose.model створює або отримує колекцію `users` (назва автоматично в нижньому регістрі і в множині)
export default mongoose.model("User", UserSchema);
