// Disable SSL certificate verification for self-signed certificates
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import path from 'path';
import authRoutes from './modules/auth/routes';
import productRoutes from './modules/products/routes';
import rentalRoutes from './modules/rentals/routes';
import paymentRoutes from './modules/payments/routes';
import userRoutes from './modules/users/routes';
import reviewRoutes from './modules/reviews/routes';
import settingsRoutes from './modules/settings/routes';
import analyticsRoutes from './modules/analytics/routes';
import notificationRoutes from './modules/notifications/routes';
import uploadRoutes from './modules/upload/routes';
import aiRoutes from './modules/ai/routes';
// import deliveryRoutes from './modules/delivery/routes';
// import promotionRoutes from './modules/promotions/routes';
import adminRoutes from './modules/admin/routes';

import passport from './config/passport';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(helmet({
  crossOriginResourcePolicy: false,
}));
app.use(cors({
  origin: [
    'https://rent-it-three.vercel.app',
    'http://localhost:3000',
    'http://localhost:3001'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());

// Serve static files for uploaded images
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date() });
});

app.get('/', (req, res) => {
  res.send('Backend is running!');
});

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/rentals', rentalRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/users', userRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/ai', aiRoutes);
// app.use('/api/delivery', deliveryRoutes);
// app.use('/api/promotions', promotionRoutes);
app.use('/api/admin', adminRoutes);

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

export default app;
