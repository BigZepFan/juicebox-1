const express = require("express");
const apiRouter = express.Router();

const postsRouter = require("./posts");
apiRouter.use("/posts", postsRouter);

const usersRouter = require("./users");
apiRouter.use("/users", usersRouter);

const tagsRouter = require("./tags");
apiRouter.use("/tags", tagsRouter);

module.exports = apiRouter;
