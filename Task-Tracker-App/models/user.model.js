const mongoose = require("mongoose");

var TaskSchema = new mongoose.Schema({
    id : {
        type : String,
        required : "Required"
    },
    username : {
        type : String,
        required : "Required"
    },
    email : {
        type : String,
        required : "Required"
    },
    password : {
        type : String,
        required : "Required"
    }
});

mongoose.model("Users", TaskSchema);