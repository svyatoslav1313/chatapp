import "dotenv/config";
import { client } from "./src/utils/db.js"; // Путь к твоему экземпляру sequelize
import { User, Chat, Message, UserChat } from "./src/models/index.js"; // Твои Sequelize модели

async function createTestDirectChat() {
  try {
    // 1. Подключаемся к БД
    await client.authenticate();
    console.log("🟢 Бд подключена...");

    // 2. Ищем двух тестовых пользователей (укажи существующие id, nickname или email)
    const user1 = await User.findOne(); // Находит первого попавшегося юзера
    const user2 = await User.findOne({
      where: {
        id: { [client.Sequelize.Op.ne]: user1.id }, // Находит любого юзера, кроме user1
      },
    });

    if (!user1 || !user2) {
      console.error("❌ Не найдено минимум 2 пользователя в БД!");
      return;
    }

    console.log(`Создаем чат между: ${user1.nickname} и ${user2.nickname}`);

    // 3. Создаем чат типа 'direct'
    const newChat = await Chat.create({
      type: "direct",
      name: null,
    });

    // 4. Связываем обоих пользователей с чатом
    // Вариант 1: Если в Sequelize настроена связи belongsToMany, работаем через метод-хелпер:
    await newChat.addUsers([user1.id, user2.id]);

    /* Вариант 2: Если связываешь вручную через модель UserChat:
    await UserChat.bulkCreate([
      { userId: user1.id, chatId: newChat.id },
      { userId: user2.id, chatId: newChat.id },
    ]);
    */

    // 5. Добавляем первое тестовое сообщение
    const message = await Message.create({
      chatId: newChat.id,
      senderId: user1.id,
      text: "Привет! Это тестовое сообщение из скрипта 🚀",
    });

    console.log("✅ Личный чат успешно создан!");
    console.log(`Chat ID: ${newChat.id}`);
    console.log(`ID сообщения: ${message.id}`);
  } catch (error) {
    console.error("❌ Ошибка при создании тестового чата:", error);
  } finally {
    await client.close();
  }
}

createTestDirectChat();
