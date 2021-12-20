const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require('nodemailer');
const { google } = require('googleapis');
const setTimeout = require('safe-timers').setTimeout;
const app = express();
const portNumber = process.env.PORT || "3000";
require("./models/task.model");
require("./models/user.model");
const taskModel = mongoose.model("Tasks");
const userModel = mongoose.model("Users");
const mongoDbURL = "mongodb://localhost:27017/taskTracker";
const clientId = '683777130968-st9emt21m6e8l55h76onqn9e8hmkk3i4.apps.googleusercontent.com';
const clientSecret = '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';
const redirectURI = 'https://developers.google.com/oauthplayground';
const refreshToken = '1//04rw3im73eOV8CgYIARAAGAQSNwF-L9IrJVZatWRi21IjlFoB7E0GeRiL0MEPPR6gSJAWL7Ql1XS9udDBbHCvSHtV5sasMv7PXRo';
const oAuth2Client = new google.auth.OAuth2(clientId, clientSecret, redirectURI);
oAuth2Client.setCredentials({refresh_token : refreshToken});
var verificationCodes = []; // Dictionary for Verification codes requested by users.
var timers = []; // Dictionary of timers which are set for tasks.

const strings = {
    emailStrings : {
        verificationCode : {
            subject : "Verification code for Task Tracker reset password request",
            text : "Greatings {0}, please put below code in Task Tracker application to reset your password.",
            html : '<div style="background-color:#1e1e1e;height:700;border-style:solid;border-width:5px;border-color:#7c00ff"><h1 align="center" style="color:white">Task Tracker </h1><h2 align="center" style="color:white;margin-bottom:20">Greetings {0}, please put below code in Task Tracker application to reset your password.</h2><h1 align="center" style="color:white">CODE : {1} </h1></div>'
        },
        reminder : {
            subject : "Task Tracker Reminder : {0}",
            text : "Task Tracker Reminder : {0}",
            html : '<div style="background-color:#1e1e1e;height:700;border-style:solid;border-width:5px;border-color:#7c00ff"><h1 align="center" style="color:white">Task Tracker Reminder</h1><h1 align="center" style="color:white">DATE : {0}</h1><h1 align="center" style="color:white">" {1} "</h1></div>'
        }
    }
}

app.use(express.json());

app.use(express.urlencoded({
    extended: true
}));

var allowCrossDomain = function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Cache-Control, Authorization");

    // intercept OPTIONS method
    if ('OPTIONS' == req.method) {
      res.sendStatus(200);
    }
    else {
      next();
    }
};

app.use(allowCrossDomain);

/*
 * res.status(200); // equivalent to res.status(200).send('OK')
 * res.status(403); // equivalent to res.status(403).send('Forbidden')
 * res.status(404); // equivalent to res.status(404).send('Not Found')
 * res.status(500); // equivalent to res.status(500).send('Internal Server Error')
 * res.status(400); // equivalent to res.status(400).send('Bad Request')
 * res.status(401); // equivalent to res.status(400).send('Unauthorized')
*/

//#region Task CRUD Methods
/**
 * This method will retrieve all the tasks from Database.
 */
app.get('/getTasks', verifyToken, (req, res) => {
        taskModel.find({createdByUserId: req.userId}, (err, docs) => {
            if(!err){
                res.status(200).send(docs);
            }
            else
            {
                res.status(500).send("Error : " + err.message);
            }
        });
});

/**
 * This method will save task in Database.
 */
app.post('/saveTask', verifyToken, (req, res) => {
    try{
        var newTask = new taskModel();

        newTask.createdByUserId = req.userId;
        newTask.id = req.body.id;
        newTask.text = req.body.text;
        newTask.day = req.body.day;
        newTask.reminder = req.body.reminder;
        newTask.save((err) => {
            if(!err){
                queueEmail(newTask);
                res.status(200).send(req.body);
            }
            else{
                res.status(500).send("Error : " + err.message); 
            }
        });
    }
    catch(err){
        res.status(400).send("Error : Something went wrong :("); 
    }
});

/**
 * This method will delete task from Database.
 */
app.post("/deleteTask", verifyToken, (req, res) => {
    try{
        var taskId = req.body.id;

        taskModel.deleteOne({ id: taskId }, (err) => {
            if (!err) {
                removeTimeout(taskId);
                res.status(200).send(req.body);
            } else {
                res.status(500).send(err.message);
            }
        });
    }
    catch(err){
        res.status(400).send("Error : Something went wrong :("); 
    }
});

/**
 * This method will update task in Database.
 */
 app.put("/updateTask", verifyToken, (req, res) => {
     try{
        var taskId = req.body.id;

        taskModel.updateOne({ id: taskId }, req.body, async (err) => {
            if (!err) {
                const task = await taskModel.findOne({ id: taskId });
                queueEmail(task);
                res.status(200).send(req.body);
            } else {
                res.status(500).send(err.message);
            }
        });
     }
     catch(err){
        res.status(400).send("Error : Something went wrong :("); 
    }
});

/**
 * This method will update reminder of task in Database.
 */
 app.put("/toggleReminder", verifyToken, (req, res) => {
    try{
        var taskId = req.body.id;
        var taskReminder = req.body.reminder;
    
        taskModel.updateOne({ id: taskId }, { reminder: taskReminder }, async (err) => {
            if (!err) {
                const task = await taskModel.findOne({ id: taskId });
                queueEmail(task);
                res.status(200).send(req.body);
            } else {
                res.status(500).send(err.message);
            }
        });
    }
    catch(err){
        res.status(400).send("Error : Something went wrong :("); 
    }
});
//#endregion

//#region Users Login/Sign Up Methods
/**
 * This method will verify the token in headers.
 */
 app.get('/verifyToken', verifyToken, async (req, res) => {
    const user = await userModel.findOne({ id: req.userId });

    if(user){
        res.status(200).send();
    }
    else{
        res.status(401).send();
    }
});

/**
 * This method will get the current user's username from Database.
 */
app.get('/getUsername', verifyToken, (req, res) => {
    userModel.find({id: req.userId}, (err, docs) => {
        if(!err && docs.length){
            res.status(200).send({username: docs[0].username});
        }
        else
        {
            res.status(500).send("Error : " + err.message);
        }
    });
});

/**
 * This method will get the current user's email from Database.
 */
 app.get('/getEmail', verifyToken, (req, res) => {
    userModel.find({id: req.userId}, (err, docs) => {
        if(!err && docs.length){
            res.status(200).send({email: docs[0].email});
        }
        else
        {
            res.status(500).send("Error : " + err.message);
        }
    });
});

/**
 * This method will create the user in Database.
 */
 app.post("/createUser", async (req, res) => {
     try{
        var newUser = new userModel;

        newUser.id = req.body.id;
        newUser.username = req.body.username;
        newUser.email = req.body.email;

        // Check if email already exists.
        userModel.find({$or: [{username: newUser.username}, {email: newUser.email}]}, async (err, docs) => {
            if(!err){
                if(docs.length === 0){
                    newUser.password = await bcrypt.hash(req.body.password, await bcrypt.genSalt(10));
                    newUser.save((err) => {
                        if(!err){
                            res.status(200).send(req.body);
                        }
                        else{
                            res.status(500).send("Error : " + err.message); 
                        }
                    });
                }
                else{
                    res.status(400).send('Username or Email already exists try with another Username and Email.');
                }
            }
            else
            {
                res.status(500).send("Error : " + err.message);
            }
        });
     }
     catch(err){
        res.status(400).send("Error : Something went wrong :("); 
     }
});

/**
 * This method will login the user in Database.
 */
 app.post("/login", async (req, res) => {
    try{
       var username = req.body.username;
       var userPassword = req.body.password;

       const user = await userModel.findOne({ username: username });

       if (user) {
        // check user password with hashed password stored in the database
        const validPassword = await bcrypt.compare(userPassword, user.password);
        if (validPassword) {
            var payload = { subject : user.id };
            var token = jwt.sign(payload, "secretKey");
            res.status(200).send({id: token}); // {token} this is format of sending object {token : 'xyz'} in ES6.
        } else {
            res.status(400).send("Please check your credentials and try again."); 
        }
      } 
      else {
        res.status(400).send("Please check your credentials and try again."); 
      }
    }
    catch(err){
       res.status(400).send("Error : Something went wrong :("); 
    }
});

/**
 * This method will update the User Details in Database.
 */
 app.post("/updateUserDetails", verifyToken, async (req, res) => {
    try{
       var username = req.body.username;
       var email = req.body.email;
       var userPassword = req.body.password;

       const user = await userModel.findOne({ id: req.userId });

       // check user password with hashed password stored in the database
       const validPassword = await bcrypt.compare(userPassword, user.password);
       if (validPassword) {
        userModel.updateOne({ id: req.userId }, { username : username, email : email}, (err) => {
            if (!err) {
                res.status(200).send();
            } else {
                res.status(500).send(err.message);
            }
        });
       } else {
           res.status(400).send("Please check your credentials and try again."); 
       }
    }
    catch(err){
       res.status(400).send("Error : Something went wrong :("); 
    }
});

/**
 * This method will change the User's password in Database.
 */
 app.post("/changePassword", verifyToken, async (req, res) => {
    try{
       var oldPassword = req.body.oldPassword;
       var newPassword = req.body.newPassword;

       const user = await userModel.findOne({ id: req.userId });

       // check user password with hashed password stored in the database
       const validPassword = await bcrypt.compare(oldPassword, user.password);
       if (validPassword) {
        newPassword = await bcrypt.hash(newPassword, await bcrypt.genSalt(10));
        userModel.updateOne({ id: req.userId }, { password : newPassword}, (err) => {
            if (!err) {
                res.status(200).send();
            } else {
                res.status(500).send(err.message);
            }
        });
       } else {
           res.status(400).send("Please check your credentials and try again."); 
       }
    }
    catch(err){
       res.status(400).send("Error : Something went wrong :("); 
    }
});

/**
 * This method will send an email containing verification code for Reset password.
 */
app.post("/sendVerificationCodeEmail", async (req, res) => {
    try{
       var email = req.body.email;
       const user = await userModel.findOne({ email: email });

       if (user) {
        var verificationCodeText = strings.emailStrings.verificationCode;  
        var verificationCode = getRandomVerificationCode(); 

        await sendMail(email, verificationCodeText.subject, verificationCodeText.text.replace('{0}', user.username), verificationCodeText.html.replace('{0}', user.username).replace('{1}', verificationCode)).then(function (result) {
            // Filter out any already existing codes in dictionary.
            verificationCodes = verificationCodes.filter(verificationCode => verificationCode.key != email);

             // Add verification code to a dictionary so that it can be used at the time of verification.
            verificationCodes.push({ key : email, value : verificationCode  });
            res.status(200).send();  
        });
       } else {
           res.status(400).send("Please check your credentials and try again."); 
       }
    }
    catch(err){
       res.status(400).send("Error : Something went wrong :("); 
    }
});

/**
 * This method will reset the User's password in Database.
 */
 app.post("/resetPassword", async (req, res) => {
    try{
       var email = req.body.email;
       var verificationCode = req.body.verificationCode;
       var newPassword = req.body.newPassword;

       // check user entered verification code with the one sent.
       const validCode = verificationCode == verificationCodes.find((verificationCode) => verificationCode.key == email).value;
       if (validCode) {
        newPassword = await bcrypt.hash(newPassword, await bcrypt.genSalt(10));
        userModel.updateOne({ email: email }, { password : newPassword}, (err) => {
            if (!err) {
                // Remove the code from dictionary.
                verificationCodes = verificationCodes.filter(verificationCode => verificationCode.key != email);
                res.status(200).send();
            } else {
                res.status(500).send(err.message);
            }
        });
       } else {
           res.status(400).send("Verification Code does not match."); 
       }
    }
    catch(err){
       res.status(400).send("Error : Something went wrong :("); 
    }
});
//#endregion

//#region Common Methods
/**
 * This method will be a middleware to check if a request is authorized or not.
 * @param {The request} req 
 * @param {The response} res 
 * @param {To pass execution to the next handler} next 
 */
function verifyToken(req, res, next) {
    var unauthorizedMessage = "Authorization Failed! Please Login."
    try{
        if(!req.headers.authorization){
            res.status(401).send(unauthorizedMessage);
        }
        var token = req.headers.authorization.split(' ')[1];
    
        if(token === null){
            res.status(401).send(unauthorizedMessage);
        }
        var payload = jwt.verify(token, "secretKey");
        
        if(!payload){
            res.status(401).send(unauthorizedMessage);
        }
        req.userId = payload.subject;
        next();
    }
    catch(err){
        res.status(401).send(unauthorizedMessage);
    }
}

/**
 * This method will be used to send Email.
 * @param {Whome to send email} toEmail 
 * @param {Subject of email} emailSubject 
 * @param {Text of email} emailText 
 * @param {HTML to add to email} emailHtml 
 * @returns Send Email promise
 */
async function sendMail(toEmail, emailSubject, emailText, emailHtml) {
    const accessToken = await oAuth2Client.getAccessToken();

    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
                user: 'tasktrackernoreply123@gmail.com',
                type: 'OAuth2',
                clientId: clientId,
                clientSecret: clientSecret,
                refreshToken: refreshToken,
                accessToken: accessToken                                       
              } 
      });

    const mailOptions = {
        from: '<tasktrackernoreply123@gmail.com>', // sender address
        to: toEmail, // list of receivers
        subject: emailSubject, // Subject line
        text: emailText, // plain text body
        html: emailHtml // html body
      };
      
    return transporter.sendMail(mailOptions); 
}

/**
 * This method will be used to generate and get Random 4 digit verification code.
 * @returns Random 4 digit verification code.
 */
function getRandomVerificationCode() {
    return  Math.floor(Math.random() * (9999 - 1000)) + 1000;
}

/**
 * This method will be used to get month text name from number.
 * @param {month number} month 
 * @returns month text.
 */
function getMonthName(month){
    switch(month){
      case 0:
        return "January";
      case 1:
        return "February";
      case 2:
        return "March";
      case 3:
        return "April";
      case 4:
        return "May";
      case 5:
        return "June";
      case 6:
        return "July";
      case 7:
        return "August";
      case 8:
        return "September";
      case 9:
        return "October";
      case 10:
        return "November";
      case 11:
        return "December";
      default:
        return "Month Name not found";                                                                  
    }
  }

/**
 * This method is used to queue email for a task.
 * @param {task for which email needs to be queued} task
 */  
function queueEmail(task){
    // If reminder is not set remove existing timeout.
    if(!task.reminder){
        removeTimeout(task.id);
        return;
    } 

    var date = new Date(task.day);
    var dateDifference = date.getTime() - new Date().getTime();
       
    // Only Queue if date is coming in future.
    if(dateDifference > 0){
        var setTimeoutObj = setTimeout(async () => {
            var taskOldValue = task;
            const taskNewValue = await taskModel.findOne({ id: taskOldValue.id });
            
            // If task is not deleted then proceed.
            if(taskNewValue){
    
                // If reminder is not set in latest value then don't continue.
                if(!taskNewValue.reminder){
                    return;
                }
    
                // If day is not same as latest value then don't continue.
                if(taskNewValue.day != taskOldValue.day){
                    return;
                }
    
                var reminderText = strings.emailStrings.reminder;
                var dateText = date.getDate().toString();  
                var monthText = getMonthName(date.getMonth());
                var yearText = date.getFullYear().toString();
                var minutestText = date.getMinutes().toString();
                var hoursText = date.getHours().toString();
                var datePostfix = dateText == "1" || dateText == "21" || dateText == "31" ? "st" : dateText == "2" || dateText == "22" ? "nd" : dateText == "3" || dateText == "23" ? "rd" : "th";
                var formattedDate = `${dateText}${datePostfix} ${monthText} ${yearText} at ${hoursText}:${minutestText}`;
                var user = await userModel.findOne({ id: taskNewValue.createdByUserId });
                var email = user.email;
    
                // Send mail if all data is same as before.
                await sendMail(email, reminderText.subject.replace('{0}', taskNewValue.text), reminderText.text.replace('{0}', taskNewValue.text), reminderText.html.replace('{0}', formattedDate).replace('{1}', taskNewValue.text));

                // Remove item for this task from dictionary after mail has been sent.
                timers = timers.filter(timer => timer.key != taskNewValue.id);
            }
        }, dateDifference);

        // Remove timout before pushing in dictionary.
        removeTimeout(task.id);

        // Add verification code to a dictionary so that it can be used at the time of verification.
        timers.push({ key : task.id, value : setTimeoutObj });                      
    }
    else{
        removeTimeout(task.id);
        return;
    }
}  

/**
 * This method will remove timout for existing item with same taskId in dictionary.
 * @param {The Id of task for which timeout needs to be removed} taskId 
 */
function removeTimeout(taskId){
    timer = timers.find(timer => timer.key == taskId);

    // If timer does not exist in collection do not proceed.
    if(!timer){
        return;
    }

    // Filter out any already existing timer for this task in dictionary.
    timers = timers.filter(timer => timer.key != taskId);

    // Clear timout.
    timer.value.clear();
}
//#endregion

/**
 * Start the server and connect to database. 
 */
app.listen(portNumber, () => {
    console.log("Listening to port number : " + portNumber);

    mongoose.connect(mongoDbURL, (err) => {
        if(err){
            console.log(err.message);
        }
        else{
            console.log("Succussfully connected to Database !!!");

            try{
                 // Queue reminder emails for all the existing tasks in Database. 
                 taskModel.find((err, docs) => {
                    if(!err){
                        docs.forEach(function (value, index, docs) {
                            queueEmail(value);
                        });
                    }
                    else
                    {
                        console.log(err.message);
                    }
                });
            } 
            catch(err){
                console.log(err.message); 
            }
        }
    });
});