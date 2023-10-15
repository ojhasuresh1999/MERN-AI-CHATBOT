import app from "./app.js";
import { connectDB } from "./db/connection.js";

const PORT = process.env.PORT || 5000;
//! Connect to the database and start the server
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server listening on port http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.log(err.message);
  });
