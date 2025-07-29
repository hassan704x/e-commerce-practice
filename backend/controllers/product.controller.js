import Product from "../models/product.model.js"; // Fixed: Added .js extension
import express from "express";
import mongoose from "mongoose";

export const getProducts = async (req, res) => {
    try {
        const products = await Product.find(); // Fetch all products from the database
        res.status(200).json({ success: true, data: products });
    } catch (error) {
        console.error("Error in fetching Products:", error.message);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
}

export const createProduct = async (req, res) => {
    const productData = req.body; // Get product data from request body

    // Check if required fields are present
    if (!productData.name || !productData.price || !productData.image) {
        return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    // Create new product using the Product model (constructor)
    const newProduct = new Product(productData);

    try {
        await newProduct.save();
        res.status(201).json({ success: true, data: newProduct });
    } catch (error) {
        console.error("Error in Create Product:", error.message);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
}

export const updateProduct = async (req, res) => {
    const { id } = req.params;
    const productData = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ success: false, message: 'Invalid Product ID' });
    }

    try {
        const updatedProduct = await Product.findByIdAndUpdate(id, productData, { new: true });

        if (!updatedProduct) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        res.status(200).json({ success: true, data: updatedProduct });

    } catch (error) {
        console.error("Error in Update Product:", error.message);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
}

export const deleteProduct = async (req, res) => {
    const { id } = req.params; // Get product ID from request parameters

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ success: false, message: 'Invalid Product ID' });
    }

    try {
        const deletedProduct = await Product.findByIdAndDelete(id); // Find and delete product by ID
        
        if (!deletedProduct) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }
        
        res.status(200).json({ success: true, message: 'Product deleted successfully' });
    } catch (error) {
        console.error("Error in Delete Product:", error.message);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
}