import express from 'express';
import dotenv from 'dotenv';
import helmet from 'helmet';
import cors from 'cors';
import mongoose from 'mongoose';
import { errorHandler } from './middlewares/errorHandler';
import authRoutes from './routes/auth.route';
import userRoutes from './routes/user.route';
import companyRoutes from './routes/company.route';
import serviceRoutes from './routes/service.route';
import appointmentRoutes from './routes/appointment.route';
import blockedTimeRoutes from './routes/blockedTime.route';
dotenv.config();

const app = express();


const HOST = process.env.HOST_V1 || 'localhost';
const PORT = process.env.BACKEND_PORT_V1 || 3000;
const MONGO_URI = process.env.MONGO_URI_v1;

if (!MONGO_URI) {
  console.error('MONGO_URI_V1 is not defined');
  process.exit(1);
}

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/company', companyRoutes);
app.use('/api/v1/services', serviceRoutes);
app.use('/api/v1/appointments', appointmentRoutes);
app.use("/api/v1/blocked-times", blockedTimeRoutes);


app.use(errorHandler);

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(Number(PORT), HOST, () => {
      console.log(`Server is running at http://${HOST}:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB', error);
  });
