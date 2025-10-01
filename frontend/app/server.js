import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import rateLimit from "express-rate-limit";
import connectDB from "./config/db.js";

// Importar rotas
import userRoutes from "./routes/userRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";

dotenv.config();

const app = express();

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // máximo 100 requests por IP
  message: { error: "Muitas tentativas. Tente novamente em 15 minutos." }
});

// Middleware de segurança
app.use(helmet());
app.use(limiter);

// CORS configurado
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true
}));

// Middleware para webhook do Stripe (deve vir antes do express.json())
app.use(
  "/api/payments/webhook",
  express.raw({ type: "application/json" })
);

// Middleware de parsing
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Conectar ao banco de dados
connectDB();

// Rota de health check
app.get("/api/health", (req, res) => {
  res.json({ 
    status: "OK", 
    message: "Servidor vendeSozinho rodando com sucesso 🚀",
    timestamp: new Date().toISOString(),
    version: "1.0.0"
  });
});

// Rotas da aplicação
app.use("/api/users", userRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/ai", aiRoutes);

// Middleware para rotas não encontradas
app.use("*", (req, res) => {
  res.status(404).json({ 
    error: "Rota não encontrada",
    path: req.originalUrl 
  });
});

// Middleware de tratamento de erros
app.use((err, req, res, next) => {
  console.error("Erro:", err.stack);
  
  // Erro de validação do Joi
  if (err.isJoi) {
    return res.status(400).json({
      error: "Dados inválidos",
      details: err.details.map(detail => detail.message)
    });
  }
  
  // Erro do MongoDB
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: "Erro de validação do banco",
      details: Object.values(err.errors).map(e => e.message)
    });
  }
  
  // Erro padrão
  res.status(500).json({ 
    error: process.env.NODE_ENV === 'production' 
      ? "Erro interno do servidor" 
      : err.message 
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🔥 Servidor vendeSozinho rodando na porta ${PORT}`);
  console.log(`🌍 Ambiente: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
});