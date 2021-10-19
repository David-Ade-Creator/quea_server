const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const config = require("./config.js");
const authRoute = require("./routes/authenticationRoutes");
const questionRoute = require("./routes/questionRoutes");
const answerRoute = require("./routes/answerRoutes");
const uploadRoute = require("./routes/uploadRoutes");
const userRoute = require("./routes/userRoutes");
const { default: questionHandlers } = require("./sockets/questionHandlers.js");
const { default: answerHandlers } = require("./sockets/answerHandlers.js");

const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: '*',
  }
});

const mongodbUrl = config.MONGODB_URL;

const connect = mongoose
  .connect(
    mongodbUrl,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    },
    console.log("connected")
  )
  .catch((error) => console.log(error.reason));

app.use(express.json());
app.use(cors());
app.use("/api/q3/", authRoute);
app.use("/api/q3/", questionRoute);
app.use("/api/q3/", answerRoute);
app.use("/api/q3/", uploadRoute);
app.use("/api/q3/", userRoute);


const onConnection = (socket) => {
  questionHandlers(io, socket,connect);
  answerHandlers(io, socket,connect);
}

io.on("connection", onConnection);

server.listen(config.PORT, () => {
  console.log(`server started at ${config.PORT}`);
});