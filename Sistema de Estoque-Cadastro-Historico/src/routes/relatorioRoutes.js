import express from "express";
import {
  gerarRelatorioProdutos,
  gerarRelatorioHistorico,
  gerarRelatorioHistoricoProduto,
  gerarRelatorioGeralHistorico,
} from "../controllers/relatorioController.js";

const router = express.Router();

// Rota para gerar relatórios com base no tipo selecionado no front-end
router.get("/:tipo/pdf", async (req, res) => {
  const { tipo } = req.params;

  if (tipo === "geral") {
    return gerarRelatorioGeralHistorico(req, res);
  } else if (tipo === "produtos") {
    return gerarRelatorioProdutos(req, res);
  } else if (tipo === "historico") {
    return gerarRelatorioHistorico(req, res);
  } else if (tipo === "historicoProduto") {
    return gerarRelatorioHistoricoProduto(req, res);
  } else {
    return res.status(400).json({ error: "Tipo de relatório inválido." });
  }
});

export default router;
