const express = require("express");
const mongoose = require("mongoose");
const app = express();
const constants = require("./config/constants.json");
const passport = require("passport");
const bodyParser = require("body-parser");

const authRoutes = require("./routes/auth");
const profileRoutes = require("./routes/profile");
const newsRoutes = require("./routes/news");
const favoriteRoutes = require("./routes/favorite");
const chatRoutes = require("./routes/chat");


mongoose
  .connect(constants.mongoURI)
  .then(() => console.log("БД подключена"))
  .catch((e) => console.log(e));

app.use(passport.initialize());
require("./middleware/passport")(passport);

app.use(require("morgan")("dev"));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/profile", profileRoutes);
app.use("/api/v1/news", newsRoutes);
app.use("/api/v1/favorite", favoriteRoutes);
app.use("/api/v1/chat", chatRoutes);

module.exports = app;
