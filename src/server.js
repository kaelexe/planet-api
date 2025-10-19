import app, { startDatabase } from "./app.js";
import dotenv from "dotenv";
dotenv.config();

const PORT = process.env.PORT || 3000;

startDatabase().then(() => {
  app.listen(PORT, () => console.log(`🚀 Planet API running on port ${PORT}`));
});
