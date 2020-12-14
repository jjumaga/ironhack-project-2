require("dotenv").config();
require("./config/mongo");

const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const flash = require("connect-flash");
const hbs = require("hbs");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const SpotifyWebApi = require("spotify-web-api-node");
const dev_mode = false;
const logger = require("morgan");
const path = require("path");

const indexRouter = require("./routes/index");

// HBS/VIEWS SET UP
app.set("views", __dirname + "/views");
app.set("view engine", "hbs");
hbs.registerPartials(__dirname + "/views/partials");

// SPOTIFY SET UP
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
});

spotifyApi
  .clientCredentialsGrant()
  .then((data) => spotifyApi.setAccessToken(data.body["access_token"]))
  .catch((error) =>
    console.log("Something went wrong when retrieving an access token", error)
  );

// SET PREFIXES FOR ROUTES BELOW:
//to-do selon CRUD

// LISTEN
//app.listen(process.env.PORT, () => {
//  console.log("let's roooock @ http://localhost:" + process.env.PORT);
//});

app.use(flash());

//app.use(
//  session({
//    secret: process.env.SESSION_SECRET,
//    cookie: { maxAge: 600000000 },
//    store: new MongoStore({
//      mongooseConnection: mongoose.connection,
//      ttl: 24 * 60 * 60,
//    }),
//    saveUninitialized: true,
//    resave: true,
//  })
//);

//MIDDLEWARES

if (dev_mode === true) {
  app.use(require("./middlewares/devMode")); // triggers dev mode during dev phase
  app.use(require("./middlewares/debugSessionInfos")); // displays session debug
}

app.use(require("./middlewares/exposeLoginStatus"));
app.use(require("./middlewares/exposeFlashMessage"));

app.use("/", indexRouter);

//Define Routers
//const memoriesRouter = require("./routes/memories");
//const spotifyRouter = require("./routes/spotify");
//const usersRouter = require("./routes/users");

// POSSIBLE EXPORTS
module.exports = app;
