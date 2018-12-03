var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phoneNumber: {
        type: String,
        required: true,
        unique: true
    },
    accountNumber: {
        type: String,
    },
    bankName: {
        type: String,

    },
    password: {
        type: String,
        required: true
    },
    permission: {
        type: String,
        default: 'regularUser',
        enum: ['superAdmin', 'Admin', 'regularUser']

    },
}, {
    collection: 'users',
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
});

const Users = mongoose.model('User', userSchema);
module.exports = Users;