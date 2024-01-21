const cron = require('node-cron');
const Task = require('../models/taskModel');
const User = require('../models/userModel');

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);

const startVoiceCallingCron = (callEventEmitter) => {
    console.log("Inside Voice Calling Cron");

    cron.schedule('0 0 * * *', async () => { // Every Hour
        console.log("inside cron");
        try {
            const tasks = await Task.find({
                priority: 0,
                is_delete: false
            });

            for (const task of tasks) {
                const userIDs = task.users;
                const users = [];

                for (const userID of userIDs) {
                    const user = await User.findOne({ _id: userID });
                    users.push(user);
                }

                // Sorting based upon 
                users.sort((a, b) => a.priority - b.priority);

                for (const user of users) {
                    const callSid = await makeVoiceCall(user.phone_number, `Task overdue: ${task.title}`);
                    console.log(`Voice call made to user`);

                    let callAnswered = false;

                    // Wait for the call to be answered or completed before moving to the next user
                    await Promise.race([
                        new Promise(resolve => callEventEmitter.once('answered', () => {
                            callAnswered = true;
                            resolve();
                        })),
                        new Promise(resolve => callEventEmitter.once('completed', resolve))
                    ]);

                    console.log(`Call answered or completed for user ${user._id}`);

                    // Break out of the loop if the call is answered
                    if (callAnswered) {
                        console.log(`Breaking out of the loop for user ${user._id}`);
                        break;
                    }
                }
            }

            console.log('Voice calling cron job executed successfully.');
        } catch (error) {
            console.error('Error in voice calling cron job:', error);
        }
    });

    console.log('Voice calling cron job started.');
};

const makeVoiceCall = async (phoneNumber, message) => {
    try {
        const call = await client.calls.create({
            to: phoneNumber,
            from: '+14695027123',
            twiml: `<Response><Say>${message}</Say></Response>`,
            statusCallbackEvent: ["initiated", "ringing", "answered", "completed"],
            statusCallback: 'https://f998-122-168-171-15.ngrok-free.app/twilio-status-callback',
        });

        return call.sid;
    } catch (error) {
        console.error('Error making Twilio voice call:', error);
    }
};

module.exports = startVoiceCallingCron;