import { connect, disconnect } from "mongoose";

async function connectDB() {
  try {
    await connect(process.env.MONGODB_URL);
    console.log("Database connected ✌️✌️✌️");
  } catch (error) {
    console.log(error);
    throw new Error("Database connection failed 🤯🤯🤯");
  }
}

async function disconnectDB() {
  try {
    await disconnect();
    console.log("Database disconnected");
  } catch (error) {
    console.log(error);
    throw new Error("Database disconnection failed");
  }
}

export { connectDB, disconnectDB };
