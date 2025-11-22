// Disable SSL certificate verification for self-signed certificates
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import authRoutes from './modules/auth/routes';
import productRoutes from './modules/products/routes';
import rentalRoutes from './modules/rentals/routes';
import paymentRoutes from './modules/payments/routes';
import userRoutes from './modules/users/routes';
import reviewRoutes from './modules/reviews/routes';
import settingsRoutes from './modules/settings/routes';
import analyticsRoutes from './modules/analytics/routes';
import notificationRoutes from './modules/notifications/routes';
// import deliveryRoutes from './modules/delivery/routes';
// import promotionRoutes from './modules/promotions/routes';
import adminRoutes from './modules/admin/routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date() });
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
// app.use('/api/delivery', deliveryRoutes);
// app.use('/api/promotions', promotionRoutes);
app.use('/api/admin', adminRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
