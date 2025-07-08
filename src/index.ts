import app from "./app/app";
import connectdb from "./db";

const PORT: string | number = process.env.SERVER_PORT || 8000;

connectdb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}/`);
    });
  })
  .catch((err: Error) => {
    console.log("MONGO db connection Error !!!", err);
  });
