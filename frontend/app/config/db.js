// config/db.js
import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      bufferCommands: false,
      bufferMaxEntries: 0
    };

    const conn = await mongoose.connect(globalThis.process?.env.DB_URI, options);
    
    console.log(`âœ… MongoDB conectado: ${conn.connection.host}`);
    console.log(`ðŸ“Š Banco de dados: ${conn.connection.name}`);
    
    // Event listeners para monitoramento
    mongoose.connection.on('error', (err) => {
      console.error('âŒ Erro no MongoDB:', err);
    });
    
    mongoose.connection.on('disconnected', () => {
      console.warn('âš ï¸ MongoDB desconectado');
    });
    
    mongoose.connection.on('reconnected', () => {
      console.log('ðŸ”„ MongoDB reconectado');
    });
    
  } catch (error) {
    console.error(`âŒ Erro ao conectar no MongoDB: ${error.message}`);
    process.exit(1);
  }
};

export default db;
