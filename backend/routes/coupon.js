const express = require('express');
const { getCoupons, newCoupon, deleteCoupon } = require('../controllers/couponController');
const router = express.Router();
const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/authenticate');

router.route('/coupons').get(isAuthenticatedUser, getCoupons);
router.route('/admin/coupon/new').post(isAuthenticatedUser, authorizeRoles('admin'), newCoupon);
router.route('/admin/coupon/:id').delete(isAuthenticatedUser, authorizeRoles('admin'), deleteCoupon);

module.exports = router;
