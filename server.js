const express = require("express");

const projectRouter = require("./projectRouter.js");

const server = express();

server.use(express.json());
server.use(logger);
server.use("/api/projects", projectRouter);
server.use("/", (req, res) => res.send("API up and running!"));

function logger(req, res, next) {
  const date = new Date();
  const timestamp = date.toUTCString();
  console.log(
    `(${timestamp}) Request method: ${req.method}, Request URL: ${
      req.originalUrl
    }`
  );
  next();
}

module.exports = server;
