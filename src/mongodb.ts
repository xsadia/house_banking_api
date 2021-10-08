import { connect, connection } from "mongoose";

export const connectDB = async () => {
  await connect(process.env.MONGODB_URL || "mongodb://localhost:27017/");

  connection.on("error", (err) => {
    console.log("err", err);
  });

  connection.on("connected", (err, res) => {
    console.log("mongoose is connected");
  });
};
