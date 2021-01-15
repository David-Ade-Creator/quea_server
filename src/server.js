const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require('cors');
const config = require("./config.js");
const authRoute = require("./routes/authenticationRoutes");
const questionRoute = require("./routes/questionRoutes");
const answerRoute = require("./routes/answerRoutes");
const uploadRoute = require("./routes/uploadRoutes");
const userRoute = require("./routes/userRoutes");

const app = express()

const mongodbUrl = config.MONGODB_URL;

mongoose.connect(mongodbUrl,{
    useNewUrlParser : true,
    useUnifiedTopology: true,
    useCreateIndex: true
},console.log('connected')).catch(error => console.log(error.reason));

app.use(bodyParser.json());
app.use(cors());
app.use("/api/q3/",authRoute);
app.use("/api/q3/",questionRoute);
app.use("/api/q3/",answerRoute);
app.use("/api/q3/",uploadRoute);
app.use("/api/q3/",userRoute);

// if(process.env.NODE_ENV === 'production') {
//     app.use(express.static(_dirname + '/../dist'));
// };

app.listen(config.PORT, () => {
    console.log(`server started at ${config.PORT}`);
});