require("dotenv").config();

const express = require("express");
const errorHandler = require("./middleware/errorHandler.js");
const mongoose = require("mongoose");
const EventEmitter = require("events");

const callEventEmitter = new EventEmitter();

// Starting the Priority Cron Job
const startPriorityCron = require("./cron/priorityCron")
startPriorityCron();

// Calling Cron Job initiated
const startVoiceCallingCron = require("./cron/callingCron");
startVoiceCallingCron(callEventEmitter);

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Route for the Twilio Hook
app.use("/twilio-status-callback", (req, res) => {
    const status = req.body.CallStatus;
    switch (status) {
        case 'completed':
            console.log('Call completed');
            callEventEmitter.emit('completed');
            break;
        case 'answered':
            console.log('Call answered');
            callEventEmitter.emit('answered');
            break;
    }
    res.status(200).end();
});

app.use("/api/admin/", require("./routes/adminRoutes"));
app.use("/api/task/", require("./routes/taskRoutes"));
app.use("/api/subtask/", require("./routes/subTaskRoutes"));
app.use("/api/user/", require("./routes/userRoutes"))
app.use(errorHandler);

mongoose.connect(process.env.MONGODB_URI).then(() => {
    console.log("Connected to Mongoose");
}).catch((err) => {
    console.log(err);
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});