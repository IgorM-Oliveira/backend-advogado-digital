const express = require("express");
const router = express.Router();
const processosController = require("../controllers/processosController");
const authMiddleware = require('../middlewares/authMiddleware');

const { storage } = require("../multerConfig")

const multer = require('multer');
const upload = multer({ storage: storage });

router.use(authMiddleware);

// Listar todos os processos
router.get("/", processosController.listarProcessos);

// Listar todos os processos vinculados
router.get("/vinculados/:id", processosController.listarProcessosVinculados);

// Listar todos os tipos de processos
router.get("/tipos", processosController.listarTiposProcessos);

// Obter um cliente pelo ID
router.get("/:id", processosController.obterProcesso);

// Criar um novo cliente
router.post("/", processosController.criarProcesso);

// Atualizar um cliente
router.put("/:id", processosController.atualizarProcesso);

// Excluir um cliente
router.delete("/:id", processosController.excluirProcesso);

// Upload de arquivos
router.post('/upload/:id', upload.single("file"), processosController.uploadProcesso);

module.exports = router;
