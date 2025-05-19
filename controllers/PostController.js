// Імпортуємо модель Post з бази даних
import PostModel from "../models/Post.js";

/**
 * Отримати всі пости
 */
export const getAll = async (req, res) => {
  try {
    // Знаходимо всі пости, додаючи повну інформацію про користувача (user)
    const posts = await PostModel.find()
      .populate("user", "-passwordHash")
      .exec();
    res.json(posts); // Повертаємо JSON з постами
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Cant get posts", // Виводимо помилку, якщо щось пішло не так
    });
  }
};

/**
 * Отримати всі теги
 */
export const getLastTags = async (req, res) => {
  try {
    // Знаходимо всі пости, в яких шукаємо по ліміту
    const posts = await PostModel.find().limit(3).exec();

    const tags = posts
      .map((obj) => obj.tags)
      .flat()
      .slice(0, 3);
    res.json(tags); // Повертаємо JSON з тегами
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Cant get tags", // Виводимо помилку, якщо щось пішло не так
    });
  }
};

/**
 * Отримати один пост за ID та збільшити лічильник переглядів
 */
export const getOne = async (req, res) => {
  try {
    const postId = req.params.id;

    // Шукаємо пост за ID і одночасно збільшуємо поле viewsCount на 1
    const post = await PostModel.findOneAndUpdate(
      { _id: postId },
      { $inc: { viewsCount: 1 } }, // Інкрементуємо лічильник
      { new: true } // Повертаємо оновлений пост
    )
      .populate("user")
      .exec();

    if (!post) {
      return res.status(404).json({
        message: "Can't find post", // Якщо пост не знайдено
      });
    }

    res.json(post); // Повертаємо знайдений та оновлений пост
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Can't get post", // Обробка помилки
    });
  }
};

/**
 * Видалити пост за ID
 */
export const remove = async (req, res) => {
  try {
    const postId = req.params.id;

    // Знаходимо та видаляємо пост
    const post = await PostModel.findByIdAndDelete(postId);

    if (!post) {
      return res.status(404).json({
        message: "Can't find post", // Якщо пост не знайдено
      });
    }

    res.json({
      success: true, // Повідомляємо про успішне видалення
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Can't delete post", // Якщо сталася помилка
    });
  }
};

/**
 * Створити новий пост
 */
export const create = async (req, res) => {
  try {
    // Створюємо новий документ (пост)
    console.log("BODY:", req.body);
    const doc = new PostModel({
      title: req.body.title,
      text: req.body.text,
      imageUrl: req.body.imageUrl,
      tags: req.body.tags,
      user: req.userId, // userId дістається з токена через middleware
    });

    // Зберігаємо пост у базі
    const post = await doc.save();
    res.json(post); // Повертаємо створений пост
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Cant create post", // У разі помилки
    });
  }
};

/**
 * Оновити пост
 */
export const update = async (req, res) => {
  try {
    const postId = req.params.id;

    // Оновлюємо документ за ID
    await PostModel.updateOne(
      { _id: postId }, // Фільтр
      {
        title: req.body.title,
        text: req.body.text,
        imageUrl: req.body.imageUrl,
        user: req.userId,
        tags: req.body.tags,
      }
    );

    res.json({
      success: true, // Повідомлення про успішне оновлення
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Cant update post", // Обробка помилки
    });
  }
};
