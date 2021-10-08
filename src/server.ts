import app from "./app";
import { createServer } from "http";
import { connectDB } from "./mongodb";

const server = createServer(app.callback());

(async () => {
  await connectDB();

  console.log("mongo connected");

  server.listen(process.env.PORT, () => {
    console.log(`server listening on port ${process.env.PORT}`);
  });
})();
