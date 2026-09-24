const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please Enter Product Name"],
        trim: true,
        maxLength: [100, "Product name cannot exceed 100 characters"]
    },
    price: {
        type: Number,
        required: [true, "Please enter product price"],
        default: 0
    },
    description: {
        type: String,
        required: [true, "Please enter product description"]
    },
    ratings: {
        type: Number,
        default: 0
    },
    images: [
        {
            image: {
                type: String,
                required: true
            }
        }
    ],
    category: {
        type: String,
        required: [true, "Please select category"],
        enum: {
            values: [
                'PC Games',
                'PS3 Games',
                'PS4 Games',
                'Nintendo Games',
                'Xbox Games',
                'Business Books',
                'Cooking Books',
                'History Books',
                'Programming Books',
                'Sci-Fi Books',
                'Beauty & Personal Care',
                'Electronics & Gadgets',
                'Fashion & Apparel',
                'Home & Kitchen',
                'Health & Fitness',
                'Books',
                'Home Decor',
                'Kids & Toys',
                'Health & Wellness',
                'Clothing'
            ],
            message: 'Please select a valid category'
        }
    },
    seller: {
        type: String,
        required: [true, "Please enter product seller"]
    },
    stock: {
        type: Number,
        required: [true, "Please enter product stock"]
    },
    numOfReviews: {
        type: Number,
        default: 0
    },
    reviews: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            },
            rating: Number,
            comment: String
        }
    ],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Product', productSchema);
