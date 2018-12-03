var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var recurringSavingSchema = new Schema({
    userId:  { 
      type: Schema.ObjectId, 
      ref: 'Users', 
      required: true
    },
    amount: {
        type: Number, 
        default: 0 , 
        required: true
    },
    modeOfPayment: {
        type: String, 
    },
    savingsMode: {
        type: String,
        default:'continousSavings'
    },
    amountPerDeposit: {
        type: Number, 
        default: 0 , 
    },
    amountDeposited: {
        type: Number, 
        default: 0 , 
    },
    balance: {
        type: Number, 
        default: 0 , 
    },
    paymentDate: {
        type: Date,
        default: new Date()
    },
    paymentStatus: {
        type: String,         
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
    paymentDuration: {
        type: String,
    },
    nextDateOfdeposit: {
        type: Date,
    },
    dueDateForWithdrawal: {
        type: Date,
    },
    withdrawalDate: {
        type: Date,
    },
    depositStatus:{
        type:String,
    },
    amountWithdraw: {
        type: Number,
        default: 0.00,
    },   
    withdrawalStatus: {
        type: Boolean, 
        default: false
    },
},{
    collection: 'recurringSavings',
    timestamps: { 
        createdAt: 'created_at', 
        updatedAt: 'updated_at' 
    }
});

const RecurringSavings = mongoose.model('recurringSaving', recurringSavingSchema);
module.exports = RecurringSavings;