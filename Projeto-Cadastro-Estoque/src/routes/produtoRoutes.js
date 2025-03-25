import express from "express";
import {
  criarProduto,
  listarProdutos,
  deletarProduto,
  editarProduto,
} from "../controllers/produtoController.js";
import { validarProduto } from "../middlewares/validarProduto.js";

const router = express.Router();

router.post("/", validarProduto, criarProduto);
router.get("/", listarProdutos);
router.delete("/:id", deletarProduto);
// Rota para editar um produto existente
router.put("/:id", editarProduto);

export default router;
