import { connectDB } from "./db.js";
import app from "./app.js";

const PORT = 5080;

(async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
})();
