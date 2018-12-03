var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var recurringPaymentSchema = new Schema({
    saveId:  { 
      type: Schema.ObjectId, 
      ref: 'recurringSavings', 
      required: true
    },
    paymentDate: {
        type: Date,
        default: new Date() 
    },
   
},{
    collection: 'recurringPayments',
    timestamps: { 
        createdAt: 'created_at', 
        updatedAt: 'updated_at' 
    }
});

const RecurringPayments = mongoose.model('recurringPayment', recurringPaymentSchema);
module.exports = RecurringPayments;