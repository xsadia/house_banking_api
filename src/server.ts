import app from "./app";
import { createServer } from "http";

const server = createServer(app.callback());

(async () => {
  server.listen(process.env.PORT, () => {
    console.log(`server listening on port ${process.env.PORT}`);
  });
})();
