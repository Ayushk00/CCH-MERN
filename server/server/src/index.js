import dotenv from "dotenv";

dotenv.config({
  path: './.env'
});

import { connectdb } from "./db/connection.db.js";
import { app } from "./app.js";


// The rest of your code remains the same
connectdb()
  .then(() => {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Listening on port : ${PORT}`);
    });
  })
  .catch((error) => {
    console.log("MongoDB connection error!!!", error);
  });

app.get("/", (req, res) => {
  res.send("<h1>Hello World!</h1>");
});
