const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');


const UserSchema = new Schema({
    email:{
        type: String,
        required: true,
        unique: true
    },
    role:{
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    }
});

UserSchema.plugin(passportLocalMongoose); 
// Method from passport-local-mongoose, https://www.npmjs.com/package/passport-local-mongoose

module.exports = mongoose.model('User', UserSchema);