const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // <-- Must come BEFORE routes
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/book-uploads', express.static(path.join(__dirname, 'book-uploads')));

// Routes
const userRoutes = require('./routes/userRoutes');
const booksRoutes = require('./routes/booksRoute');
const ordersRoutes = require('./routes/ordersRoute');
const favoritesRoutes = require('./routes/favoritesRoutes');
const adminRoutes = require('./routes/adminRoutes'); // ✅ Admin route

app.use('/api/users', userRoutes);
app.use('/api/books', booksRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/favorites', favoritesRoutes);
app.use('/api/admin', adminRoutes); // ✅ Mounted admin route

// Root route
app.get('/', (req, res) => res.send('Welcome to the Simple App API!'));

// Start server
const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
