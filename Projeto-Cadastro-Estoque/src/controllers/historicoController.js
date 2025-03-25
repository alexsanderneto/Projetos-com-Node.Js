import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

/**
 * 📌 Buscar histórico de um produto pelo ID
 */
export const buscarHistoricoProduto = async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar se o produto existe
    const produto = await prisma.produto.findUnique({ where: { id } });

    if (!produto) {
      return res.status(404).json({ error: "Produto não encontrado" });
    }

    // Buscar histórico do produto
    const historico = await prisma.historico.findMany({
      where: { produtoId: id },
      orderBy: { createdAt: "desc" },
    });

    if (historico.length === 0) {
      return res
        .status(404)
        .json({ error: "Nenhum histórico encontrado para este produto" });
    }

    res.status(200).json(historico);
  } catch (error) {
    console.error("Erro ao buscar histórico:", error);
    res.status(500).json({ error: "Erro ao buscar histórico" });
  }
};

/**
 * 📌 Buscar histórico de todos os produtos
 */
export const buscarHistoricoGeral = async (req, res) => {
  try {
    const historico = await prisma.historico.findMany({
      include: { produto: true },
      orderBy: { createdAt: "desc" },
    });

    if (historico.length === 0) {
      return res.status(404).json({ error: "Nenhum histórico encontrado" });
    }

    res.status(200).json(historico);
  } catch (error) {
    console.error("Erro ao buscar histórico geral:", error);
    res.status(500).json({ error: "Erro ao buscar histórico geral" });
  }
};
