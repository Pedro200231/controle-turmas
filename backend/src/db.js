import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const uri = process.env.MONGO_URI;
if (!uri) {
  console.error('❌ MONGO_URI não definido em .env');
  process.exit(1);
}

export const connectDB = async () => {
  try {
    await mongoose.connect(uri);
    console.log('✅ Conectado ao MongoDB');
  } catch (error) {
    console.error('❌ Erro ao conectar ao MongoDB:', error);
    process.exit(1);
  }
};
