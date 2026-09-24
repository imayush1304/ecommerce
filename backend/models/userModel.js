const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter your name"],
    },
    email: {
        type: String,
        required: [true, "Pleqase enter your email"],
        unique: true,
        validate: [validator.isEmail, "Please enter a valid email address"]
    },
    password: {
        type: String,
        required: [true, "Please enter your password"],
        maxlength: [8, "Password cannot exceed 8 characters"],
        select: false
    },
    avatar: {
        type: String
    },
    role: {
        type: String,
        default: "user"
    },
    wishlist: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product'
        }
    ],
    addresses: [
        {
            type: { type: String, enum: ['home', 'work', 'other'], default: 'home' },
            name: { type: String, required: true },
            phone: { type: String, required: true },
            house: { type: String, required: true },
            street: { type: String, required: true },
            city: { type: String, required: true },
            state: { type: String, required: true },
            pincode: { type: String, required: true },
            isDefault: { type: Boolean, default: false }
        }
    ],
    paymentMethods: [
        {
            type: { type: String, enum: ['card', 'upi'], required: true },
            brand: { type: String }, // 'Visa', 'Mastercard'
            last4: { type: String },
            expiry: { type: String },
            upiId: { type: String },
            isDefault: { type: Boolean, default: false }
        }
    ],
    preferences: {
        order_updates: { type: Boolean, default: true },
        promo_emails: { type: Boolean, default: true },
        promo_sms: { type: Boolean, default: false },
        push_notifs: { type: Boolean, default: true },
        recommendations: { type: Boolean, default: true },
        review_reminders: { type: Boolean, default: false }
    },
    settings: {
        language: { type: String, default: 'en' },
        currency: { type: String, default: 'INR' },
        theme: { type: String, default: 'system' }
    },
    resetPasswordToken: String,
    resetPasswordTokenExpire: Date,
    createdAt: {
        type: Date,
        default: Date.now()
    }

})
userSchema.pre('save', async function () {
    if (!this.isModified('password') || !this.password) {
        return;
    }
    this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.getJwtToken = function () {
    return jwt.sign({ id: this.id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_TIME
    })
}


userSchema.methods.isValidPassword = async function (enteredPassword) {
    return  bcrypt.compare(enteredPassword, this.password);

}

userSchema.methods.getResetToken = function () {
    // Generate a random token
    const token = crypto.randomBytes(20).toString('hex');

    // Hash the token and set it to resetPasswordToken field
    this.resetPasswordToken = crypto.createHash('sha256').update(token).digest('hex');

    //set token expire time
    this.resetPasswordTokenExpire = Date.now() + 30 * 60 * 1000;  // 30 MIN

    return token;

}

let model = mongoose.model('User', userSchema);

module.exports = model;