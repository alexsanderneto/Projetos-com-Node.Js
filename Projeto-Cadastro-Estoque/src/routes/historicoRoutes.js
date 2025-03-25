import express from "express";
import {
  buscarHistoricoProduto,
  buscarHistoricoGeral,
} from "../controllers/historicoController.js";

const router = express.Router();

router.get("/:id", buscarHistoricoProduto);
router.get("/", buscarHistoricoGeral);

export default router;
