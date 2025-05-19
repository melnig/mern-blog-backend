import mongoose from "mongoose";

// Створюємо нову схему для моделі Post (публікація)
const PostSchema = new mongoose.Schema(
  {
    // Заголовок поста — обов’язкове текстове поле
    title: {
      type: String,
      required: true,
    },

    // Основний текст поста — обов’язкове текстове поле
    text: {
      type: String,
      required: true,
    },

    // Теги поста — масив рядків, за замовчуванням []
    tags: {
      type: Array,
      default: [],
    },

    // Кількість переглядів — число, за замовчуванням 0
    viewsCount: {
      type: Number,
      default: 0,
    },

    // Автор поста — ObjectId, що посилається на колекцію "users"
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Посилання на зображення — необов’язкове текстове поле
    imageUrl: String,
  },
  {
    // Автоматично додає createdAt і updatedAt
    timestamps: true,
  }
);

// Експортуємо модель Post (колекція буде створена як "posts")
export default mongoose.model("Post", PostSchema);
