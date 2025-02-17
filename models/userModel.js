const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const userDataSchema = new mongoose.Schema({


    firstname:{
        type: String,
        required :true
    },

    lastname: {
        type: String,
        required: true
    },

    username: {
        type: String,
        required: true
    }

    // password: {
    //     type: String,
    //     required: true
    // }

});

const userMessageSchema = new mongoose.Schema({

    message:{
        type: String,
        required :true
    },


});

userDataSchema.methods.generateAuthToken = function(){
    return jwt.sign(
        {_id:this._id, permission: this.permission},
        process.env.JWT_SECRET
    )
}


const userData = mongoose.model('userData', userDataSchema);
const messageData = mongoose.model('messageData', userMessageSchema)

module.exports = {userData, messageData}