var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var savingSchema = new Schema({
    userId: {
        type: Schema.ObjectId,
        ref: 'Users',
        required: true
    },
    amount: {
        type: Number,
        default: 0,
        required: true
    },
    paymentStatus: {
        type: Boolean,
        default: false,
        required: true
    },
    duration: {
        type: Number,
        default: 12,
        required: true
    },
    interest: {
        type: String,
        default: 0
    },
    accumulatedInterest : {
        type: Number,
        default: 0
    },
    amountExpected: {
        type: Number,
        default: 0
    },
    savingsPlan: {
        type: String,
        required: true,
    },
    paymentDate: {
        type: Date,
        default: new Date()
    },
    dueDateForWithdrawal: {
        type: Date,
    },
    withdrawalDate: {
        type: Date,
        // default: 
    },
    amountWithdraw: {
        type: Number,
        default: 0.00,
    },
    withdrawalStatus: {
        type: Boolean,
        default: false
    },    
}, {
    collection: 'savings',
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
});

const Savings = mongoose.model('Saving', savingSchema);
module.exports = Savings;