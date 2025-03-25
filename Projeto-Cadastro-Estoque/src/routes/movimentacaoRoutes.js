import express from "express";
import {
  entradaEstoque,
  saidaEstoque,
} from "../controllers/movimentacaoController.js";

const router = express.Router();

router.post("/:id/entrada", entradaEstoque);
router.post("/:id/saida", saidaEstoque);

export default router;
