const mongoose = require("mongoose");

var TaskSchema = new mongoose.Schema({
    createdByUserId : {
        type : String,
        required : "Required"
    },
    id : {
        type : String,
        required : "Required"
    },
    text : {
        type : String,
        required : "Required"
    },
    day : {
        type : String,
        required : "Required"
    },
    reminder : {
        type : Boolean,
        required : "Required"
    }
});

mongoose.model("Tasks", TaskSchema);