require("dotenv").config();
require("express-async-errors");

const express = require("express");
const app = express();

//other packages
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const cloudinary = require("cloudinary").v2;
cloudinary.config({
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
  cloud_name: process.env.CLOUD_NAME,
});
//Database
const connectDB = require("./db/connect");
//routers
const authRouter = require("./routes/authRoutes");
const userRouter = require("./routes/userRoutes");
const productRouter = require("./routes/productRoutes");
const reviewRouter = require("./routes/reviewRoutes");
const orderRouter = require("./routes/orderRoutes");
//Error middleWares
const notFoundMiddleware = require("./middlewares/not-found");
const errorhandlerMiddleware = require("./middlewares/error-handler");
const { authenticateUser } = require("./middlewares/authentication");

//Express parsers
app.use(morgan("tiny"));
app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));
app.use(fileUpload());
app.use(express.static("./public"));

app.get("/", (req, res) => {
  res.send("e-comerce api");
});

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/products", productRouter);
app.use("/api/v1/reviews", reviewRouter);
app.use("/api/v1/orders", authenticateUser, orderRouter);

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
