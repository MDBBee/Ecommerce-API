require("dotenv").config();
require("express-async-errors");

const express = require("express");
const app = express();

//other packages
const morgan = require("morgan");
//Database
const connectDB = require("./db/connect");
//routers
const authRouter = require("./routes/authRoutes");
//Error middleWares
const notFoundMiddleware = require("./middlewares/not-found");
const errorhandlerMiddleware = require("./middlewares/error-handler");

//Express parsers
app.use(morgan("tiny"));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("e-comerce api");
});

app.use("/api/v1/auth", authRouter);

app.use(notFoundMiddleware);
app.use(errorhandlerMiddleware);

const port = process.env.PORT || 3000;

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
