import app from "./app/app.js";
import connectdb from "./db/index.js";

const PORT = process.env.SERVER_PORT || 8000;

connectdb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}/`);
    });
  })
  .catch((err) => {
    console.log("MONGO db connection Error !!!", err);
  });
