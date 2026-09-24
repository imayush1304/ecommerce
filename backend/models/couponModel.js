const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
    code: {
        type: String,
        required: [true, 'Please enter coupon code'],
        unique: true,
        uppercase: true,
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Please enter coupon description']
    },
    discountType: {
        type: String,
        enum: ['percentage', 'fixed'],
        required: [true, 'Please select discount type']
    },
    discountValue: {
        type: Number,
        required: [true, 'Please enter discount value']
    },
    minOrder: {
        type: Number,
        default: 0
    },
    expiry: {
        type: Date,
        required: [true, 'Please enter expiry date']
    },
    status: {
        type: String,
        enum: ['active', 'expired', 'used'],
        default: 'active'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

let model = mongoose.model('Coupon', couponSchema);

module.exports = model;
