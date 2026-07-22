import { Chat } from "./Chat.js";
import { Message } from "./Message.js";
import { Token } from "./Token.js";
import { User } from "./User.js";
import { UserChat } from "./UserChat.js";

User.belongsToMany(Chat, { through: UserChat, foreignKey: "userId" });
Chat.belongsToMany(User, { through: UserChat, foreignKey: "chatId" });

// 2. Чат и Сообщения (1:N)
Chat.hasMany(Message, { foreignKey: "chatId", onDelete: "CASCADE" });
Message.belongsTo(Chat, { foreignKey: "chatId" });

// 3. Отправитель и Сообщения (1:N)
User.hasMany(Message, { foreignKey: "senderId" });
Message.belongsTo(User, { foreignKey: "senderId", as: "sender" });

// 4. Токены пользователя (если есть)
Token.belongsTo(User);
User.hasOne(Token);

export { User, Chat, Message, UserChat, Token };
