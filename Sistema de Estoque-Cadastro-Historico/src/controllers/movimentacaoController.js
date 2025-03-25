import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const entradaEstoque = async (req, res) => {
  try {
    const { id } = req.params;
    let { quantidade } = req.body;
    quantidade = Number(quantidade);

    if (!quantidade || quantidade <= 0) {
      return res.status(400).json({ error: "Quantidade inválida" });
    }

    const produto = await prisma.produto.findUnique({ where: { id } });
    if (!produto) {
      return res.status(404).json({ error: "Produto não encontrado" });
    }

    const produtoAtualizado = await prisma.produto.update({
      where: { id },
      data: { quantidade: { increment: quantidade } },
    });

    await prisma.movimentacao.create({
      data: { tipo: "ENTRADA", quantidade, produtoId: id },
    });

    res.status(200).json(produtoAtualizado);
  } catch (error) {
    res.status(500).json({ error: "Erro ao registrar entrada" });
  }
};

export const saidaEstoque = async (req, res) => {
  try {
    const { id } = req.params;
    let { quantidade } = req.body;
    quantidade = Number(quantidade);

    const produto = await prisma.produto.findUnique({ where: { id } });

    if (!produto) {
      return res.status(404).json({ error: "Produto não encontrado" });
    }

    if (produto.quantidade < quantidade) {
      return res.status(400).json({ error: "Estoque insuficiente" });
    }

    const produtoAtualizado = await prisma.produto.update({
      where: { id },
      data: { quantidade: { decrement: quantidade } },
    });

    await prisma.movimentacao.create({
      data: { tipo: "SAIDA", quantidade, produtoId: id },
    });

    res.status(200).json(produtoAtualizado);
  } catch (error) {
    res.status(500).json({ error: "Erro ao registrar saída" });
  }
};
