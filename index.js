const PORT = 3000;
const express = require("express");
const server = express();
const apiRouter = require("./api");
const { client } = require("./db");
require("dotenv").config();

client.connect();

//-----MIDDLEWARE---
const morgan = require("morgan");
server.use(morgan("dev"));

server.use(express.json());

server.use((req, res, next) => {
  console.log("<____Body Logger START____>");
  console.log(req.body);
  console.log("<_____Body Logger END_____>");

  next();
});

//---ROUTES---
server.use("/api", apiRouter);

server.listen(PORT, () => {
  console.log("The server is up on port", PORT);
});
