const Coupon = require('../models/couponModel');
const catchAsyncError = require('../middlewares/catchAsyncError');
const ErrorHandler = require('../utils/errorHandler');

exports.getCoupons = catchAsyncError(async (req, res, next) => {
    // Return active and expired coupons
    const coupons = await Coupon.find({ status: { $in: ['active', 'expired'] } }).sort({ createdAt: -1 });
    res.status(200).json({
        success: true,
        coupons
    });
});

// Admin routes for coupons
exports.newCoupon = catchAsyncError(async (req, res, next) => {
    const coupon = await Coupon.create(req.body);
    res.status(201).json({
        success: true,
        coupon
    });
});

exports.deleteCoupon = catchAsyncError(async (req, res, next) => {
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) return next(new ErrorHandler('Coupon not found', 404));
    await coupon.deleteOne();
    res.status(200).json({
        success: true,
        message: 'Coupon deleted'
    });
});
