import { clerkMiddleware } from "@clerk/express";
import express from "express";
import path from "path";

import { connectDB } from "./config/db.js";
import { ENV } from "./config/env.js";

const app = express();

const __dirname = path.resolve();

app.use(clerkMiddleware()); // adds auth object under the request => req.auth

app.get("/api/health", (req, res) => {
  res.status(200).json({ message: "Success" });
});

// make our app ready for deployment
if (ENV.NODE_ENV === "production") {
  const distPath = path.join(__dirname, "../admin/dist");

  app.use(express.static(distPath));

  app.get("/{*any}", (req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
}
const startServer = async () => {
  await connectDB();
  app.listen(ENV.PORT, () => {
    console.log("Server is up and running");
  });
};

startServer();
