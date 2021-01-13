import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import path from "path";
const __dirname = path.resolve();
const app = express();
const port = 3001;

import tourRoute from "./src/routes/tourRoute.js";
import authenticationRoute from "./src/routes/authenticationRoute.js";
import paymentRoute from "./src/routes/paymentRoute.js";

// Add middleware for parsing URL encoded bodies (which are usually sent by browser)
app.use(cors());
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

// you can access image
app.use("/vibotour", express.static(__dirname + "/public"));

app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Access-Control-Allow-Headers"
  );
  next();
});

app.use("/api/v1", tourRoute);
app.use("/api/v1", authenticationRoute);
app.use("/api/v1", paymentRoute);

app.listen(port).on("listening", () => {
  console.log(`App 🚀 are live on ${port}`);
});

export default app;
