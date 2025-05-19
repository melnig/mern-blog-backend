// Імпортуємо бібліотеку для роботи з JWT
import jwt from "jsonwebtoken";

// Експортуємо middleware як функцію за замовчуванням
export default (req, res, next) => {
  // Отримуємо токен з заголовку Authorization
  // Наприклад: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  const token = (req.headers.authorization || "").replace(/Bearer\s?/, "");
  // Якщо заголовок порожній — отримаємо порожній рядок

  // Якщо токен існує:
  if (token) {
    try {
      // Перевіряємо дійсність токена, використовуючи секретний ключ
      const decoded = jwt.verify(token, "secret123");

      // Якщо токен дійсний — зберігаємо ID користувача в об’єкті запиту
      req.userId = decoded._id;

      // Переходимо до наступної middleware-функції або маршруту
      next();
    } catch (err) {
      // Якщо токен недійсний або зламався — повертаємо помилку 403 (доступ заборонено)
      return res.status(403).json({
        message: "Access denied",
      });
    }
  } else {
    // Якщо токен відсутній — повертаємо 403 (доступ заборонено)
    return res.status(403).json({
      message: "Access denied",
    });
  }
};
