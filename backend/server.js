import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import productRoutes from './routes/product.routes.js';
import path from 'path'; // Fixed the incomplete import
import { fileURLToPath } from 'url'; // Need this for ES modules

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Fix for ES modules to get __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json()); // Middleware to parse JSON bodies

// Use the product routes
app.use('/api/products', productRoutes);

// Serve static files in production
if(process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '/frontend/dist')));
    
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'frontend', 'dist', 'index.html'));
    });
}

// Connect to DB and start server
app.listen(PORT, () => {
    connectDB();
    console.log('Server is running at http://localhost:' + PORT);
});