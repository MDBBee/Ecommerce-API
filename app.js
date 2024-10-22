require("dotenv").config();
require("express-async-errors");

const express = require("express");
const app = express();

//Database
const connectDB = require("./db/connect");

//Error middleWares
const notFoundMiddleware = require("./middlewares/not-found");
const errorhandlerMiddleware = require("./middlewares/error-handler");
const { json } = require("body-parser");

//Express parsers
app.use(express.json());

app.use(notFoundMiddleware);
app.use(errorhandlerMiddleware);

const port = process.env.PORT || 5000;

const appInit = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () => {
      console.log(`Server listening on port: ${port}....`);
    });
  } catch (error) {
    console.log(error);
  }
};

appInit();
