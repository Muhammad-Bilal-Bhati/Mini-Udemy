const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userProfileSchema = new Schema(
    {
    bio:{
        type: String,
        default: ''
    },
    website:{
        type: String,
        default: ''
    },
    socialLinks:{
        type: Map,
        of: String,
        default: {}
    }
}, { timestamps: true ,_id: false });

const userSchema = new Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true
    },
    role:{
        type: String,
        enum: ['student', 'instructor', 'admin'],
        default: 'student'
    },

    profile:{
        type: userProfileSchema,
    }
},{ timestamps: true });

const userModel =  mongoose.model('User', userSchema);
module.exports = userModel;