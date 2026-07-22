import "dotenv/config";
import { client } from "./src/utils/db.js";
import "./src/models/index.js"; // Подтягивает все модели и их связи

async function setup() {
  try {
    await client.sync({ force: true });
    console.log("Database synchronized successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Sync error:", error);
    process.exit(1);
  }
}

setup();
