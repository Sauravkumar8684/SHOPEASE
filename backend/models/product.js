import { Schema, model } from 'mongoose';

const productSchema = new Schema({
    name: {
        type: String,
        required: [true, "Product "],
        trim: true
    },
    description: {
        type: String,
        required: [true, "Product name is required"],
    },
    price: {
        type: Number,
        required: [true, "Product "],
        max: [99999999, "Price should not exceed 8 digits"]
    },
    category: {
        type: String,
        required: [true, "Category "]
    },
    stock: {
        type: Number,
        required: [true, "Stock "],
        default: 1
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    ImageUrl: {
        type: String,
        required: [true, "Image URL is required"]
    }
});


export default model('Product', productSchema);
