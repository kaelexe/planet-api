import dotenv from "dotenv";
import app, { startDatabase } from "./app.js";

dotenv.config();

const PORT: number = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

startDatabase().then(() => {
  app.listen(PORT, () => console.log(`🚀 Planet API running on port ${PORT}`));
});
